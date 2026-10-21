const express = require('express');
const router = express.Router();
const { Scheme } = require('../models');

// GET /api/schemes - Public: active only
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find({ active: true }).sort({ name: 1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/schemes/applicable - Applicable schemes
router.get('/applicable', async (req, res) => {
  try {
    const schemes = await Scheme.find({ active: true }).sort({ name: 1 });
    res.json({ success: true, schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
