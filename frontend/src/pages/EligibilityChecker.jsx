import React, { useState } from 'react';
import axios from 'axios';

const CATEGORIES = ['SC', 'ST', 'OBC', 'OEC', 'General'];

const EligibilityChecker = ({ navigate }) => {
  const [form, setForm] = useState({ category: '', income: '', courseLevel: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!form.category || !form.income) {
      setError('Category and annual family income are required.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/api/schemes/eligibility', {
        category: form.category,
        income: Number(form.income),
        courseLevel: form.courseLevel
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check eligibility.');
    } finally {
      setLoading(false);
    }
  };

  const handleNav = (path) => {
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: '#002147', color: '#fff', padding: '25px 30px', borderRadius: '4px 4px 0 0', marginBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div>
              <img src="/favicon.ico" alt="" style={{ height: '40px', opacity: 0.9 }} onError={e => e.target.style.display = 'none'} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Scholarship Eligibility Checker</h1>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '13px' }}>e-Grantz 3.0 – Kerala Social Welfare Department</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div style={{ background: '#fff', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '25px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ marginTop: 0, color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px' }}>
            Check Your Eligibility
          </h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Enter your details below to see which scholarship schemes you are eligible for under Post Matric Scholarship.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleCheck}>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>Community / Category *</label>
                  <select className="form-control" value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">-- Select Category --</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <small className="text-muted">Your caste/community category</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>Annual Family Income (₹) *</label>
                  <input type="number" className="form-control" min="0" placeholder="e.g. 45000"
                    value={form.income} onChange={e => setForm(f => ({ ...f, income: e.target.value }))} />
                  <small className="text-muted">Total annual household income</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>Course Level (optional)</label>
                  <select className="form-control" value={form.courseLevel}
                    onChange={e => setForm(f => ({ ...f, courseLevel: e.target.value }))}>
                    <option value="">-- Select Level --</option>
                    <option value="plus_two">Plus Two / HSE</option>
                    <option value="degree">Degree / UG</option>
                    <option value="pg">Post Graduate</option>
                    <option value="diploma">Diploma / ITI</option>
                    <option value="professional">Professional (Engg/Medical)</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary waves-effect" disabled={loading}
              style={{ backgroundColor: '#002147', borderColor: '#002147', minWidth: '180px' }}>
              {loading ? 'Checking...' : '🔍 Check Eligibility'}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div>
            <div style={{ background: '#fff', padding: '25px 30px', border: '1px solid #e0e0e0', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h4 style={{ color: '#002147', marginTop: 0 }}>
                Results for: <span style={{ color: '#1565c0' }}>{result.inputs.category}</span> category,{' '}
                income <span style={{ color: '#1565c0' }}>₹{Number(result.inputs.income).toLocaleString()}</span>
              </h4>

              {result.eligible.length > 0 ? (
                <>
                  <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '4px', padding: '10px 15px', marginBottom: '20px' }}>
                    <strong style={{ color: '#2e7d32' }}>✓ You are eligible for {result.eligible.length} scheme{result.eligible.length > 1 ? 's' : ''}.</strong>
                  </div>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr style={{ backgroundColor: '#002147', color: '#fff' }}>
                        <th>#</th>
                        <th>Scheme Name</th>
                        <th>Code</th>
                        <th>Amount (₹)</th>
                        <th>Categories</th>
                        <th>Income Limit</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.eligible.map((s, i) => (
                        <tr key={s._id}>
                          <td>{i + 1}</td>
                          <td><strong>{s.name}</strong><br /><small style={{ color: '#666' }}>{s.description}</small></td>
                          <td><code>{s.code}</code></td>
                          <td><strong style={{ color: '#2e7d32' }}>₹{Number(s.amount).toLocaleString()}</strong></td>
                          <td>{(s.categoryEligible || []).join(', ') || 'All'}</td>
                          <td>{s.maxIncome ? `₹${Number(s.maxIncome).toLocaleString()}` : 'No limit'}</td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => handleNav(`/scheme/${s._id}`)}>
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '15px' }}>
                    <button className="btn btn-success waves-effect" onClick={() => handleNav('/portal/applicable')}>
                      Apply for Scholarship →
                    </button>
                  </div>
                </>
              ) : (
                <div className="alert alert-warning">
                  <strong>No eligible schemes found</strong> for the entered details.
                  Please verify your category and income details.
                </div>
              )}

              {result.notEligible.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h5 style={{ color: '#999' }}>Not Eligible ({result.notEligible.length} schemes):</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {result.notEligible.map(s => (
                      <span key={s._id} style={{ background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '3px', padding: '3px 10px', fontSize: '13px', color: '#999' }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn btn-default" onClick={() => handleNav('/')}>← Back to Home</button>
          {' '}
          <button className="btn btn-default" onClick={() => handleNav('/login')}>Student Login</button>
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
