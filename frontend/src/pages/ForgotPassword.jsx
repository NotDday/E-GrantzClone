import React, { useState } from 'react';
import axios from 'axios';
import './StudentLogin.css';

const ForgotPassword = ({ navigate }) => {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/forgot-password', { email: email.trim() });
      if (res.data.success) {
        setMessage(res.data.message || 'If the email exists in our system, an OTP has been sent.');
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/verify-otp', { email: email.trim(), otp: otp.trim() });
      if (res.data.success) {
        setMessage('OTP verified successfully! Please enter your new password.');
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword
      });
      if (res.data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          if (navigate) navigate('/login');
          else window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLink = (path) => (e) => {
    e.preventDefault();
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  return (
    <div className="student-login-page">
      <div className="login-container">
        <h2 className="logo-heading">
          e-grantz <span className="highlight">3.0</span>
        </h2>

        <div className="card">
          <div className="card-header">
            <h2>FORGOT PASSWORD</h2>
          </div>

          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                  Enter your registered email address to receive a 6-digit verification OTP.
                </p>
                <div className="input-group">
                  <span className="input-group-addon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-6V6l8 5 8-5v2z"/>
                    </svg>
                  </span>
                  <div className="form-line">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Registered Email ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button type="submit" className="btn-submit" style={{ width: '100%', marginBottom: '15px' }} disabled={loading}>
                  {loading ? 'SENDING OTP...' : 'SEND OTP'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                  Enter the 6-digit OTP sent to <strong>{email}</strong>.
                </p>
                <div className="input-group">
                  <span className="input-group-addon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  </span>
                  <div className="form-line">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button type="submit" className="btn-submit" style={{ width: '100%', marginBottom: '15px' }} disabled={loading}>
                  {loading ? 'VERIFYING...' : 'VERIFY OTP'}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                  Enter your new password (minimum 8 characters).
                </p>
                <div className="input-group">
                  <span className="input-group-addon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  </span>
                  <div className="form-line">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="New Password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button type="submit" className="btn-submit" style={{ width: '100%', marginBottom: '15px' }} disabled={loading}>
                  {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                </button>
              </form>
            )}

            <div className="links-row" style={{ justifyContent: 'center' }}>
              <a href="/login" onClick={handleLink('/login')}>
                &larr; Back to Student Login
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <a href="/" onClick={handleLink('/')} style={{ color: '#c6d3e2', fontSize: '13px', textDecoration: 'none' }}>
            &larr; Back to e-Grantz Home Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
