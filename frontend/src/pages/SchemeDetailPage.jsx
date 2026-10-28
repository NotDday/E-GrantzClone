import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchemeDetailPage = ({ navigate, schemeId }) => {
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = schemeId || (window.location.pathname.split('/scheme/')[1]);

  useEffect(() => {
    if (!id) { setError('No scheme ID provided.'); setLoading(false); return; }
    axios.get(`/api/schemes/${id}`)
      .then(res => setScheme(res.data.scheme))
      .catch(() => setError('Scheme not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleNav = (path) => { if (navigate) navigate(path); else window.location.href = path; };

  if (loading) return (
    <div style={{ fontFamily: "'Roboto', sans-serif", padding: '60px', textAlign: 'center', color: '#666' }}>
      Loading scheme details...
    </div>
  );

  if (error) return (
    <div style={{ fontFamily: "'Roboto', sans-serif", padding: '60px', textAlign: 'center' }}>
      <div className="alert alert-danger">{error}</div>
      <button className="btn btn-default" onClick={() => handleNav('/')}>← Back</button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Back nav */}
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-default btn-sm" onClick={() => handleNav('/')}>← Back to Home</button>
          {' '}
          <button className="btn btn-default btn-sm" onClick={() => handleNav('/eligibility')}>Eligibility Checker</button>
        </div>

        {/* Header banner */}
        <div style={{ background: 'linear-gradient(135deg, #002147 0%, #1565c0 100%)', color: '#fff', padding: '30px', borderRadius: '4px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', display: 'inline-block', marginBottom: '10px' }}>
                {scheme.code}
              </span>
              <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 'bold' }}>{scheme.name}</h1>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>
                Kerala Social Welfare Department — Post Matric Scholarship
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>Annual Scholarship Amount</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffb71c' }}>
                ₹{Number(scheme.amount).toLocaleString()}
              </div>
              <div style={{ marginTop: '10px' }}>
                <span style={{
                  background: scheme.active ? '#2e7d32' : '#c62828',
                  color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px'
                }}>
                  {scheme.active ? '● Active' : '○ Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="row">
          <div className="col-md-8">
            {/* Description */}
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '25px', marginBottom: '20px' }}>
              <h4 style={{ color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px', marginTop: 0 }}>About This Scheme</h4>
              <p style={{ color: '#444', lineHeight: '1.7' }}>
                {scheme.description || 'This scholarship is offered by the Kerala Social Welfare Department to support students from eligible communities in pursuing higher education beyond matriculation level.'}
              </p>
            </div>

            {/* How to apply */}
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '25px', marginBottom: '20px' }}>
              <h4 style={{ color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px', marginTop: 0 }}>How to Apply</h4>
              <ol style={{ color: '#444', lineHeight: '2', paddingLeft: '20px' }}>
                <li>Register on the e-Grantz portal using your valid email and mobile number.</li>
                <li>Complete your candidate profile including personal, academic, and bank details.</li>
                <li>Upload the required supporting documents (income certificate, caste certificate, mark list).</li>
                <li>Select this scheme under "Apply for Scholarship" and submit your application.</li>
                <li>Your institution will verify the application and forward it for approval.</li>
                <li>Track your application status using the Application Tracking feature.</li>
              </ol>
              <button className="btn btn-primary waves-effect"
                style={{ backgroundColor: '#002147', borderColor: '#002147', marginTop: '10px' }}
                onClick={() => handleNav('/login')}>
                Login to Apply →
              </button>
            </div>

            {/* Documents required */}
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '25px', marginBottom: '20px' }}>
              <h4 style={{ color: '#002147', borderBottom: '2px solid #ffb71c', paddingBottom: '8px', marginTop: 0 }}>Documents Required</h4>
              <ul style={{ color: '#444', lineHeight: '2', paddingLeft: '20px' }}>
                <li>Income Certificate from a gazetted officer / Village Officer</li>
                <li>Caste Certificate (for SC/ST/OBC/OEC categories)</li>
                <li>Mark List of previous qualifying examination</li>
                <li>Aadhaar Card (for identity verification)</li>
                <li>Bank passbook copy / cancelled cheque</li>
                <li>Recent passport-size photograph</li>
              </ul>
            </div>
          </div>

          <div className="col-md-4">
            {/* Eligibility summary */}
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
              <h5 style={{ color: '#002147', borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: 0 }}>Eligibility Summary</h5>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', color: '#666', width: '55%' }}>Eligible Categories</td>
                    <td style={{ padding: '8px 0', fontWeight: 'bold' }}>
                      {scheme.categoryEligible && scheme.categoryEligible.length > 0
                        ? scheme.categoryEligible.map(c => (
                          <span key={c} style={{ display: 'inline-block', background: '#e3f2fd', color: '#1565c0', borderRadius: '3px', padding: '1px 7px', margin: '1px', fontSize: '12px' }}>{c}</span>
                        ))
                        : <span style={{ color: '#2e7d32' }}>All Categories</span>}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', color: '#666' }}>Income Limit</td>
                    <td style={{ padding: '8px 0', fontWeight: 'bold' }}>
                      {scheme.maxIncome ? `₹${Number(scheme.maxIncome).toLocaleString()} p.a.` : <span style={{ color: '#2e7d32' }}>No limit</span>}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', color: '#666' }}>Scholarship Amount</td>
                    <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#1b5e20' }}>
                      ₹{Number(scheme.amount).toLocaleString()} / year
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#666' }}>Scheme Code</td>
                    <td style={{ padding: '8px 0' }}><code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>{scheme.code}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick eligibility check */}
            <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
              <h5 style={{ color: '#2e7d32', marginTop: 0 }}>🎯 Check Your Eligibility</h5>
              <p style={{ color: '#444', fontSize: '13px', margin: '0 0 12px' }}>
                Not sure if you qualify? Use the eligibility checker to find all schemes you are eligible for.
              </p>
              <button className="btn btn-success btn-block" onClick={() => handleNav('/eligibility')}>
                Eligibility Checker
              </button>
            </div>

            {/* Contact */}
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '20px' }}>
              <h5 style={{ color: '#002147', marginTop: 0 }}>Need Help?</h5>
              <p style={{ color: '#555', fontSize: '13px', margin: '0 0 10px' }}>
                Contact the Social Welfare Department for queries regarding this scheme.
              </p>
              <button className="btn btn-default btn-block btn-sm" onClick={() => handleNav('/contact')}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailPage;
