import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const ApplicableSchemes = ({ navigate }) => {
  const [schemes, setSchemes] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('/api/schemes/applicable', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSchemes(res.data.schemes || res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApply = async (schemeId) => {
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.post('/api/applications', {
        schemeId,
        academicYear: '2025-2026',
        familyIncome: 45000
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        setMessage({ text: `Application submitted! Number: ${res.data.application.applicationNumber}`, type: 'success' });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to submit application', type: 'danger' });
    }
  };

  return (
    <PortalLayout navigate={navigate} title="APPLY FOR SCHOLARSHIPS - POST MATRIC">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Available Scholarship Schemes</h2>
            </div>
            <div className="body">
              {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

              {schemes.length === 0 ? (
                <div className="alert alert-info">No active scholarship schemes found.</div>
              ) : (
                <table className="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Scheme Name</th>
                      <th>Code</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map(scheme => (
                      <tr key={scheme._id}>
                        <td><b>{scheme.name}</b></td>
                        <td>{scheme.code}</td>
                        <td>{scheme.categoryEligible?.join(', ') || 'SC/ST/OEC'}</td>
                        <td>₹{scheme.amount || 'As per fee'}</td>
                        <td>
                          <button className="btn btn-success btn-sm waves-effect" onClick={() => handleApply(scheme._id)}>
                            <i className="material-icons">send</i> Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ApplicableSchemes;
