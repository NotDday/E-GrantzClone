const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// GET /api/notices - Public: published only
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({
      $or: [{ published: true }, { active: true }]
    }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/notices
router.post('/', async (req, res) => {
  try {
    const { title, link, isPdf, category } = req.body;
    const newNotice = new Notice({ title, link, isPdf, category });
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
