const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  actorRole: {
    type: String,
    enum: ['student', 'institution', 'official', 'admin'],
    required: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'application_approved', 'application_rejected', 'application_reverted',
      'application_submitted', 'application_paid',
      'document_verified', 'document_uploaded',
      'scheme_created', 'scheme_updated', 'scheme_deleted',
      'notice_created', 'notice_deleted',
      'student_profile_updated', 'password_changed',
      'admin_login'
    ],
    index: true
  },
  targetModel: {
    type: String,
    enum: ['Application', 'Document', 'Scheme', 'Notice', 'Student'],
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ip: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'audit_logs'
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema, 'audit_logs');
