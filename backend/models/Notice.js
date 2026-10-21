const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true
  },
  link: {
    type: String,
    default: '#',
    trim: true
  },
  isPdf: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  published: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'notices'
});

noticeSchema.index({ published: 1, createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema, 'notices');
