import React, { useState } from 'react';
import axios from 'axios';
import PublicLayout from './PublicLayout';

const TrackApplicationPage = ({ navigate }) => {
  const [appNumber, setAppNumber] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!appNumber.trim()) return;
    setError('');
    setApplication(null);
    setLoading(true);

    try {
      const res = await axios.get(`/api/applications/track/${appNumber.trim()}`);
      if (res.data.success) setApplication(res.data.application);
    } catch (err) {
      setError(err.response?.data?.message || 'Application not found');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    submitted: '#2196F3', institution_verified: '#9C27B0',
    approved: '#4CAF50', rejected: '#f44336', paid: '#FF9800', draft: '#9E9E9E'
  };

  return (
    <PublicLayout navigate={navigate} title="TRACK APPLICATION STATUS">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Track Post-Matric / OTR Application Status</h2>
            </div>
            <div className="body">
              <form onSubmit={handleTrack} className="form-horizontal" style={{ marginBottom: '20px' }}>
                <div className="input-group">
                  <input type="text" className="form-control"
                    placeholder="Enter Application Number (e.g., EG2026...)"
                    value={appNumber} onChange={e => setAppNumber(e.target.value)} required />
                  <span className="input-group-btn">
                    <button type="submit" className="btn btn-primary waves-effect" disabled={loading}>
                      <i className="material-icons">search</i> {loading ? 'Searching...' : 'Search'}
                    </button>
                  </span>
                </div>
              </form>

              {error && <div className="alert alert-danger">{error}</div>}

              {application && (
                <div>
                  <div className="alert alert-success">Application found!</div>
                  <table className="table table-striped table-bordered table-hover" style={{ fontFamily: "'Segoe UI'", fontWeight: 'bold' }}>
                    <tbody>
                      <tr style={{ backgroundColor: '#A9F5A9' }}><td>Application Number</td><td><b>{application.applicationNumber}</b></td></tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td>Student Name</td><td><b>{application.studentId?.userId?.name || 'N/A'}</b></td></tr>
                      <tr style={{ backgroundColor: '#A9F5E1' }}><td>Scheme</td><td><b>{application.schemeId?.name || 'N/A'}</b></td></tr>
                      <tr style={{ backgroundColor: '#A9F5A9' }}><td>Institution</td><td><b>{application.institutionId?.name || 'N/A'}</b></td></tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td>Course</td><td><b>{application.courseId?.name || 'N/A'}</b></td></tr>
                      <tr style={{ backgroundColor: '#A9F5E1' }}><td>Academic Year</td><td><b>{application.academicYear}</b></td></tr>
                      <tr style={{ backgroundColor: '#A9F5A9' }}>
                        <td>Current Status</td>
                        <td><b style={{ color: statusColors[application.status] || '#333', textTransform: 'uppercase' }}>{application.status}</b></td>
                      </tr>
                    </tbody>
                  </table>

                  <h4>Status History</h4>
                  <ul className="list-group">
                    {application.statusHistory?.map((h, idx) => (
                      <li key={idx} className="list-group-item">
                        <span className="label label-info">{h.status.toUpperCase()}</span>
                        {' '}{h.remarks || 'No remarks'} &mdash; <small>{new Date(h.at).toLocaleDateString()}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TrackApplicationPage;
