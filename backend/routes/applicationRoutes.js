const express = require('express');
const router = express.Router();
const { Application, Student } = require('../models');
const { protect } = require('../middleware/auth');

// GET /api/applications/mine - Authenticated student's applications
router.get('/mine', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate('schemeId', 'name code amount description categoryEligible')
      .populate('institutionId', 'name code')
      .populate('courseId', 'name code durationYears')
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

// GET /api/applications/track/:applicationNumber - Public tracking
router.get('/track/:applicationNumber', async (req, res) => {
  try {
    const appNo = req.params.applicationNumber.trim();
    const application = await Application.findOne({
      applicationNumber: { $regex: new RegExp(`^${appNo}$`, 'i') }
    })
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email username' }
      })
      .populate('schemeId', 'name code amount categoryEligible')
      .populate('institutionId', 'name code address')
      .populate('courseId', 'name code');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found with given number' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/applications/approved - Get approved applications for student or portal
router.get('/approved', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const applications = await Application.find({
      studentId: student._id,
      status: 'approved'
    })
      .populate('schemeId', 'name code amount')
      .populate('institutionId', 'name code')
      .populate('courseId', 'name code');

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/applications/:id/freeship - Generate freeship card data
router.get('/:id/freeship', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'studentId',
        populate: [
          { path: 'userId', select: 'name email' },
          { path: 'casteId', select: 'name category' },
          { path: 'address.districtId', select: 'name' }
        ]
      })
      .populate('schemeId', 'name code amount')
      .populate('institutionId', 'name code address')
      .populate('courseId', 'name code');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/applications - Submit new application
router.post('/', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { schemeId, institutionId, courseId, academicYear, familyIncome } = req.body;
    const year = academicYear || '2025-2026';

    // Block duplicate: same scheme + academic year unless previous attempt is reverted
    const existing = await Application.findOne({
      studentId: student._id,
      schemeId,
      academicYear: year,
      status: { $nin: ['reverted', 'rejected'] }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You already have an active application (${existing.applicationNumber}) for this scheme in ${year}. You can re-apply only after it is reverted.`
      });
    }

    const applicationNumber = await require('../models').getNextApplicationNumber();

    const application = await Application.create({
      applicationNumber,
      studentId: student._id,
      schemeId,
      institutionId: institutionId || student.institutionId,
      courseId: courseId || student.courseId,
      academicYear: year,
      familyIncome: familyIncome || 50000,
      status: 'submitted',
      statusHistory: [{
        status: 'submitted',
        changedBy: req.user._id,
        remarks: 'Application submitted by student',
        at: new Date()
      }],
      documents: []
    });

    const populatedApp = await Application.findById(application._id)
      .populate('schemeId', 'name code amount')
      .populate('institutionId', 'name code')
      .populate('courseId', 'name code');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: populatedApp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
