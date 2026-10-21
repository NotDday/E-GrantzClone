const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['student', 'institution', 'official', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'student',
    index: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastLoginAt: {
    type: Date
  },
  passwordResetOtp: {
    type: String,
    select: false
  },
  passwordResetOtpExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true,
  collection: 'users'
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error('Password field not selected');
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Backward-compat alias
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await this.comparePassword(candidatePassword);
};

module.exports = mongoose.model('User', userSchema, 'users');
