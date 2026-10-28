const { AuditLog } = require('../models');

async function logAudit({ req, actor, actorRole, action, targetModel = null, targetId = null, details = {} }) {
  try {
    const ip = (req && (req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress)) || null;
    const userAgent = (req && req.headers['user-agent']) || null;
    await AuditLog.create({
      actor,
      actorRole,
      action,
      targetModel,
      targetId,
      details,
      ip,
      userAgent
    });
  } catch (err) {
    console.warn('Audit log failed:', err.message);
  }
}

module.exports = { logAudit };
