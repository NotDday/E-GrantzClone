import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Reusable profile completeness meter. Use `blockSubmission` to render the
// "complete your profile before applying" notice when percent < 100.
const ProfileCompleteness = ({ blockSubmission = false, onReady = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (!token()) { setLoading(false); return; }
    axios.get('/api/students/me/completeness', { headers: { Authorization: `Bearer ${token()}` } })
      .then(res => {
        setData(res.data);
        if (onReady) onReady(res.data);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="alert alert-info" style={{ fontSize: '13px' }}>Checking profile completeness...</div>;
  if (!data) return null;

  const color = data.percent === 100 ? '#2e7d32' : data.percent >= 60 ? '#f9a825' : '#c62828';

  return (
    <div className="card" style={{ marginBottom: '20px', border: `1px solid ${color}33` }}>
      <div className="body" style={{ padding: '15px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong style={{ color: '#333' }}>
            📋 Profile Completeness
          </strong>
          <span style={{ fontWeight: 'bold', color, fontSize: '16px' }}>{data.percent}%</span>
        </div>
        <div style={{ background: '#eee', borderRadius: '10px', height: '12px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{
            width: `${data.percent}%`,
            height: '100%',
            background: color,
            transition: 'width 0.4s ease'
          }} />
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          {data.doneCount} of {data.total} fields completed
        </div>

        {data.percent < 100 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.checks.filter(c => !c.done).map(c => (
              <span key={c.key} style={{
                background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80',
                borderRadius: '3px', padding: '2px 8px', fontSize: '12px'
              }}>
                ⚠ {c.label}
              </span>
            ))}
          </div>
        )}

        {blockSubmission && data.percent < 100 && (
          <div className="alert alert-warning" style={{ marginTop: '15px', marginBottom: 0, fontSize: '13px' }}>
            <strong>Action required:</strong> Complete the highlighted fields in your profile before submitting a scholarship application.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCompleteness;
