import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from './PortalLayout';

const AddQualification = ({ navigate }) => {
  const [qualifications, setQualifications] = useState([]);
  const [form, setForm] = useState({ semester: 1, academicYear: '2025-2026', gpa: '', percentage: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchQualifications = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('/api/students/qualifications', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setQualifications(res.data.qualifications || []))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchQualifications(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.post('/api/students/qualifications', form, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setMessage({ text: 'Qualification record saved successfully!', type: 'success' });
        fetchQualifications();
        setForm({ semester: 1, academicYear: '2025-2026', gpa: '', percentage: '' });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to save qualification', type: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this qualification record?')) return;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.delete(`/api/students/qualifications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ text: 'Qualification deleted successfully', type: 'success' });
      fetchQualifications();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to delete', type: 'danger' });
    }
  };

  return (
    <PortalLayout navigate={navigate} title="ADD QUALIFICATION">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Add / Update Semester Academic Record</h2>
            </div>
            <div className="body">
              {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

              <form onSubmit={handleAdd}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Semester</label>
                      <input type="number" className="form-control" min="1" max="12" value={form.semester}
                        onChange={e => setForm({ ...form, semester: Number(e.target.value) })} required />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Academic Year</label>
                      <input type="text" className="form-control" value={form.academicYear}
                        onChange={e => setForm({ ...form, academicYear: e.target.value })} required />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>GPA / CGPA (0–10)</label>
                      <input type="number" step="0.01" className="form-control" min="0" max="10" value={form.gpa}
                        onChange={e => setForm({ ...form, gpa: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Percentage (%)</label>
                      <input type="number" step="0.01" className="form-control" min="0" max="100" value={form.percentage}
                        onChange={e => setForm({ ...form, percentage: e.target.value })} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary waves-effect">
                  <i className="material-icons">save</i> Save Record
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>Your Academic Records</h2>
            </div>
            <div className="body">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Academic Year</th>
                    <th>GPA</th>
                    <th>Percentage</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {qualifications.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No records added yet.</td></tr>
                  ) : qualifications.map(q => (
                    <tr key={q._id}>
                      <td>Semester {q.semester}</td>
                      <td>{q.academicYear}</td>
                      <td>{q.gpa ?? 'N/A'}</td>
                      <td>{q.percentage ?? 'N/A'}%</td>
                      <td>
                        <button className="btn btn-danger btn-sm waves-effect" onClick={() => handleDelete(q._id)}>
                          <i className="material-icons">delete</i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AddQualification;
