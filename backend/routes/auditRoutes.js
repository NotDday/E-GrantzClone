const express = require('express');
const router = express.Router();
const { AuditLog } = require('../models');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin', 'official')];

// GET /api/audit?limit=50&skip=0&action=&actorId=
router.get('/', adminOnly, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const skip = parseInt(req.query.skip) || 0;
    const filter = {};
    if (req.query.action) filter.action = req.query.action;
    if (req.query.actorId) filter.actor = req.query.actorId;
    if (req.query.targetModel) filter.targetModel = req.query.targetModel;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('actor', 'name email role'),
      AuditLog.countDocuments(filter)
    ]);

    res.json({ success: true, total, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
