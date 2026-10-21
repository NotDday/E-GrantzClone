import React, { useState } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const ChangePasswordPage = ({ navigate }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'danger' });
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.put('/api/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to change password', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout navigate={navigate} title="CHANGE PASSWORD">
      <div className="row clearfix">
        <div className="col-lg-6 col-md-8 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Change Account Password</h2>
            </div>
            <div className="body">
              {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" className="form-control" value={form.currentPassword}
                    onChange={e => setForm({ ...form, currentPassword: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" className="form-control" value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" className="form-control" value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>

                <button type="submit" className="btn btn-primary waves-effect" disabled={loading}>
                  <i className="material-icons">lock</i> {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ChangePasswordPage;
