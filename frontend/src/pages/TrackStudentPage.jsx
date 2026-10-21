import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const TrackStudentPage = ({ navigate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError('Could not load your applications. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleNav = (path) => (e) => {
    e.preventDefault();
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  const statusColors = {
    draft: 'label-default',
    submitted: 'label-info',
    institution_verified: 'label-primary',
    approved: 'label-success',
    rejected: 'label-danger',
    reverted: 'label-warning',
    paid: 'label-warning'
  };

  const statusLabels = {
    draft: 'Draft',
    submitted: 'Submitted',
    institution_verified: 'Institution Verified',
    approved: 'Approved',
    rejected: 'Rejected',
    reverted: 'Reverted',
    paid: 'Paid'
  };

  return (
    <PortalLayout navigate={navigate} title="TRACK DETAILS">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Track Your Scholarship Applications</h2>
            </div>
            <div className="body">
              {loading ? (
                <div className="alert alert-info">Loading your applications...</div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : applications.length === 0 ? (
                <div className="alert alert-info">
                  You have not applied for any scholarships yet.{' '}
                  <a href="/portal/schemes" onClick={handleNav('/portal/schemes')}>Apply Now</a>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Application No.</th>
                        <th>Scheme</th>
                        <th>Institution</th>
                        <th>Course</th>
                        <th>Academic Year</th>
                        <th>Applied On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app._id}>
                          <td><b>{app.applicationNumber}</b></td>
                          <td>{app.schemeId?.name || 'N/A'}</td>
                          <td>{app.institutionId?.name || 'N/A'}</td>
                          <td>{app.courseId?.name || 'N/A'}</td>
                          <td>{app.academicYear || 'N/A'}</td>
                          <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <span className={`label ${statusColors[app.status] || 'label-default'}`}>
                              {statusLabels[app.status] || app.status}
                            </span>
                          </td>
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

export default TrackStudentPage;
