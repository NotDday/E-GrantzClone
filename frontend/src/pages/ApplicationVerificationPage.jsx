import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const ApplicationVerificationPage = ({ navigate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('approved');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;
    axios.get('/api/applications/mine', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setApplications(res.data.applications || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load applications.');
        setLoading(false);
      });
  }, []);

  const approvedApps = applications.filter(app => app.status === 'approved' || app.status === 'paid');
  const revertedApps = applications.filter(app => app.status === 'reverted' || app.status === 'rejected');
  const shown = activeTab === 'approved' ? approvedApps : revertedApps;

  const tabStyle = (tab) => ({
    padding: '12px 24px',
    cursor: 'pointer',
    borderBottom: activeTab === tab ? '3px solid #F44336' : '3px solid transparent',
    color: activeTab === tab ? '#F44336' : '#777',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    display: 'inline-block'
  });

  return (
    <PortalLayout navigate={navigate} title="APPLICATION VERIFICATION">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Application Verification</h2>
            </div>
            <div className="body">
              <div style={{ borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                <span style={tabStyle('approved')} onClick={() => setActiveTab('approved')}>
                  <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle' }}>check_circle</i>
                  {' '}Approved ({approvedApps.length})
                </span>
                <span style={tabStyle('reverted')} onClick={() => setActiveTab('reverted')}>
                  <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle' }}>replay</i>
                  {' '}Reverted ({revertedApps.length})
                </span>
              </div>

              {loading ? (
                <div className="alert alert-info">Loading applications...</div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : shown.length === 0 ? (
                <div className="alert alert-info">
                  No {activeTab} applications found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Application No.</th>
                        <th>Scheme</th>
                        <th>Institution</th>
                        <th>Academic Year</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map(app => (
                        <tr key={app._id}>
                          <td><b>{app.applicationNumber}</b></td>
                          <td>{app.schemeId?.name || 'N/A'}</td>
                          <td>{app.institutionId?.name || 'N/A'}</td>
                          <td>{app.academicYear || 'N/A'}</td>
                          <td>
                            <span className={`label ${activeTab === 'approved' ? 'label-success' : 'label-warning'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td>{new Date(app.updatedAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ApplicationVerificationPage;
