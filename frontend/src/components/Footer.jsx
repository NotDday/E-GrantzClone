import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="line">
        <div className="s-12 l-6">
          <p>
            <a style={{ color: '#ffb71c' }} href="https://egrantz.kerala.gov.in/www.scdd.kerala.gov.in" target="_blank" rel="noreferrer">
              © SC ST Development Department
            </a>
          </p>
          <p>Privacy Policy | Terms of Use</p>
        </div>
        <div className="s-12 l-6">
          <a className="right" target="_blank" rel="noreferrer" href="http://cdit.org/" style={{ color: 'aliceblue' }} title="Developed by C-DIT">
            Developed by C-DIT
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
