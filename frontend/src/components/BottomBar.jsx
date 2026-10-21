import React from 'react';

const BottomBar = ({ navigate }) => {
  const handleNav = (path) => (e) => {
    e.preventDefault();
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  return (
    <div style={{ background: '#ffb71c', position: 'fixed', left: '0px', bottom: '0px', height: '50px', width: '100%', overflow: 'hidden', zIndex: 100 }}>
      <div className="s-12 l-12">
        <div align="center" style={{ textAlign: 'center', paddingTop: '10px' }}>
          <a className="blackbtn" href="/register" onClick={handleNav('/register')}>
            Register
          </a>
          <a className="blackbtn" href="/login" onClick={handleNav('/login')}>
            Student Login
          </a>
          <a className="blackbtn" href="/track-application" onClick={handleNav('/track-application')}>
            Track Application
          </a>
          <a className="blackbtn" href="#OfficialLogin">
            Official Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
