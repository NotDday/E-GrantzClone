import React, { useState } from 'react';
import axios from 'axios';
import './StudentLogin.css';

const StudentRegister = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLink = (path) => (e) => {
    e.preventDefault();
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.name || formData.name.trim().length < 2) {
      return setError('Please enter a valid full name (at least 2 characters).');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      return setError('Please enter a valid email address.');
    }

    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      return setError('Mobile number must be exactly 10 digits.');
    }

    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/auth/register-student', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password
      });

      if (res.data.success) {
        const studentId = res.data.studentId;
        sessionStorage.setItem(
          'reg_success_msg',
          `Registration successful! Your Student ID is ${studentId}. Please login below.`
        );
        if (navigate) {
          navigate('/login');
        } else {
          window.location.href = '/login';
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-page">
      <div className="login-container">
        <h2 className="logo-heading">
          e-grantz <span className="highlight">3.0</span>
        </h2>

        <div className="card">
          <div className="card-header">
            <h2>STUDENT REGISTRATION</h2>
          </div>

          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-group-addon" title="Full Name">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
                <div className="form-line">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-group-addon" title="Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <div className="form-line">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-group-addon" title="Mobile">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                  </svg>
                </span>
                <div className="form-line">
                  <input
                    type="tel"
                    name="mobile"
                    className="form-control"
                    placeholder="10-digit Mobile Number"
                    maxLength="10"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-group-addon" title="Password">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </span>
                <div className="form-line">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password (minimum 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-group-addon" title="Confirm Password">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </span>
                <div className="form-line">
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', marginBottom: '18px' }}>
                <button
                  type="submit"
                  className="btn-submit"
                  style={{ width: '100%', padding: '11px' }}
                  disabled={loading}
                >
                  {loading ? 'REGISTERING...' : 'REGISTER AS STUDENT'}
                </button>
              </div>

              <div className="links-row" style={{ justifyContent: 'center' }}>
                <a href="/login" onClick={handleLink('/login')}>
                  Already have an account? Sign In
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="home-back-link">
          <a href="/" onClick={handleLink('/')}>
            &larr; Back to e-Grantz Home Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
