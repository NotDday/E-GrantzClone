import React from 'react';

const Navbar = ({ navigate }) => {
  const handleNav = (path) => (e) => {
    if (path.startsWith('/')) {
      e.preventDefault();
      if (navigate) {
        navigate(path);
      } else {
        window.location.href = path;
      }
    }
  };

  return (
    <nav>
      <div className="line">
        <div className="s-12 l-2">
          <p className="logo">
            <strong style={{ color: '#ffffff' }}>e-grantz </strong>3.0
          </p>
        </div>
        <div className="top-nav s-12 l-10">
          <p className="nav-text">Menu</p>
          <ul className="right">
            <li className="active-item"><a href="/" onClick={handleNav('/')}>Home</a></li>
            <li><a href="#scholarships">Notice Board</a></li>
            <li><a href="#OfficialLogin">Login</a></li>
            <li><a href="/contact" onClick={handleNav('/contact')}>Contact</a></li>
            <li><a href="/faq" onClick={handleNav('/faq')}>FAQ</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
