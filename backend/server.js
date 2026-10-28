require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and Logging Middleware
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Global API Rate Limiter (skips authenticated requests)
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests from this IP, please try again after 5 minutes' },
  // Skip rate limiting for authenticated requests (valid Bearer token present)
  skip: async (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return false;
    const token = auth.split(' ')[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'egrantz_super_secret_jwt_key_2026');
      return true; // valid token → skip limiter
    } catch {
      return false; // invalid/expired token → still rate limit
    }
  }
});

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'e-Grantz 3.0 MERN Backend is running smoothly' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/districts', require('./routes/districtRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Error Handling Middleware
app.use(errorHandler);

// Define a catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const { syncAllIndexes } = require('./models');

const PORT = process.env.PORT || 5000;

// Connect DB first, sync indexes, then start server
connectDB().then(async () => {
  await syncAllIndexes();
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
});
