const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Scheme name is required'],
    unique: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: [true, 'Scheme code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  categoryEligible: [{
    type: String,
    enum: ['SC', 'ST', 'OBC', 'OEC', 'General']
  }],
  maxIncome: {
    type: Number,
    min: 0
  },
  amount: {
    type: Number,
    required: [true, 'Scholarship amount is required'],
    min: 0
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'schemes'
});

module.exports = mongoose.model('Scheme', schemeSchema, 'schemes');
