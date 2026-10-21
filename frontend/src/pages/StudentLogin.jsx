import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentLogin.css';

const StudentLogin = ({ navigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const flash = sessionStorage.getItem('reg_success_msg');
    if (flash) {
      setSuccessMsg(flash);
      sessionStorage.removeItem('reg_success_msg');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', {
        identifier: identifier.trim(),
        password
      });

      if (res.data.success) {
        if (rememberMe) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } else {
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('user', JSON.stringify(res.data.user));
        }
        setSuccessMsg(`Welcome, ${res.data.user.name || res.data.user.username}! Login successful. Redirecting...`);
        setTimeout(() => {
          if (navigate) {
            navigate(res.data.user.role === 'admin' || res.data.user.role === 'official' ? '/admin' : '/portal/profile');
          } else {
            window.location.href = res.data.user.role === 'admin' || res.data.user.role === 'official' ? '/admin' : '/portal/profile';
          }
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLink = (path) => (e) => {
    e.preventDefault();
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
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
            <h2>STUDENT LOGIN</h2>
          </div>

          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-group-addon" title="Student ID / Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
                <div className="form-line">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email ID / Student ID"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoFocus
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
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="action-row">
                <label className="remember-wrap">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
              </div>

              <div className="links-row">
                <a href="/register" onClick={handleLink('/register')}>
                  New Registration
                </a>
                <a href="/forgot-password" onClick={handleLink('/forgot-password')}>
                  Forgot Password?
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

export default StudentLogin;
