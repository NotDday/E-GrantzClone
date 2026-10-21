import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('/api/notices');
        setNotices(response.data);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div id="scholarships" style={{ background: 'rgb(79, 109, 144)', paddingTop: '30px', paddingBottom: '30px' }}>
      <div className="line">
        <h2 className="section-title">Notice Board</h2>
        <div className="tabs">
          <div className="tab-item tab-active">
            <div className="tab-content">
              <div className="margin">
                <ul style={{ color: 'white' }}>
                  {loading ? (
                    <li>Loading notices...</li>
                  ) : (
                    notices.map((notice, index) => (
                      <li key={notice._id || index}>
                        {notice.link ? (
                          <a href={notice.link} target="_blank" rel="noreferrer" style={{ color: 'white' }}>
                            {notice.title}
                          </a>
                        ) : (
                          notice.title
                        )}
                      </li>
                    ))
                  )}
                </ul>
                <p>&nbsp;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
