import React, { useState } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const DigiLockerVerify = ({ navigate }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [certType, setCertType] = useState('Income_Certificate');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [doc, setDoc] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    setDoc(null);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.post('/api/students/digilocker-verify', {
        aadhaarNumber: aadhaar,
        certificateType: certType
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        setMessage({ text: res.data.message, type: 'success' });
        setDoc(res.data.document);
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'DigiLocker verification failed', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout navigate={navigate} title="DIGILOCKER VERIFICATION">
      <div className="row clearfix">
        <div className="col-lg-8 col-md-10 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Verify Certificates via DigiLocker</h2>
            </div>
            <div className="body">
              <p>Fetch and verify your Caste, Income, or Academic certificates directly from DigiLocker.</p>

              {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

              <form onSubmit={handleVerify}>
                <div className="form-group">
                  <label>Aadhaar Number / DigiLocker ID</label>
                  <input type="text" className="form-control" maxLength="12" value={aadhaar}
                    onChange={e => setAadhaar(e.target.value)} placeholder="Enter 12-digit Aadhaar number" required />
                </div>
                <div className="form-group">
                  <label>Certificate Type</label>
                  <select className="form-control" value={certType} onChange={e => setCertType(e.target.value)}>
                    <option value="Income_Certificate">Income Certificate</option>
                    <option value="Caste_Certificate">Caste / Community Certificate</option>
                    <option value="SSLC_Certificate">SSLC / Marksheet Certificate</option>
                    <option value="Degree_Certificate">Degree Certificate</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary waves-effect" disabled={loading}>
                  <i className="material-icons">verified</i> {loading ? 'Verifying...' : 'Verify & Import Certificate'}
                </button>
              </form>

              {doc && (
                <div className="alert alert-success" style={{ marginTop: '20px' }}>
                  <strong>Certificate Imported:</strong><br />
                  File: {doc.fileName}<br />
                  Type: {doc.docType}<br />
                  Status: <b>VERIFIED</b>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DigiLockerVerify;
