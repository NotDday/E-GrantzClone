const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'District name is required'],
    unique: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    uppercase: true,
    trim: true
  },
  state: {
    type: String,
    default: 'Kerala',
    trim: true
  }
}, {
  timestamps: true,
  collection: 'districts'
});

module.exports = mongoose.model('District', districtSchema, 'districts');
