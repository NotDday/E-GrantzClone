import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PortalLayout = ({ navigate, title, children }) => {
  const [student, setStudent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      if (navigate) navigate('/login');
      else window.location.href = '/login';
      return;
    }

    axios.get('/api/students/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setStudent(res.data.student);
        if (res.data.student?.userId?.lastLoginAt) {
          setLastLogin(new Date(res.data.student.userId.lastLoginAt));
        }
      })
      .catch((err) => {
        console.warn('Could not fetch student data from API:', err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    if (navigate) navigate('/login');
    else window.location.href = '/login';
  };

  const handleNav = (path) => (e) => {
    e.preventDefault();
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  const currentPath = window.location.pathname;

  return (
    <div className="theme-red" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Top Navbar */}
      <nav className="navbar" style={{ backgroundColor: '#002147' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 15px', minHeight: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a
              className="bars"
              href="#"
              onClick={(e) => { e.preventDefault(); setSidebarOpen(p => !p); }}
              style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}
            >
              <i className="material-icons">menu</i>
            </a>
            <a href="/" onClick={handleNav('/')} style={{ color: '#fff', fontSize: '18px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <b>e-grantz </b>
              <b style={{ color: '#ffb71c' }}>3.0 </b>
              <b className="hidden-xs" style={{ color: '#c6d3e2', fontWeight: 'normal' }}>
                | Single Window Scholarship portal
              </b>
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <ul style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 0, padding: 0, listStyle: 'none', gap: '4px' }}>
              <li>
                <a href="#" className="js-search" onClick={(e) => e.preventDefault()} style={{ color: '#fff', padding: '10px 15px' }}>
                  <i className="material-icons" style={{ fontSize: '20px' }}>search</i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleLogout(); }}
                  className="btn btn-warning"
                  style={{
                    backgroundColor: '#ff9800',
                    borderColor: '#ff9800',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '8px'
                  }}
                  title="Sign out"
                >
                  <i className="material-icons" style={{ color: '#fff', fontSize: '18px' }}>input</i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <section className={sidebarOpen ? '' : 'ls-closed'}>
        {/* Left Sidebar */}
        <aside id="leftsidebar" className="sidebar" style={{ backgroundColor: '#fff' }}>
          {/* User Info */}
          <div
            className="user-info"
            style={{
              padding: '13px 15px 12px 15px',
              whiteSpace: 'nowrap',
              position: 'relative',
              borderBottom: '1px solid #e9e9e9',
              backgroundImage: 'url("/assets/images/user-img-background.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '135px',
              overflow: 'hidden'
            }}
          >
            <div className="image" style={{ marginRight: '12px', display: 'inline-block', width: '48px', height: '48px' }}>
              <img
                src={student?.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23c8d6e5'/%3E%3Ccircle cx='24' cy='19' r='9' fill='%23ffffff'/%3E%3Cellipse cx='24' cy='42' rx='15' ry='11' fill='%23ffffff'/%3E%3C/svg%3E"}
                width="48"
                height="48"
                alt="User"
                style={{
                  width: '48px',
                  height: '48px',
                  maxWidth: '48px',
                  maxHeight: '48px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  verticalAlign: 'bottom',
                  display: 'inline-block',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div className="info-container" style={{ display: 'block', position: 'relative', top: '10px' }}>
              <div
                className="name"
                style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.8)', cursor: 'pointer', lineHeight: '1.4' }}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                {student?.userId?.name || "Student"}
                <br />
                <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.85 }}>Student</span>
                <br />
                <span style={{ fontSize: '10px', fontWeight: 'normal', opacity: 0.75 }}>
                  Last Login: {lastLogin
                    ? lastLogin.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </span>
              </div>
              <div className="btn-group user-helper-dropdown" style={{ position: 'absolute', right: 0, bottom: '-8px' }}>
                <i
                  className="material-icons"
                  style={{ color: '#fff', cursor: 'pointer', fontSize: '20px' }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  keyboard_arrow_down
                </i>
                {userDropdownOpen && (
                  <ul className="dropdown-menu pull-right" style={{ display: 'block', position: 'absolute', right: 0, top: '22px', minWidth: '160px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', padding: '5px 0', zIndex: 1000, borderRadius: '2px' }}>
                    <li>
                      <a href="/portal/change-password" onClick={handleNav('/portal/change-password')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
                        <i className="material-icons" style={{ fontSize: '18px' }}>edit</i>
                        Change Password
                      </a>
                    </li>
                    <li role="separator" className="divider" style={{ margin: '5px 0', borderTop: '1px solid #eee' }}></li>
                    <li>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
                        <i className="material-icons" style={{ fontSize: '18px' }}>input</i>
                        Sign Out
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="menu" style={{ height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
            <ul className="list" style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
              <li className="header" style={{
                background: '#ffb71c',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                padding: '8px 16px',
                letterSpacing: '0.5px'
              }}>
                MAIN NAVIGATION
              </li>

              <li className={currentPath === '/portal' || currentPath === '/portal/' ? 'active' : ''}>
                <a href="/portal" onClick={handleNav('/portal')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#F44336' }}>
                  <i className="material-icons" style={{ color: '#F44336', fontSize: '18px' }}>home</i>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Welcome to eGrantz</span>
                    <span style={{ fontSize: '10px', color: '#888', fontWeight: 'normal' }}>
                      Last Login: {lastLogin
                        ? lastLogin.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </span>
                  </div>
                </a>
              </li>

              <li className={currentPath === '/portal/track' ? 'active' : ''}>
                <a href="/portal/track" onClick={handleNav('/portal/track')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: currentPath === '/portal/track' ? '#F44336' : '#555' }}>
                  <i className="material-icons" style={{ color: currentPath === '/portal/track' ? '#F44336' : '#777', fontSize: '18px' }}>search</i>
                  <span>Track Details</span>
                </a>
              </li>

              <li className={currentPath === '/portal/applications' ? 'active' : ''}>
                <a href="/portal/applications" onClick={handleNav('/portal/applications')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: currentPath === '/portal/applications' ? '#F44336' : '#555' }}>
                  <i className="material-icons" style={{ color: currentPath === '/portal/applications' ? '#F44336' : '#777', fontSize: '18px' }}>verified</i>
                  <span>Application Verification</span>
                </a>
              </li>

              <li className={currentPath === '/portal/profile' ? 'active' : ''}>
                <a href="/portal/profile" onClick={handleNav('/portal/profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: currentPath === '/portal/profile' ? '#F44336' : '#555' }}>
                  <i className="material-icons" style={{ color: currentPath === '/portal/profile' ? '#F44336' : '#777', fontSize: '18px' }}>account_circle</i>
                  <span>Profile</span>
                </a>
              </li>

              <li className={currentPath === '/portal/qualifications' ? 'active' : ''}>
                <a href="/portal/qualifications" onClick={handleNav('/portal/qualifications')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: currentPath === '/portal/qualifications' ? '#F44336' : '#555' }}>
                  <i className="material-icons" style={{ color: currentPath === '/portal/qualifications' ? '#F44336' : '#777', fontSize: '18px' }}>school</i>
                  <span>Add Qualification</span>
                </a>
              </li>

              <li className={currentPath === '/portal/schemes' ? 'active' : ''}>
                <a href="/portal/schemes" onClick={handleNav('/portal/schemes')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: currentPath === '/portal/schemes' ? '#F44336' : '#555' }}>
                  <i className="material-icons" style={{ color: currentPath === '/portal/schemes' ? '#F44336' : '#777', fontSize: '18px' }}>assignment</i>
                  <span>Apply for Scholarships</span>
                </a>
              </li>

              <li className={currentPath === '/portal/documents' ? 'active' : ''}>
                <a href="/portal/documents" onClick={handleNav('/portal/documents')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: currentPath === '/portal/documents' ? '#F44336' : '#555' }}>
                  <i className="material-icons" style={{ color: currentPath === '/portal/documents' ? '#F44336' : '#777', fontSize: '18px' }}>folder_open</i>
                  <span>Document Vault</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Version */}
          <div className="legal" style={{ position: 'sticky', bottom: 0, width: '100%', padding: '10px 16px', backgroundColor: '#e5e8ef', borderTop: '1px solid #dcdcdc' }}>
            <div className="version" style={{ fontSize: '12px', color: '#555' }}>
              <b>Version: </b>3.0.0
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="content" style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#edf1f5' }}>
          <div className="container-fluid">
            {title && (
              <div className="block-header">
                <h2>{title}</h2>
              </div>
            )}
            {children}
          </div>
        </section>
      </section>
    </div>
  );
};

export default PortalLayout;
