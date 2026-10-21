import React, { useState } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const UploadOverseasCert = ({ navigate }) => {
  const [docName, setDocName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.post('/api/students/documents', {
        docType: 'overseas_certificate',
        fileName: docName,
        fileUrl: fileUrl || 'https://egrantz.kerala.gov.in/overseas_sample.pdf',
        verified: false
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        setMessage({ text: 'Overseas certificate uploaded successfully for verification.', type: 'success' });
        setDocName('');
        setFileUrl('');
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to upload document', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout navigate={navigate} title="UPLOAD OVERSEAS SCHOLARSHIP DATA">
      <div className="row clearfix">
        <div className="col-lg-8 col-md-10 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Upload Certificate for Overseas Scholarship</h2>
            </div>
            <div className="body">
              <p>Upload admission letters, fee receipts, or university enrollment documents for overseas higher education schemes.</p>

              {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label>Document Title / Description</label>
                  <input type="text" className="form-control" value={docName}
                    onChange={e => setDocName(e.target.value)} placeholder="e.g., University Admission Letter" required />
                </div>
                <div className="form-group">
                  <label>Document URL / File Path</label>
                  <input type="text" className="form-control" value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)} placeholder="https://..." required />
                </div>

                <button type="submit" className="btn btn-primary waves-effect" disabled={loading}>
                  <i className="material-icons">cloud_upload</i> {loading ? 'Uploading...' : 'Upload Certificate'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default UploadOverseasCert;
