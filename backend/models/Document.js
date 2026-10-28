const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required'],
    index: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    index: true
  },
  docType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: {
      values: ['income_certificate', 'caste_certificate', 'marklist', 'aadhaar', 'bank_proof', 'photo', 'other'],
      message: '{VALUE} is not a valid document type'
    },
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  fileName: {
    type: String,
    required: [true, 'Stored file name is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    trim: true
  },
  size: {
    type: Number
  },
  version: {
    type: Number,
    default: 1,
    min: 1
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'documents'
});

documentSchema.index({ studentId: 1, docType: 1, version: -1 });

module.exports = mongoose.model('Document', documentSchema, 'documents');
