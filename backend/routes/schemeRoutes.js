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

// GET /api/schemes/:id - Public: scheme detail (brochure)
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/schemes/eligibility - Public: check eligibility
// Body: { category, income, courseLevel? }
router.post('/eligibility', async (req, res) => {
  try {
    const { category, income, courseLevel } = req.body;
    if (!category || income === undefined) {
      return res.status(400).json({ success: false, message: 'category and income are required' });
    }
    const incomeNum = Number(income);
    const all = await Scheme.find({ active: true }).sort({ name: 1 });
    const eligible = all.filter(s => {
      const catOk = !s.categoryEligible || s.categoryEligible.length === 0 || s.categoryEligible.includes(category);
      const incomeOk = s.maxIncome == null || s.maxIncome === 0 || incomeNum <= s.maxIncome;
      return catOk && incomeOk;
    });
    const notEligible = all.filter(s => !eligible.includes(s));
    res.json({ success: true, eligible, notEligible, inputs: { category, income: incomeNum, courseLevel } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
