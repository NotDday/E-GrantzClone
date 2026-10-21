const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    uppercase: true,
    trim: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: [true, 'Institution is required'],
    index: true
  },
  durationYears: {
    type: Number,
    default: 4
  }
}, {
  timestamps: true,
  collection: 'courses'
});

courseSchema.index({ institutionId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema, 'courses');
