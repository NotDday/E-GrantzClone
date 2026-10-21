import React, { useState } from 'react';
import axios from 'axios';
import PublicLayout from './PublicLayout';

const OneTimeRegPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', aadhaar: '', dob: '', gender: 'male', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register-student', {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        username: formData.email,
        password: formData.password,
        aadhaarLast4: formData.aadhaar.slice(-4),
        dob: formData.dob,
        gender: formData.gender
      });

      if (res.data.success) {
        setSuccess(`OTR Registration Successful! Register Number: ${res.data.registerNumber || 'Will be emailed to you'}.`);
        setTimeout(() => {
          if (navigate) navigate('/login');
          else window.location.href = '/login';
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleNav = (path) => (e) => {
    e.preventDefault();
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  return (
    <PublicLayout navigate={navigate} title="ONE TIME REGISTRATION (OTR)">
      <div className="row clearfix">
        <div className="col-lg-8 col-md-10 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Student One Time Registration</h2>
              <p className="category">Create your e-Grantz account to apply for scholarships</p>
            </div>
            <div className="body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleRegister}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Full Name (as per Aadhaar / SSLC) <span className="col-red">*</span></label>
                      <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email Address <span className="col-red">*</span></label>
                      <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Mobile Number <span className="col-red">*</span></label>
                      <input type="text" name="mobile" className="form-control" value={formData.mobile} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Aadhaar Number (12 digits) <span className="col-red">*</span></label>
                      <input type="text" name="aadhaar" className="form-control" maxLength="12" value={formData.aadhaar} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Date of Birth <span className="col-red">*</span></label>
                      <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Gender <span className="col-red">*</span></label>
                      <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Password <span className="col-red">*</span></label>
                      <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Confirm Password <span className="col-red">*</span></label>
                      <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary waves-effect" disabled={loading}>
                  <i className="material-icons">app_registration</i> {loading ? 'Processing...' : 'Complete One Time Registration'}
                </button>
                <a href="/login" onClick={handleNav('/login')} className="btn btn-default" style={{ marginLeft: '10px' }}>
                  Already registered? Login
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OneTimeRegPage;
