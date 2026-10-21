import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const NoticeBoardPage = ({ navigate }) => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios.get('/api/notices')
      .then(res => setNotices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <PortalLayout navigate={navigate} title="NOTICE BOARD">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Latest Notifications & Circulars</h2>
            </div>
            <div className="body">
              <ul className="list-group">
                {notices.map((n, idx) => (
                  <li key={n._id || idx} className="list-group-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#f44336' }}>
                        {n.isPdf ? 'picture_as_pdf' : 'notifications'}
                      </i>
                      {n.title}
                    </span>
                    {n.link && (
                      <a href={n.link} target="_blank" rel="noopener noreferrer"
                        className="btn btn-danger btn-sm waves-effect">
                        {n.isPdf ? 'Download PDF' : 'View'}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default NoticeBoardPage;
