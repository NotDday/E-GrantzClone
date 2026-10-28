const express = require('express');
const router = express.Router();
const { Application, Scheme, Notice, Student, User, Institution } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLogger');

// Middleware for admin / official access
const adminOnly = [protect, authorize('admin', 'official')];

// GET /api/admin/stats - Dashboard stats
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const pendingApplications = await Application.countDocuments({ status: { $in: ['submitted', 'institution_verified'] } });
    const revertedApplications = await Application.countDocuments({ status: 'reverted' });
    const totalStudents = await Student.countDocuments();
    const totalSchemes = await Scheme.countDocuments();
    const totalNotices = await Notice.countDocuments();

    res.json({
      success: true,
      stats: {
        totalApplications,
        approvedApplications,
        pendingApplications,
        revertedApplications,
        totalStudents,
        totalSchemes,
        totalNotices
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/applications - List all applications
router.get('/applications', adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await Application.find(filter)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email username' }
      })
      .populate('schemeId', 'name code amount')
      .populate('institutionId', 'name code')
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/applications/:id/status - Approve or Revert application
router.put('/applications/:id/status', adminOnly, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['approved', 'reverted', 'rejected', 'paid', 'institution_verified'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedBy: req.user._id,
      remarks: remarks || `Status updated to ${status} by official`,
      at: new Date()
    });

    await application.save();

    const actionMap = { approved: 'application_approved', rejected: 'application_rejected', reverted: 'application_reverted', paid: 'application_paid', institution_verified: 'application_submitted' };
    await logAudit({
      req,
      actor: req.user._id,
      actorRole: req.user.role,
      action: actionMap[status] || 'application_submitted',
      targetModel: 'Application',
      targetId: application._id,
      details: { applicationNumber: application.applicationNumber, remarks: remarks || '' }
    });

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SCHEMES CRUD
router.get('/schemes', adminOnly, async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json({ success: true, schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/schemes', adminOnly, async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ success: true, message: 'Scheme created successfully', scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/schemes/:id', adminOnly, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, message: 'Scheme updated successfully', scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/schemes/:id', adminOnly, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// NOTICES CRUD
router.get('/notices', adminOnly, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/notices', adminOnly, async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({ success: true, message: 'Notice created successfully', notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/notices/:id', adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, message: 'Notice updated successfully', notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/notices/:id', adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
