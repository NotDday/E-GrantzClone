import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const FreeshipCard = ({ navigate, applicationId }) => {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!applicationId) { setLoading(false); return; }

    axios.get(`/api/applications/${applicationId}/freeship`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApp(res.data.application))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) return <PortalLayout navigate={navigate} title="FREESHIP CARD"><div className="alert alert-info">Loading...</div></PortalLayout>;
  if (!app) return <PortalLayout navigate={navigate} title="FREESHIP CARD"><div className="alert alert-danger">Application not found.</div></PortalLayout>;

  return (
    <PortalLayout navigate={navigate} title="FREESHIP CARD">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card" id="freeship-card-print">
            <div className="header bg-red">
              <h2>GOVERNMENT OF KERALA — e-Grantz 3.0</h2>
              <p className="category">Freeship Card / Fee Concession Certificate</p>
            </div>
            <div className="body">
              <table className="table table-striped table-bordered" style={{ fontFamily: "'Segoe UI'", fontWeight: 'bold' }}>
                <tbody>
                  <tr style={{ backgroundColor: '#A9F5A9' }}>
                    <td>Application Number</td>
                    <td><b>{app.applicationNumber}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#F6CEEC' }}>
                    <td>Academic Year</td>
                    <td><b>{app.academicYear}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5E1' }}>
                    <td>Student Name</td>
                    <td><b>{app.studentId?.userId?.name}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5A9' }}>
                    <td>Register Number</td>
                    <td><b>{app.studentId?.registerNumber}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#F6CEEC' }}>
                    <td>Caste / Community</td>
                    <td><b>{app.studentId?.casteId?.name || 'SC/ST/OEC'}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5E1' }}>
                    <td>Institution</td>
                    <td><b>{app.institutionId?.name}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5A9' }}>
                    <td>Course</td>
                    <td><b>{app.courseId?.name}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#F6CEEC' }}>
                    <td>Scholarship Scheme</td>
                    <td><b>{app.schemeId?.name}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5E1' }}>
                    <td>Sanction Status</td>
                    <td><b style={{ color: '#059669' }}>APPROVED & SANCTIONED</b></td>
                  </tr>
                </tbody>
              </table>

              <p className="text-muted" style={{ fontSize: '13px', marginTop: '10px' }}>
                This Freeship Card exempts the student from paying tuition and special fees at the institution as per Government of Kerala e-Grantz concession norms.
              </p>

              <button className="btn btn-primary waves-effect" onClick={() => window.print()}>
                <i className="material-icons">print</i> Print Freeship Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default FreeshipCard;
