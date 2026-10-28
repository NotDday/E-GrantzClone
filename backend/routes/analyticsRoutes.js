const express = require('express');
const router = express.Router();
const { Application, Scheme, District } = require('../models');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin', 'official')];

// GET /api/analytics/overview — scheme-wise, stage-wise, category-wise counts
router.get('/overview', adminOnly, async (req, res) => {
  try {
    const [byScheme, byStatus, byDistrict] = await Promise.all([
      Application.aggregate([
        { $lookup: { from: 'schemes', localField: 'schemeId', foreignField: '_id', as: 'scheme' } },
        { $unwind: { path: '$scheme', preserveNullAndEmptyArrays: false } },
        { $group: { _id: { schemeId: '$schemeId', schemeName: '$scheme.name', status: '$status' }, count: { $sum: 1 }, amount: { $sum: '$scheme.amount' } } },
        { $sort: { '_id.schemeName': 1 } }
      ]),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Application.aggregate([
        { $lookup: { from: 'students', localField: 'studentId', foreignField: '_id', as: 'student' } },
        { $unwind: { path: '$student', preserveNullAndEmptyArrays: false } },
        { $lookup: { from: 'districts', localField: 'student.address.districtId', foreignField: '_id', as: 'district' } },
        { $unwind: { path: '$district', preserveNullAndEmptyArrays: false } },
        { $match: { status: { $in: ['approved', 'paid'] } } },
        { $group: { _id: { districtId: '$district._id', districtName: '$district.name' }, count: { $sum: 1 } } },
        { $sort: { '_id.districtName': 1 } }
      ])
    ]);

    // Pivot byScheme into { schemeName: { status: count } }
    const schemePivot = {};
    for (const row of byScheme) {
      const name = row._id.schemeName;
      if (!schemePivot[name]) schemePivot[name] = {};
      schemePivot[name][row._id.status] = row.count;
    }

    res.json({
      success: true,
      byStatus,
      byScheme: schemePivot,
      byDistrict
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/category — category-wise counts (from scheme.categoryEligible)
router.get('/category', adminOnly, async (req, res) => {
  try {
    const rows = await Application.aggregate([
      { $match: { status: { $in: ['approved', 'paid', 'submitted', 'institution_verified'] } } },
      { $lookup: { from: 'schemes', localField: 'schemeId', foreignField: '_id', as: 'scheme' } },
      { $unwind: { path: '$scheme', preserveNullAndEmptyArrays: false } },
      { $unwind: { path: '$scheme.categoryEligible', preserveNullAndEmptyArrays: false } },
      { $group: { _id: { category: '$scheme.categoryEligible', status: '$status' }, count: { $sum: 1 } } },
      { $sort: { '_id.category': 1 } }
    ]);

    const pivot = {};
    for (const row of rows) {
      const cat = row._id.category;
      if (!pivot[cat]) pivot[cat] = {};
      pivot[cat][row._id.status] = row.count;
    }

    res.json({ success: true, byCategory: pivot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/export/csv — CSV download of all applications
router.get('/export/csv', adminOnly, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .populate('schemeId', 'name code amount')
      .populate('institutionId', 'name code')
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 })
      .lean();

    const headers = ['Application No', 'Student Name', 'Email', 'Scheme', 'Institution', 'Course', 'Academic Year', 'Family Income', 'Status', 'Applied On'];
    const rows = applications.map(a => [
      a.applicationNumber,
      a.studentId?.userId?.name || '',
      a.studentId?.userId?.email || '',
      a.schemeId?.name || '',
      a.institutionId?.name || '',
      a.courseId?.name || '',
      a.academicYear,
      a.familyIncome,
      a.status,
      a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : ''
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

    const csv = [headers.join(','), ...rows].join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications_export.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
