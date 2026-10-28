const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Document, Student, Application } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLogger');

const UPLOAD_DIR = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Inline multipart parser (no multer dependency needed — stores base64 data URI)
// Client sends: { docType, title, originalName, mimeType, size, data (base64), applicationId? }

// POST /api/documents/upload
router.post('/upload', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const { docType, title, originalName, mimeType, size, data, applicationId } = req.body;
    if (!docType || !title || !originalName || !data) {
      return res.status(400).json({ success: false, message: 'docType, title, originalName and data are required' });
    }

    // Determine version (latest + 1 for same student + docType)
    const existing = await Document.findOne({ studentId: student._id, docType }).sort({ version: -1 });
    const version = existing ? existing.version + 1 : 1;

    const fileName = `${student._id}_${docType}_v${version}_${Date.now()}`;

    // Persist base64 to disk
    const base64Data = data.includes(',') ? data.split(',')[1] : data;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const doc = await Document.create({
      studentId: student._id,
      applicationId: applicationId || null,
      docType,
      title,
      fileName,
      originalName,
      mimeType: mimeType || 'application/octet-stream',
      size: size || Buffer.from(base64Data, 'base64').length,
      version,
      uploadedBy: req.user._id
    });

    await logAudit({
      req,
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'document_uploaded',
      targetModel: 'Document',
      targetId: doc._id,
      details: { docType, version, originalName }
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/documents/mine — student's own documents
router.get('/mine', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const docs = await Document.find({ studentId: student._id })
      .sort({ docType: 1, version: -1 })
      .populate('verifiedBy', 'name role');

    res.json({ success: true, documents: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/documents/file/:fileName — serve file content as base64
router.get('/file/:fileName', protect, async (req, res) => {
  try {
    const doc = await Document.findOne({ fileName: req.params.fileName });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    // Students can only access their own; admin/official can access any
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student || !doc.studentId.equals(student._id)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }

    const filePath = path.join(UPLOAD_DIR, req.params.fileName);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found on disk' });

    const fileBuffer = fs.readFileSync(filePath);
    res.json({
      success: true,
      mimeType: doc.mimeType,
      data: `data:${doc.mimeType};base64,${fileBuffer.toString('base64')}`,
      originalName: doc.originalName
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/documents/:id/verify — admin/official marks doc as verified
router.patch('/:id/verify', protect, authorize('admin', 'official'), async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    doc.verified = true;
    doc.verifiedBy = req.user._id;
    doc.verifiedAt = new Date();
    doc.remarks = req.body.remarks || '';
    await doc.save();

    await logAudit({
      req,
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'document_verified',
      targetModel: 'Document',
      targetId: doc._id,
      details: { docType: doc.docType, studentId: doc.studentId }
    });

    res.json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/documents/student/:studentId — admin/official views a student's docs
router.get('/student/:studentId', protect, authorize('admin', 'official', 'institution'), async (req, res) => {
  try {
    const docs = await Document.find({ studentId: req.params.studentId })
      .sort({ docType: 1, version: -1 })
      .populate('verifiedBy', 'name role');
    res.json({ success: true, documents: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
