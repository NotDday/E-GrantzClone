import React, { useState } from 'react';
import axios from 'axios';

const LoginSection = ({ navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [authStatus, setAuthStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setAuthStatus(null);

    try {
      const response = await axios.post('/api/auth/login', { identifier: username, password });
      if (response.data.success) {
        if (remember) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setAuthStatus(`Login Successful! Redirecting to admin portal...`);
        setTimeout(() => {
          if (navigate) {
            navigate('/admin');
          } else {
            window.location.href = '/admin';
          }
        }, 1000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div id="OfficialLogin" style={{ background: 'rgb(0, 33, 71)', paddingTop: '30px', paddingBottom: '30px' }}>
      <div className="line">
        <h2 className="section-title">LOGIN</h2>
        <div className="margin">
          <div className="s-12 m-6 l-6 hidden-xs">
            <div className="s-12 l-2">
              <div className="news-date">
                <p className="day">
                  <i style={{ color: 'rgb(0, 0, 0)' }} className="icon icon-information_white"></i>
                </p>
                <p>Important</p>
              </div>
            </div>
            <div className="s-12 l-10">
              <div className="news-text">
                <h4>Notice</h4>
                <ul style={{ fontSize: '12px', color: 'red' }}>
                  <li>Official portal login for Department Officials and Educational Institutions.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="s-12 m-6 l-6">
            <form className="modal-content animate" id="login-form" onSubmit={handleSubmit} style={{ border: '2px solid #ffb71c', borderRadius: '4px', overflow: 'hidden' }}>
              <div className="container" align="left" style={{ color: 'rgb(0, 0, 0)', width: '100%' }}>
                <div className="msg" align="center" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  OFFICIAL LOGIN
                </div>

                {authStatus && (
                  <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '10px', textAlign: 'center' }}>
                    {authStatus}
                  </div>
                )}

                {errorMessage && (
                  <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '10px', textAlign: 'center' }}>
                    {errorMessage}
                  </div>
                )}

                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter Username"
                  name="username"
                  autocomplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  name="password"
                  autocomplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" id="login-btn" style={{ color: '#ffffff' }}>Login</button>

                <label>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    name="remember"
                  />{' '}
                  Remember me
                </label>
              </div>

              <div className="container" style={{ backgroundColor: 'rgb(241, 241, 241)', width: '100%' }}>
                <button type="button" className="cancelbtn" style={{ color: '#ffffff' }} onClick={() => { setUsername(''); setPassword(''); }}>
                  Cancel
                </button>
                <span className="psw">
                  Forgot <a href="/forgot-password" onClick={(e) => { e.preventDefault(); if (navigate) navigate('/forgot-password'); }}>password?</a>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
