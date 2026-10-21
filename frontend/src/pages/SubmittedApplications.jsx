import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const SubmittedApplications = ({ navigate }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('/api/applications/mine', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplications(res.data.applications || []))
      .catch(err => console.error(err));
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
    paid: 'label-warning'
  };

  return (
    <PortalLayout navigate={navigate} title="SUBMITTED APPLICATIONS">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Post-Matric Applications</h2>
            </div>
            <div className="body">
              {applications.length === 0 ? (
                <div className="alert alert-info">
                  No applications submitted yet. <a href="/portal/schemes" onClick={handleNav('/portal/schemes')}>Apply Now</a>
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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app._id}>
                          <td><b>{app.applicationNumber}</b></td>
                          <td>{app.schemeId?.name || 'N/A'}</td>
                          <td>{app.institutionId?.name || 'N/A'}</td>
                          <td>{app.academicYear}</td>
                          <td>
                            <span className={`label ${statusColors[app.status] || 'label-default'}`} style={{ textTransform: 'uppercase', padding: '4px 8px' }}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            {app.status === 'approved' && (
                              <a href={`/portal/freeship/${app._id}`} onClick={handleNav(`/portal/freeship/${app._id}`)} className="btn btn-success btn-sm">
                                <i className="material-icons">card_membership</i> Freeship Card
                              </a>
                            )}
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

export default SubmittedApplications;
