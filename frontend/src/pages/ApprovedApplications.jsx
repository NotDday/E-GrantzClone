import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const ApprovedApplications = ({ navigate }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('/api/applications/approved', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplications(res.data.applications || []))
      .catch(err => console.error(err));
  }, []);

  const handleNav = (path) => (e) => {
    e.preventDefault();
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  return (
    <PortalLayout navigate={navigate} title="APPROVED APPLICATIONS">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Approved Scholarship Applications</h2>
            </div>
            <div className="body">
              {applications.length === 0 ? (
                <div className="alert alert-info">No approved applications found yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Application No.</th>
                        <th>Scheme</th>
                        <th>Institution</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app._id}>
                          <td><b>{app.applicationNumber}</b></td>
                          <td>{app.schemeId?.name || 'N/A'}</td>
                          <td>{app.institutionId?.name || 'N/A'}</td>
                          <td>₹{app.schemeId?.amount || 'As sanctioned'}</td>
                          <td>
                            <a href={`/portal/freeship/${app._id}`} onClick={handleNav(`/portal/freeship/${app._id}`)} className="btn btn-success btn-sm waves-effect">
                              <i className="material-icons">card_membership</i> Generate Freeship Card
                            </a>
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

export default ApprovedApplications;
