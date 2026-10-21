const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  directorate: {
    type: String,
    required: [true, 'Directorate name is required'],
    trim: true,
    index: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  tollFree: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true,
  collection: 'contacts'
});

module.exports = mongoose.model('Contact', contactSchema, 'contacts');
