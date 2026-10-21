const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Student, getNextStudentRegisterNumber } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const { sendOtpEmail } = require('../utils/email');

const { body } = require('express-validator');
const validate = require('../middleware/validate');

// POST /api/auth/login - Takes { identifier, password }
router.post('/login', [
  body('identifier').trim().notEmpty().withMessage('Identifier is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  validate
], async (req, res, next) => {
  const { identifier: idField, username, registerNumber, email, password } = req.body;
  const identifier = idField || registerNumber || email || username;

  try {
    const trimmedId = String(identifier).trim();
    const user = await User.findOne({
      $or: [
        { username: trimmedId },
        { username: trimmedId.toUpperCase() },
        { email: trimmedId.toLowerCase() }
      ]
    }).select('+password');

    if (user && (await user.comparePassword(password))) {
      user.lastLoginAt = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'egrantz_super_secret_jwt_key_2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId
        },
        token
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register-student - Public registration
router.post('/register-student', rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 }), async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Valid full name (minimum 2 characters) is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).trim())) {
    return res.status(400).json({ success: false, message: 'Valid email address is required' });
  }

  const cleanMobile = String(mobile || '').trim();
  if (!/^\d{10}$/.test(cleanMobile)) {
    return res.status(400).json({ success: false, message: 'Mobile number must be exactly 10 digits' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  try {
    const cleanEmail = String(email).trim().toLowerCase();

    // Reject duplicate email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email address already registered' });
    }

    // Auto-generate registerNumber (e.g. STU000001)
    const registerNumber = await getNextStudentRegisterNumber();

    // Create User (always force role "student")
    const user = await User.create({
      username: registerNumber,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'student',
      isActive: true
    });

    // Create minimal Student profile linked by userId
    await Student.create({
      userId: user._id,
      registerNumber,
      phone: cleanMobile
    });

    return res.status(201).json({
      success: true,
      message: 'Student registration successful',
      studentId: registerNumber,
      user: {
        id: user._id,
        username: registerNumber,
        name: user.name,
        email: user.email,
        role: 'student'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/forgot-password - Send OTP to registered email
router.post('/forgot-password', rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      // Don't reveal whether email exists — respond neutral success
      return res.json({ success: true, message: 'If the email exists in our system, an OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.passwordResetOtp = otp;
    user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await sendOtpEmail(user.email, user.name, otp);

    res.json({ success: true, message: 'If the email exists in our system, an OTP has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/verify-otp - Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordResetOtp +passwordResetOtpExpires');
    if (!user || !user.passwordResetOtp) {
      return res.status(400).json({ success: false, message: 'No OTP request found. Please request a new OTP.' });
    }

    if (user.passwordResetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (user.passwordResetOtp !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    res.json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/reset-password - Reset password after OTP verification
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordResetOtp +passwordResetOtpExpires');
    if (!user || !user.passwordResetOtp) {
      return res.status(400).json({ success: false, message: 'No OTP request found. Please request a new OTP.' });
    }

    if (user.passwordResetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (user.passwordResetOtp !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    user.password = newPassword;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/create-staff - Admin-only route for creating staff users
router.post('/create-staff', protect, authorize('admin'), async (req, res) => {
  const { username, name, email, password, role, institutionId } = req.body;

  if (!username || !name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'username, name, email, password, and role are required'
    });
  }

  if (!['institution', 'official', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role must be one of: institution, official, admin'
    });
  }

  try {
    const existing = await User.findOne({
      $or: [
        { username: String(username).trim() },
        { email: String(email).trim().toLowerCase() }
      ]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already in use'
      });
    }

    const staffUser = await User.create({
      username: String(username).trim(),
      name: name.trim(),
      email: String(email).trim().toLowerCase(),
      password,
      role,
      institutionId: role === 'institution' ? institutionId : undefined,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: `Staff user (${role}) created successfully`,
      user: {
        id: staffUser._id,
        username: staffUser.username,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with given identifier' });
    }
    res.json({ success: true, message: 'Password reset instructions sent to registered email/mobile' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/mobile-change
router.post('/mobile-change', protect, async (req, res) => {
  try {
    const { oldMobile, newMobile, reason } = req.body;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    student.phone = newMobile;
    await student.save();
    res.json({ success: true, message: 'Mobile number updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
