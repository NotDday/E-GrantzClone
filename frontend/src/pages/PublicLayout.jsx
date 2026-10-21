import React from 'react';

const PublicLayout = ({ navigate, title, children }) => {
  const handleNav = (path) => (e) => {
    e.preventDefault();
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/" onClick={handleNav('/')}>
              <b>e-grantz</b>
              <b style={{ color: '#ffb71c' }}> 3.0</b>
              <b className="hidden-xs" style={{ color: '#c6d3e2', fontSize: '14px', fontWeight: 'normal' }}> | Single Window Scholarship Portal</b>
            </a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/" onClick={handleNav('/')} style={{ color: '#fff' }}>
                <i className="material-icons" style={{ verticalAlign: 'middle' }}>home</i> Home
              </a></li>
              <li><a href="/login" onClick={handleNav('/login')} style={{ color: '#fff' }}>
                <i className="material-icons" style={{ verticalAlign: 'middle' }}>person</i> Student Login
              </a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <section>
        <aside className="sidebar">
          <div className="menu">
            <ul className="list">
              <li className="header">PUBLIC SERVICES</li>
              <li><a href="/" onClick={handleNav('/')}><i className="material-icons" style={{ color: '#333' }}>home</i><span>Home</span></a></li>
              <li><a href="/track-application" onClick={handleNav('/track-application')}><i className="material-icons" style={{ color: '#333' }}>search</i><span>Track Application</span></a></li>
                            <li><a href="/faq" onClick={handleNav('/faq')}><i className="material-icons" style={{ color: '#333' }}>help</i><span>FAQ</span></a></li>
              <li><a href="/contact" onClick={handleNav('/contact')}><i className="material-icons" style={{ color: '#333' }}>contact_mail</i><span>Contact Us</span></a></li>
              <li className="header">STUDENT PORTAL</li>
                            <li><a href="/register" onClick={handleNav('/register')}><i className="material-icons" style={{ color: '#333' }}>person_add</i><span>Student Register</span></a></li>
                            <li><a href="/login" onClick={handleNav('/login')}><i className="material-icons" style={{ color: '#333' }}>lock_open</i><span>Student Login</span></a></li>
            </ul>
          </div>
        </aside>

        <section className="content">
          <div className="container-fluid">
            <div className="block-header">
              <h2>{title}</h2>
            </div>
            {children}
          </div>
        </section>
      </section>
    </div>
  );
};

export default PublicLayout;
