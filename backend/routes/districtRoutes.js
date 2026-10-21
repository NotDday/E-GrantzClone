const express = require('express');
const router = express.Router();
const { District } = require('../models');

// GET /api/districts - Public: fetch all districts
router.get('/', async (req, res) => {
  try {
    const districts = await District.find().sort({ name: 1 });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
