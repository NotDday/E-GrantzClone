import React from 'react';
import './StudentLogin.css';

const MobileChange = ({ navigate }) => {
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
            <h2>MOBILE NUMBER CHANGE</h2>
          </div>

          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ padding: '20px 10px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#e0f7fa',
                color: '#00BCD4',
                marginBottom: '15px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                </svg>
              </div>

              <h3 style={{ fontSize: '18px', color: '#002147', margin: '0 0 10px 0', fontWeight: 'bold' }}>
                Coming Soon
              </h3>

              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                Online Mobile Number Change Request with Aadhaar verification is being upgraded for enhanced security and will be available soon.
              </p>

              <p style={{ color: '#888', fontSize: '12px', margin: '0 0 25px 0' }}>
                To update your registered mobile number now, submit a signed request along with Aadhaar copy to your Institution Nodal Officer.
              </p>

              <button
                type="button"
                className="btn-submit"
                style={{ width: '100%' }}
                onClick={handleLink('/login')}
              >
                Back to Login
              </button>
            </div>
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

export default MobileChange;
