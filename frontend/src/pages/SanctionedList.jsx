import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SanctionedList = ({ navigate }) => {
  const [filters, setFilters] = useState({ name: '', scheme: '', institution: '', year: '' });
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const limit = 20;

  useEffect(() => {
    // Auto-load on mount with no filters
    runSearch(true);
  }, []);

  const runSearch = async (initial = false) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = { page, limit };
      if (filters.name) params.name = filters.name;
      if (filters.scheme) params.scheme = filters.scheme;
      if (filters.institution) params.institution = filters.institution;
      if (filters.year) params.year = filters.year;
      const res = await axios.get('/api/applications/sanctioned', { params });
      setResults(res.data.applications || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    runSearch();
  };

  const handleClear = () => {
    setFilters({ name: '', scheme: '', institution: '', year: '' });
    setPage(1);
    setTimeout(() => runSearch(), 50);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: '#002147', color: '#fff', padding: '20px 30px', borderRadius: '4px 4px 0 0', marginBottom: '0' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Sanctioned Scholarships — Public Search</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '13px' }}>
            Transparency portal: search approved and disbursed scholarships (real-time data)
          </p>
        </div>

        {/* Filter card */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '25px', marginBottom: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Student Name</label>
                  <input className="form-control" placeholder="Search by name"
                    value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Scheme</label>
                  <input className="form-control" placeholder="Scheme name"
                    value={filters.scheme} onChange={e => setFilters(f => ({ ...f, scheme: e.target.value }))} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Institution</label>
                  <input className="form-control" placeholder="Institution name"
                    value={filters.institution} onChange={e => setFilters(f => ({ ...f, institution: e.target.value }))} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Academic Year</label>
                  <select className="form-control" value={filters.year}
                    onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}>
                    <option value="">All Years</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#002147', borderColor: '#002147' }}>
                🔍 Search
              </button>
              {' '}
              <button type="button" className="btn btn-default" onClick={handleClear}>Clear</button>
            </div>
          </form>
        </div>

        {/* Summary */}
        {!loading && searched && (
          <div style={{ marginBottom: '15px', color: '#555', fontSize: '14px' }}>
            <strong>{total}</strong> sanctioned record{total !== 1 ? 's' : ''} found.
          </div>
        )}

        {/* Results table */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          {loading ? (
            <div className="alert alert-info" style={{ margin: '20px' }}>Loading...</div>
          ) : results.length === 0 ? (
            <div className="alert alert-warning" style={{ margin: '20px' }}>No sanctioned records match your search.</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-bordered table-hover" style={{ margin: 0 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#002147', color: '#fff' }}>
                      <th>#</th>
                      <th>Application No</th>
                      <th>Student Name</th>
                      <th>Scheme</th>
                      <th>Institution</th>
                      <th>Course</th>
                      <th>Amount (₹)</th>
                      <th>Academic Year</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((a, i) => (
                      <tr key={a._id}>
                        <td>{(page - 1) * limit + i + 1}</td>
                        <td><code style={{ background: '#f0f4f8', padding: '2px 6px', borderRadius: '3px' }}>{a.applicationNumber}</code></td>
                        <td><strong>{a.studentId?.userId?.name || '—'}</strong></td>
                        <td>{a.schemeId?.name || '—'}</td>
                        <td>{a.institutionId?.name || '—'}</td>
                        <td>{a.courseId?.name || '—'}</td>
                        <td><strong style={{ color: '#2e7d32' }}>₹{Number(a.schemeId?.amount || 0).toLocaleString()}</strong></td>
                        <td>{a.academicYear}</td>
                        <td>
                          {a.status === 'paid'
                            ? <span className="badge" style={{ backgroundColor: '#2e7d32', color: '#fff' }}>● Paid</span>
                            : <span className="badge" style={{ backgroundColor: '#1565c0', color: '#fff' }}>Approved</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Page {page} of {totalPages}
                  </div>
                  <div>
                    <button className="btn btn-xs btn-default" disabled={page <= 1}
                      onClick={() => { setPage(p => p - 1); setTimeout(runSearch, 50); }}>← Prev</button>
                    {' '}
                    <button className="btn btn-xs btn-default" disabled={page >= totalPages}
                      onClick={() => { setPage(p => p + 1); setTimeout(runSearch, 50); }}>Next →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn btn-default" onClick={() => { if (navigate) navigate('/'); else window.location.href = '/'; }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SanctionedList;
