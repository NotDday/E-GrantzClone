import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const CandidateProfile = ({ navigate }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('/api/students/me', { headers: { Authorization: `Bearer ${token}` } });
      setStudent(res.data.student);
      setFormData({
        name: res.data.student?.userId?.name || '',
        email: res.data.student?.userId?.email || '',
        phone: res.data.student?.phone || '',
        gender: res.data.student?.gender || 'male',
        dateOfBirth: res.data.student?.dateOfBirth ? new Date(res.data.student.dateOfBirth).toISOString().split('T')[0] : '',
        addressLine1: res.data.student?.address?.line1 || '',
        pincode: res.data.student?.address?.pincode || '',
        presentLine1: res.data.student?.presentAddress?.line1 || '',
        presentPincode: res.data.student?.presentAddress?.pincode || '',
        yearOfStudy: res.data.student?.yearOfStudy || '',
        bankHolder: res.data.student?.bank?.accountHolder || '',
        bankName: res.data.student?.bank?.bankName || '',
        branchName: res.data.student?.bank?.branchName || '',
        accountNumber: res.data.student?.bank?.accountLast4 || '',
        ifsc: res.data.student?.bank?.ifsc || ''
      });
      setPhotoPreview(res.data.student?.profilePic || '');
    } catch (err) {
      console.error(err);
      setError('Could not load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      let payload = {};
      if (editMode === 'profile') {
        payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          yearOfStudy: formData.yearOfStudy ? Number(formData.yearOfStudy) : undefined,
          address: { line1: formData.addressLine1, pincode: formData.pincode },
          presentAddress: { line1: formData.presentLine1, pincode: formData.presentPincode }
        };
      } else if (editMode === 'bank') {
        payload = {
          bank: {
            accountHolder: formData.bankHolder,
            bankName: formData.bankName,
            branchName: formData.branchName,
            ifsc: formData.ifsc,
            accountLast4: formData.accountNumber.slice(-4)
          }
        };
      }
      const res = await axios.put('/api/students/me', payload, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setStudent(res.data.student);
        setEditMode('');
        setMessage('Updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setPhotoPreview(reader.result);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const res = await axios.post('/api/students/me/profile-pic',
          { profilePic: reader.result },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setStudent({ ...student, profilePic: reader.result });
          setMessage('Profile photo updated successfully!');
          setError('');
        }
      } catch (err) {
        setError('Could not update profile photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' };
  const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px' };

  if (loading) {
    return (
      <PortalLayout navigate={navigate}>
        <div className="alert alert-info">Loading profile...</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout navigate={navigate}>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card" style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '2px', marginBottom: '30px' }}>
            <div className="header" style={{ padding: '20px 25px', borderBottom: '1px solid #eee', background: '#fff' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>PROFILE</h2>
            </div>
            <div className="body" style={{ padding: '20px 25px' }}>
              {message && <div className="alert alert-success" style={{ marginBottom: '20px' }}>{message}</div>}
              {error && <div className="alert alert-danger" style={{ marginBottom: '20px' }}>{error}</div>}

              {editMode === '' ? (
                <div>
                  <table className="table table-striped table-bordered table-hover" style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 'bold', marginBottom: '20px', width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td colSpan="2" style={{ padding: '15px', verticalAlign: 'middle' }}>
                          <img alt="Profile" height="150" width="150" src={student?.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23c8d6e5'/%3E%3Ccircle cx='75' cy='58' r='28' fill='%23ffffff'/%3E%3Cellipse cx='75' cy='130' rx='46' ry='34' fill='%23ffffff'/%3E%3C/svg%3E"}
                            style={{ width: '150px', height: '150px', marginRight: '20px', verticalAlign: 'middle', border: '1px solid #ddd', display: 'inline-block', borderRadius: '4px', objectFit: 'cover' }} />
                          <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                            <h3 style={{ margin: '0 0 5px 0' }}>{student?.userId?.name || 'N/A'}</h3>
                            <p style={{ margin: 0, color: '#777' }}>{student?.userId?.email || 'N/A'}</p>
                            <p style={{ margin: '5px 0 0 0', color: '#777' }}>Register No: {student?.registerNumber || 'N/A'}</p>
                          </div>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td style={{ padding: '10px 15px' }}>Name</td><td style={{ padding: '10px 15px' }}><b>{student?.userId?.name || '—'}</b></td></tr>
                      <tr style={{ backgroundColor: '#A9F5E1' }}><td style={{ padding: '10px 15px' }}>Date of Birth</td><td style={{ padding: '10px 15px' }}><b>{student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : '—'}</b></td></tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td style={{ padding: '10px 15px' }}>Mobile Number</td><td style={{ padding: '10px 15px' }}><b>{student?.phone || '—'}</b></td></tr>
                      <tr style={{ backgroundColor: '#A9F5E1' }}><td style={{ padding: '10px 15px' }}>Email Address</td><td style={{ padding: '10px 15px' }}><b>{student?.userId?.email || '—'}</b></td></tr>
                      <tr style={{ backgroundColor: '#F6CEF5' }}><td style={{ padding: '10px 15px' }}>Permanent Address</td><td style={{ padding: '10px 15px' }}><address style={{ margin: 0 }}>{student?.address?.line1 || '—'}{student?.address?.pincode ? `, ${student.address.pincode}` : ''}{student?.address?.districtId?.name ? `, ${student.address.districtId.name}` : ''}</address></td></tr>
                      <tr style={{ backgroundColor: '#A9F5A9' }}><td style={{ padding: '10px 15px' }}>Present Address</td><td style={{ padding: '10px 15px' }}><address style={{ margin: 0 }}>{student?.presentAddress?.line1 || student?.address?.line1 || '—'}{student?.presentAddress?.pincode ? `, ${student.presentAddress.pincode}` : (student?.address?.pincode ? `, ${student.address.pincode}` : '')}</address></td></tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td style={{ padding: '10px 15px' }}>Institution Name</td><td style={{ padding: '10px 15px' }}>{student?.institutionId?.name || '—'}</td></tr>
                      <tr style={{ backgroundColor: '#A9F5E1' }}><td style={{ padding: '10px 15px' }}>Course Name</td><td style={{ padding: '10px 15px' }}>{student?.courseId?.name || '—'}</td></tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td style={{ padding: '10px 15px' }}>Course Year</td><td style={{ padding: '10px 15px' }}>{student?.yearOfStudy ? `Year ${student.yearOfStudy}` : '—'}</td></tr>
                      <tr style={{ backgroundColor: '#A9F5E1' }}><td style={{ padding: '10px 15px' }}>Bank Name</td><td style={{ padding: '10px 15px' }}><b>{student?.bank?.bankName || '—'}</b></td></tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td style={{ padding: '10px 15px' }}>Branch Name</td><td style={{ padding: '10px 15px' }}><b>{student?.bank?.branchName || '—'}</b></td></tr>
                      <tr style={{ backgroundColor: '#A9F5E1' }}><td style={{ padding: '10px 15px' }}>Account Number</td><td style={{ padding: '10px 15px' }}><b>{student?.bank?.accountLast4 ? `****${student.bank.accountLast4}` : '—'}</b></td></tr>
                      <tr style={{ backgroundColor: '#F6CEEC' }}><td style={{ padding: '10px 15px' }}>IFSC Code</td><td style={{ padding: '10px 15px' }}><b>{student?.bank?.ifsc || '—'}</b></td></tr>
                    </tbody>
                  </table>

                  <table className="table table-striped table-bordered table-hover" style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 'bold', width: '100%' }}>
                    <tbody>
                      <tr>
                        <td colSpan="2" style={{ padding: '12px 15px' }}><h4 style={{ margin: 0, fontSize: '16px' }}>Update My Profile</h4></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 15px' }}>Update Profile Photo</td>
                        <td style={{ padding: '10px 15px' }}>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'inline-block' }} />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 15px' }}>Update Profile Details</td>
                        <td style={{ padding: '10px 15px' }}>
                          <a href="#" onClick={(e) => { e.preventDefault(); setEditMode('profile'); setMessage(''); setError(''); }}>
                            <span className="label label-success" style={{ backgroundColor: '#5cb85c', color: '#fff', padding: '4px 8px', borderRadius: '3px', fontSize: '12px' }}>Click here to update</span>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 15px' }}>Update Bank Details</td>
                        <td style={{ padding: '10px 15px' }}>
                          <a href="#" onClick={(e) => { e.preventDefault(); setEditMode('bank'); setMessage(''); setError(''); }}>
                            <span className="label label-success" style={{ backgroundColor: '#5cb85c', color: '#fff', padding: '4px 8px', borderRadius: '3px', fontSize: '12px' }}>Click here to update</span>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <form onSubmit={handleUpdate} style={{ maxWidth: '600px' }}>
                  <h4 style={{ marginBottom: '20px' }}>{editMode === 'profile' ? 'Edit Profile Information' : 'Edit Bank Details'}</h4>
                  {editMode === 'profile' && (
                    <>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Name</label>
                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Email</label>
                        <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Mobile Number</label>
                        <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Date of Birth</label>
                        <input type="date" className="form-control" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Gender</label>
                        <select className="form-control" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} style={inputStyle}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Permanent Address</label>
                        <input type="text" className="form-control" value={formData.addressLine1} onChange={e => setFormData({ ...formData, addressLine1: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Pincode</label>
                        <input type="text" className="form-control" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Present Address</label>
                        <input type="text" className="form-control" value={formData.presentLine1} onChange={e => setFormData({ ...formData, presentLine1: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Present Pincode</label>
                        <input type="text" className="form-control" value={formData.presentPincode} onChange={e => setFormData({ ...formData, presentPincode: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Year of Study</label>
                        <input type="number" min="1" max="6" className="form-control" value={formData.yearOfStudy} onChange={e => setFormData({ ...formData, yearOfStudy: e.target.value })} style={inputStyle} />
                      </div>
                    </>
                  )}
                  {editMode === 'bank' && (
                    <>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Account Holder Name</label>
                        <input type="text" className="form-control" value={formData.bankHolder} onChange={e => setFormData({ ...formData, bankHolder: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Bank Name</label>
                        <input type="text" className="form-control" value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Branch Name</label>
                        <input type="text" className="form-control" value={formData.branchName} onChange={e => setFormData({ ...formData, branchName: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Account Number</label>
                        <input type="text" className="form-control" value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} style={inputStyle} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>IFSC Code</label>
                        <input type="text" className="form-control" value={formData.ifsc} onChange={e => setFormData({ ...formData, ifsc: e.target.value })} style={inputStyle} />
                      </div>
                    </>
                  )}
                  <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#002147', color: '#fff', padding: '8px 20px', border: 'none', borderRadius: '3px', marginRight: '10px' }}>Save</button>
                    <button type="button" className="btn btn-default" onClick={() => { setEditMode(''); setMessage(''); setError(''); }} style={{ padding: '8px 20px', border: '1px solid #ccc', borderRadius: '3px' }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CandidateProfile;
