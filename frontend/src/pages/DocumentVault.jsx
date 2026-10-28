import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const DOC_TYPES = [
  { value: 'income_certificate', label: 'Income Certificate' },
  { value: 'caste_certificate', label: 'Caste Certificate' },
  { value: 'marklist', label: 'Mark List' },
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'bank_proof', label: 'Bank Proof' },
  { value: 'photo', label: 'Passport Photo' },
  { value: 'other', label: 'Other' }
];

const DocumentVault = ({ navigate }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [form, setForm] = useState({ docType: 'income_certificate', title: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = () => localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/documents/mine', { headers: headers() });
      setDocs(res.data.documents || []);
    } catch (err) {
      setMessage({ text: 'Failed to load documents.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: 'File size must be under 2 MB.', type: 'danger' });
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) { setMessage({ text: 'Please select a file.', type: 'danger' }); return; }
    if (!form.title) { setMessage({ text: 'Please enter a title.', type: 'danger' }); return; }
    setUploading(true);
    setMessage({ text: '', type: '' });
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await axios.post('/api/documents/upload', {
          docType: form.docType,
          title: form.title,
          originalName: selectedFile.name,
          mimeType: selectedFile.type,
          size: selectedFile.size,
          data: reader.result
        }, { headers: headers() });
        setMessage({ text: 'Document uploaded successfully!', type: 'success' });
        setForm({ docType: 'income_certificate', title: '' });
        setSelectedFile(null);
        setPreview(null);
        fetchDocs();
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Upload failed.', type: 'danger' });
    } finally {
      setUploading(false);
    }
  };

  // Group docs by type, show only latest version per type
  const latestByType = {};
  const allVersions = {};
  docs.forEach(d => {
    if (!latestByType[d.docType] || d.version > latestByType[d.docType].version) {
      latestByType[d.docType] = d;
    }
    if (!allVersions[d.docType]) allVersions[d.docType] = [];
    allVersions[d.docType].push(d);
  });

  const [expandedType, setExpandedType] = useState(null);

  return (
    <PortalLayout navigate={navigate} title="DOCUMENT VAULT">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>My Documents <small>Upload and manage your scholarship documents</small></h2>
            </div>
            <div className="body">
              {message.text && (
                <div className={`alert alert-${message.type}`} style={{ marginBottom: '15px' }}>
                  {message.text}
                </div>
              )}

              {/* Upload Form */}
              <div className="card" style={{ background: '#f9f9f9', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
                <div className="header"><h2>Upload New Document</h2></div>
                <div className="body">
                  <form onSubmit={handleUpload}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Document Type *</label>
                          <select className="form-control" value={form.docType}
                            onChange={e => setForm(f => ({ ...f, docType: e.target.value }))}>
                            {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Title / Description *</label>
                          <input className="form-control" placeholder="e.g. Income Cert 2024-25"
                            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>File (PDF / JPG / PNG, max 2 MB) *</label>
                          <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange} />
                        </div>
                      </div>
                    </div>
                    {preview && preview.startsWith('data:image') && (
                      <div style={{ marginBottom: '10px' }}>
                        <img src={preview} alt="preview" style={{ maxHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }} />
                      </div>
                    )}
                    {preview && preview.startsWith('data:application/pdf') && (
                      <div style={{ marginBottom: '10px', color: '#555' }}>
                        <i className="material-icons" style={{ verticalAlign: 'middle' }}>picture_as_pdf</i>
                        {' '}{selectedFile?.name}
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary waves-effect" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Documents List */}
              {loading ? (
                <div className="alert alert-info">Loading documents...</div>
              ) : Object.keys(latestByType).length === 0 ? (
                <div className="alert alert-warning">No documents uploaded yet.</div>
              ) : (
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr style={{ backgroundColor: '#002147', color: '#fff' }}>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Version</th>
                      <th>Uploaded</th>
                      <th>Verified</th>
                      <th>History</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(latestByType).map(([type, doc]) => (
                      <React.Fragment key={type}>
                        <tr>
                          <td>{DOC_TYPES.find(t => t.value === type)?.label || type}</td>
                          <td>{doc.title}</td>
                          <td><span className="badge" style={{ backgroundColor: '#1565c0', color: '#fff' }}>v{doc.version}</span></td>
                          <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                          <td>
                            {doc.verified
                              ? <span className="badge" style={{ backgroundColor: '#2e7d32', color: '#fff' }}>✓ Verified</span>
                              : <span className="badge" style={{ backgroundColor: '#e65100', color: '#fff' }}>Pending</span>}
                          </td>
                          <td>
                            {(allVersions[type] || []).length > 1 && (
                              <button className="btn btn-xs btn-default"
                                onClick={() => setExpandedType(expandedType === type ? null : type)}>
                                {expandedType === type ? 'Hide' : `${allVersions[type].length} versions`}
                              </button>
                            )}
                          </td>
                        </tr>
                        {expandedType === type && (allVersions[type] || []).map(v => (
                          <tr key={v._id} style={{ backgroundColor: '#f5f5f5', fontSize: '13px' }}>
                            <td colSpan={2} style={{ paddingLeft: '30px', color: '#666' }}>↳ v{v.version}: {v.title}</td>
                            <td><span className="badge" style={{ backgroundColor: '#888', color: '#fff' }}>v{v.version}</span></td>
                            <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                            <td>{v.verified
                              ? <span style={{ color: '#2e7d32' }}>✓</span>
                              : <span style={{ color: '#999' }}>—</span>}
                            </td>
                            <td></td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="alert alert-info" style={{ marginTop: '15px', fontSize: '13px' }}>
                <strong>Note:</strong> Re-uploading the same document type creates a new version automatically.
                Verified documents cannot be replaced unless an admin reverts your application.
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DocumentVault;
