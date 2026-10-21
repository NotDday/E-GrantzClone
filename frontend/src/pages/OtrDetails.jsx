import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const OtrDetails = ({ navigate }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('/api/students/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudent(res.data.student))
      .catch(err => console.error(err));
  }, []);

  return (
    <PortalLayout navigate={navigate} title="OTR DETAILS">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>OTR Profile Certificate</h2>
            </div>
            <div className="body">
              <table className="table table-striped table-bordered table-hover" style={{ fontFamily: "'Segoe UI'", fontWeight: 'bold' }}>
                <tbody>
                  <tr style={{ backgroundColor: '#A9F5A9' }}>
                    <td>OTR / Register Number</td>
                    <td><b>{student?.registerNumber}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#F6CEEC' }}>
                    <td>Candidate Name</td>
                    <td><b>{student?.userId?.name}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5E1' }}>
                    <td>Email Address</td>
                    <td><b>{student?.userId?.email}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5A9' }}>
                    <td>Mobile Number</td>
                    <td><b>{student?.phone || 'N/A'}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#F6CEEC' }}>
                    <td>Aadhaar (Last 4)</td>
                    <td><b>XXXX-XXXX-{student?.aadhaarLast4 || 'N/A'}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5E1' }}>
                    <td>Institution</td>
                    <td><b>{student?.institutionId?.name || 'N/A'}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#A9F5A9' }}>
                    <td>Course</td>
                    <td><b>{student?.courseId?.name || 'N/A'}</b></td>
                  </tr>
                  <tr style={{ backgroundColor: '#F6CEEC' }}>
                    <td>Registration Status</td>
                    <td><b style={{ color: '#059669' }}>ACTIVE</b></td>
                  </tr>
                </tbody>
              </table>
              <button className="btn btn-primary btn-lg waves-effect" onClick={() => window.print()}>
                <i className="material-icons">print</i> Print OTR Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default OtrDetails;
