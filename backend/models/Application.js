const mongoose = require('mongoose');
const { getNextApplicationNumber } = require('./Counter');

const applicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    required: [true, 'Application number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required'],
    index: true
  },
  schemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: [true, 'Scheme reference is required'],
    index: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: [true, 'Institution reference is required'],
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required'],
    index: true
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  },
  familyIncome: {
    type: Number,
    required: [true, 'Family income is required'],
    min: [0, 'Family income cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'submitted', 'institution_verified', 'approved', 'rejected', 'reverted', 'paid'],
      message: '{VALUE} is not a valid status'
    },
    default: 'draft',
    index: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['draft', 'submitted', 'institution_verified', 'approved', 'rejected', 'reverted', 'paid'],
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    remarks: {
      type: String,
      trim: true
    },
    at: {
      type: Date,
      default: Date.now
    }
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true,
  collection: 'applications'
});

applicationSchema.pre('validate', async function (next) {
  if (!this.applicationNumber) {
    const year = this.academicYear ? this.academicYear.split('-')[0] : new Date().getFullYear();
    this.applicationNumber = await getNextApplicationNumber(year);
  }
  next();
});

applicationSchema.index({ studentId: 1, schemeId: 1, academicYear: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema, 'applications');
