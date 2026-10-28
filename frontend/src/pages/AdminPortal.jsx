import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPortal = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [notices, setNotices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditFilter, setAuditFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Scheme form
  const [schemeForm, setSchemeForm] = useState({ name: '', code: '', description: '', amount: '', maxIncome: '' });
  // Notice form
  const [noticeForm, setNoticeForm] = useState({ title: '', link: '', category: 'General' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'audit') fetchData();
  }, [auditFilter]);

  const handleExportCsv = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.get('/api/analytics/export/csv', {
        headers: { Authorization: 'Bearer ' + token },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'applications_export.csv');
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage('CSV exported successfully!');
    } catch (err) {
      setError('Failed to export CSV.');
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await axios.get('/api/admin/stats', { headers });
        setStats(res.data.stats);
      } else if (activeTab === 'applications') {
        const res = await axios.get('/api/admin/applications', { headers });
        setApplications(res.data.applications || []);
      } else if (activeTab === 'schemes') {
        const res = await axios.get('/api/admin/schemes', { headers });
        setSchemes(res.data.schemes || []);
      } else if (activeTab === 'notices') {
        const res = await axios.get('/api/admin/notices', { headers });
        setNotices(res.data.notices || []);
      } else if (activeTab === 'analytics') {
        const [ovRes, catRes] = await Promise.all([
          axios.get('/api/analytics/overview', { headers }),
          axios.get('/api/analytics/category', { headers })
        ]);
        setAnalytics(ovRes.data);
        setCategoryData(catRes.data.byCategory);
      } else if (activeTab === 'audit') {
        const url = '/api/audit?limit=100' + (auditFilter ? '&action=' + auditFilter : '');
        const res = await axios.get(url, { headers });
        setAuditLogs(res.data.logs || []);
        setAuditTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const remarks = prompt(`Enter remarks for ${status}:`, `Application ${status} by official`);
    if (remarks === null) return;
    try {
      const res = await axios.put(`/api/admin/applications/${id}/status`, { status, remarks }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessage(`Application successfully ${status}!`);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.post('/api/admin/schemes', { ...schemeForm, categoryEligible: ['SC', 'ST', 'OBC', 'OEC'] }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Scheme created successfully!');
      setSchemeForm({ name: '', code: '', description: '', amount: '', maxIncome: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create scheme.');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Delete this scheme?')) return;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/schemes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Scheme deleted!');
      fetchData();
    } catch (err) {
      setError('Failed to delete scheme.');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.post('/api/admin/notices', noticeForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Notice published successfully!');
      setNoticeForm({ title: '', link: '', category: 'General' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notice.');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/notices/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Notice deleted!');
      fetchData();
    } catch (err) {
      setError('Failed to delete notice.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabBtn = (tab, label, icon) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#002147' : '#f5f5f5',
    color: activeTab === tab ? '#fff' : '#333',
    border: 'none',
    borderRight: '1px solid #ddd',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* Top Navbar */}
      <nav style={{ backgroundColor: '#002147', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          e-grantz 3.0 <span style={{ color: '#ffb71c', fontSize: '14px', fontWeight: 'normal' }}>| Official Admin Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Department Official</span>
          <button onClick={handleLogout} style={{ backgroundColor: '#ff9800', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {message && <div style={{ padding: '12px 20px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}
        {error && <div style={{ padding: '12px 20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '25px', borderBottom: '2px solid #002147', backgroundColor: '#fff', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
          <button style={tabBtn('dashboard', 'Dashboard')} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button style={tabBtn('applications', 'Manage Applications')} onClick={() => setActiveTab('applications')}>Manage Applications</button>
          <button style={tabBtn('schemes', 'Manage Schemes')} onClick={() => setActiveTab('schemes')}>Manage Schemes</button>
          <button style={tabBtn('notices', 'Manage Notices')} onClick={() => setActiveTab('notices')}>Manage Notices</button>
          <button style={tabBtn('analytics', 'Reports & Analytics')} onClick={() => setActiveTab('analytics')}>Reports & Analytics</button>
          <button style={tabBtn('audit', 'Audit Log')} onClick={() => setActiveTab('audit')}>Audit Log</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>Loading...</div>
        ) : (
          <div>
            {activeTab === 'dashboard' && stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #002147' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Applications</h4>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#002147' }}>{stats.totalApplications}</div>
                </div>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #28a745' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Approved</h4>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>{stats.approvedApplications}</div>
                </div>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #ffc107' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Pending Verification</h4>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e0a800' }}>{stats.pendingApplications}</div>
                </div>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #dc3545' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Reverted</h4>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>{stats.revertedApplications}</div>
                </div>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #17a2b8' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Students</h4>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#17a2b8' }}>{stats.totalStudents}</div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Student Applications Verification</h3>
                {applications.length === 0 ? (
                  <p>No applications found.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                          <th style={{ padding: '12px' }}>App No.</th>
                          <th style={{ padding: '12px' }}>Student Name</th>
                          <th style={{ padding: '12px' }}>Scheme</th>
                          <th style={{ padding: '12px' }}>Institution</th>
                          <th style={{ padding: '12px' }}>Status</th>
                          <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map(app => (
                          <tr key={app._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{app.applicationNumber}</td>
                            <td style={{ padding: '12px' }}>{app.studentId?.userId?.name || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>{app.schemeId?.name || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>{app.institutionId?.name || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                                backgroundColor: app.status === 'approved' ? '#d4edda' : app.status === 'reverted' ? '#f8d7da' : '#fff3cd',
                                color: app.status === 'approved' ? '#155724' : app.status === 'reverted' ? '#721c24' : '#856404'
                              }}>
                                {app.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleUpdateStatus(app._id, 'approved')} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '3px', cursor: 'pointer' }}>
                                Approve
                              </button>
                              <button onClick={() => handleUpdateStatus(app._id, 'reverted')} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '3px', cursor: 'pointer' }}>
                                Revert
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schemes' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Add New Scheme</h3>
                  <form onSubmit={handleCreateScheme}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Scheme Name</label>
                      <input type="text" className="form-control" value={schemeForm.name} onChange={e => setSchemeForm({ ...schemeForm, name: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Code</label>
                      <input type="text" className="form-control" value={schemeForm.code} onChange={e => setSchemeForm({ ...schemeForm, code: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount (₹)</label>
                      <input type="number" className="form-control" value={schemeForm.amount} onChange={e => setSchemeForm({ ...schemeForm, amount: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                      <textarea className="form-control" value={schemeForm.description} onChange={e => setSchemeForm({ ...schemeForm, description: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', height: '80px' }} />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#002147', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Create Scheme</button>
                  </form>
                </div>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Existing Schemes</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                          <th style={{ padding: '10px' }}>Code</th>
                          <th style={{ padding: '10px' }}>Name</th>
                          <th style={{ padding: '10px' }}>Amount</th>
                          <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schemes.map(s => (
                          <tr key={s._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.code}</td>
                            <td style={{ padding: '10px' }}>{s.name}</td>
                            <td style={{ padding: '10px' }}>₹{s.amount}</td>
                            <td style={{ padding: '10px' }}>
                              <button onClick={() => handleDeleteScheme(s._id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notices' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Publish Notice</h3>
                  <form onSubmit={handleCreateNotice}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notice Title</label>
                      <input type="text" className="form-control" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link / PDF URL</label>
                      <input type="text" className="form-control" value={noticeForm.link} onChange={e => setNoticeForm({ ...noticeForm, link: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#002147', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Publish Notice</button>
                  </form>
                </div>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Active Notices</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                          <th style={{ padding: '10px' }}>Title</th>
                          <th style={{ padding: '10px' }}>Link</th>
                          <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notices.map(n => (
                          <tr key={n._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '10px' }}>{n.title}</td>
                            <td style={{ padding: '10px' }}><a href={n.link} target="_blank" rel="noreferrer">{n.link}</a></td>
                            <td style={{ padding: '10px' }}>
                              <button onClick={() => handleDeleteNotice(n._id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#002147' }}>Reports &amp; Analytics</h3>
                  <button onClick={handleExportCsv} style={{ backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ⬇ Export CSV
                  </button>
                </div>

                {loading ? (
                  <div style={{ background: '#fff', padding: '30px', borderRadius: '6px', textAlign: 'center' }}>Loading analytics...</div>
                ) : analytics ? (
                  <>
                    {/* Status breakdown */}
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
                      <h4 style={{ marginTop: 0, color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px' }}>Applications by Stage (Pendency)</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
                        {(analytics.byStatus || []).map(s => {
                          const maxCount = Math.max(...(analytics.byStatus || []).map(x => x.count), 1);
                          const pct = Math.round((s.count / maxCount) * 100);
                          const colors = { draft: '#9e9e9e', submitted: '#1565c0', institution_verified: '#7b1fa2', approved: '#2e7d32', rejected: '#c62828', reverted: '#e65100', paid: '#00838f' };
                          return (
                            <div key={s._id} style={{ flex: '1 1 200px', minWidth: '200px' }}>
                              <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>{s._id.replace(/_/g, ' ')}</div>
                              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors[s._id] || '#333' }}>{s.count}</div>
                              <div style={{ background: '#eee', borderRadius: '4px', height: '8px', marginTop: '5px', overflow: 'hidden' }}>
                                <div style={{ width: pct + '%', height: '100%', background: colors[s._id] || '#333' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Scheme-wise table */}
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
                      <h4 style={{ marginTop: 0, color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px' }}>Scheme-wise Sanctions</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#002147', color: '#fff' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Scheme</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Submitted</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Inst. Verified</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Approved</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Reverted</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(analytics.byScheme || {}).map(([name, counts]) => (
                            <tr key={name} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '10px', fontWeight: 'bold' }}>{name}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>{counts.submitted || 0}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>{counts.institution_verified || 0}</td>
                              <td style={{ padding: '10px', textAlign: 'center', color: '#2e7d32', fontWeight: 'bold' }}>{counts.approved || 0}</td>
                              <td style={{ padding: '10px', textAlign: 'center', color: '#e65100' }}>{counts.reverted || 0}</td>
                              <td style={{ padding: '10px', textAlign: 'center', color: '#00838f', fontWeight: 'bold' }}>{counts.paid || 0}</td>
                            </tr>
                          ))}
                          {Object.keys(analytics.byScheme || {}).length === 0 && (
                            <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data available</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Category-wise + District-wise side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                      <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ marginTop: 0, color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px' }}>Category-wise Counts</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                              <th style={{ padding: '8px', textAlign: 'left' }}>Category</th>
                              <th style={{ padding: '8px', textAlign: 'center' }}>Approved</th>
                              <th style={{ padding: '8px', textAlign: 'center' }}>Paid</th>
                              <th style={{ padding: '8px', textAlign: 'center' }}>Pending</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(categoryData || {}).map(([cat, counts]) => (
                              <tr key={cat} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{cat}</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#2e7d32' }}>{counts.approved || 0}</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#00838f' }}>{counts.paid || 0}</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#e65100' }}>{(counts.submitted || 0) + (counts.institution_verified || 0)}</td>
                              </tr>
                            ))}
                            {Object.keys(categoryData || {}).length === 0 && (
                              <tr><td colSpan={4} style={{ padding: '15px', textAlign: 'center', color: '#999' }}>No data</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ background: '#fff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ marginTop: 0, color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px' }}>District-wise Disbursal</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                              <th style={{ padding: '8px', textAlign: 'left' }}>District</th>
                              <th style={{ padding: '8px', textAlign: 'center' }}>Sanctioned</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(analytics.byDistrict || []).map(d => (
                              <tr key={d._id.districtId} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{d._id.districtName}</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#2e7d32', fontWeight: 'bold' }}>{d.count}</td>
                              </tr>
                            ))}
                            {(analytics.byDistrict || []).length === 0 && (
                              <tr><td colSpan={2} style={{ padding: '15px', textAlign: 'center', color: '#999' }}>No data</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ background: '#fff', padding: '30px', borderRadius: '6px', textAlign: 'center' }}>No analytics data available.</div>
                )}
              </div>
            )}

            {activeTab === 'audit' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#002147' }}>Audit Log <small style={{ color: '#999', fontWeight: 'normal' }}>({auditTotal} records)</small></h3>
                  <select value={auditFilter} onChange={e => setAuditFilter(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <option value="">All Actions</option>
                    <option value="application_approved">Approved</option>
                    <option value="application_rejected">Rejected</option>
                    <option value="application_reverted">Reverted</option>
                    <option value="application_paid">Paid</option>
                    <option value="document_uploaded">Doc Uploaded</option>
                    <option value="document_verified">Doc Verified</option>
                    <option value="scheme_created">Scheme Created</option>
                    <option value="notice_created">Notice Created</option>
                  </select>
                </div>

                {loading ? (
                  <div style={{ background: '#fff', padding: '30px', borderRadius: '6px', textAlign: 'center' }}>Loading audit logs...</div>
                ) : auditLogs.length === 0 ? (
                  <div style={{ background: '#fff', padding: '30px', borderRadius: '6px', textAlign: 'center', color: '#999' }}>No audit records found.</div>
                ) : (
                  <div style={{ background: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#002147', color: '#fff' }}>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Timestamp</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Actor</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Target</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>IP</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map(log => (
                          <tr key={log._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>{new Date(log.createdAt).toLocaleString()}</td>
                            <td style={{ padding: '10px' }}>
                              <span style={{ background: '#e3f2fd', color: '#1565c0', borderRadius: '3px', padding: '2px 8px', fontSize: '12px' }}>
                                {log.action.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td style={{ padding: '10px', fontSize: '13px' }}>
                              {log.actor?.name || '—'}<br />
                              <small style={{ color: '#999' }}>{log.actorRole}</small>
                            </td>
                            <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
                              {log.targetModel ? `${log.targetModel}` : '—'}{log.targetId ? `: ${String(log.targetId).slice(-6)}` : ''}
                            </td>
                            <td style={{ padding: '10px', fontSize: '12px', color: '#999' }}>{log.ip || '—'}</td>
                            <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
                              {log.details ? JSON.stringify(log.details).slice(0, 80) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
