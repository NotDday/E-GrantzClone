import React from 'react';

const TopBar = () => {
  return (
    <div id="topbar">
      <div className="line">
        <div className="s-12 m-6 l-6">
          <p>Government of Kerala | <strong>SC/ST/OBC Departments</strong></p>
        </div>
        <div className="s-12 m-6 l-6">
          <div className="social right">
            <a><i className="icon-facebook_circle"></i></a> <a><i className="icon-twitter_circle"></i></a> <a><i className="icon-google_plus_circle"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
