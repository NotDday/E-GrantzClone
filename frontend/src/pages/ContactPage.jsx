import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PublicLayout from './PublicLayout';

const ContactPage = ({ navigate }) => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/contacts').then(res => setContacts(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/contacts', form);
      if (res.data.success) {
        setSuccess('Your message has been submitted successfully to e-Grantz Support!');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit contact message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout navigate={navigate} title="CONTACT US">
      {/* Directorate Contacts */}
      <div className="row clearfix">
        {contacts.map((c, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
            <div className="card">
              <div className="header bg-red">
                <h2 className="title">{c.directorate}</h2>
              </div>
              <div className="body">
                <ul className="list-unstyled" style={{ lineHeight: '2' }}>
                  <li><i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#f44336' }}>location_on</i> {c.address}</li>
                  <li><i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#f44336' }}>email</i> {c.email}</li>
                  <li><i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#f44336' }}>phone</i> {c.phone}</li>
                  {c.tollFree && <li><i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#4CAF50' }}>support_agent</i> Toll Free: {c.tollFree}</li>}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="row clearfix">
        <div className="col-lg-8 col-md-10 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Send Grievance / Inquiry</h2>
            </div>
            <div className="body">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Your Name <span className="col-red">*</span></label>
                      <input type="text" className="form-control" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email Address <span className="col-red">*</span></label>
                      <input type="email" className="form-control" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="text" className="form-control" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Subject <span className="col-red">*</span></label>
                      <input type="text" className="form-control" value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Message / Grievance Description <span className="col-red">*</span></label>
                  <textarea className="form-control" rows="5" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary waves-effect" disabled={loading}>
                  <i className="material-icons">send</i> {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
