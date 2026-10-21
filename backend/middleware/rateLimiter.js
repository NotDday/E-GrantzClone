const rateLimitMap = new Map();

// In-memory sliding-window rate limiter
const rateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 20 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'ip_unknown';
    const now = Date.now();

    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + options.windowMs };
    } else {
      record.count += 1;
    }

    rateLimitMap.set(ip, record);

    if (record.count > options.max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
