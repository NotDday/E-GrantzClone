const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true,
    index: true
  },
  registerNumber: {
    type: String,
    required: [true, 'Register number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender'
    },
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    line1: { type: String, trim: true },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      index: true
    },
    pincode: { type: String, trim: true }
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  yearOfStudy: {
    type: Number,
    min: [1, 'Year of study must be at least 1'],
    max: [6, 'Year of study cannot exceed 6']
  },
  aadhaarLast4: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^\d{4}$/.test(v);
      },
      message: 'Aadhaar last 4 digits must be exactly 4 digits'
    }
  },
  bank: {
    accountHolder: { type: String, trim: true },
    bankName: { type: String, trim: true },
    branchName: { type: String, trim: true },
    ifsc: { type: String, uppercase: true, trim: true },
    accountLast4: { type: String, trim: true },
    accountNumberEncrypted: { type: String, select: false }
  },
  profilePic: { type: String, trim: true },
  presentAddress: {
    line1: { type: String, trim: true },
    pincode: { type: String, trim: true }
  },
  qualifications: [{
    semester: { type: Number, required: true, min: 1, max: 12 },
    academicYear: { type: String, trim: true },
    gpa: { type: Number, min: 0, max: 10 },
    percentage: { type: Number, min: 0, max: 100 }
  }]
}, {
  timestamps: true,
  collection: 'students'
});

studentSchema.index({ institutionId: 1, courseId: 1 });

module.exports = mongoose.model('Student', studentSchema, 'students');
