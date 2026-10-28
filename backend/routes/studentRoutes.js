const express = require('express');
const router = express.Router();
const { Student, User } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email username lastLoginAt')
      .populate('address.districtId', 'name code state')
      .populate('institutionId', 'name code address phone email')
      .populate('courseId', 'name code durationYears');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const studentObj = student.toObject();
    if (studentObj.bank) delete studentObj.bank.accountNumberEncrypted;
    res.json({ success: true, student: studentObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/me', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const { phone, address, presentAddress, bank, gender, dateOfBirth, aadhaarLast4, profilePic, yearOfStudy, name, email } = req.body;
    if (phone !== undefined) student.phone = phone;
    if (gender !== undefined) student.gender = gender;
    if (dateOfBirth !== undefined) student.dateOfBirth = dateOfBirth;
    if (aadhaarLast4 !== undefined) student.aadhaarLast4 = aadhaarLast4;
    if (yearOfStudy !== undefined) student.yearOfStudy = yearOfStudy;
    if (profilePic !== undefined) student.profilePic = profilePic;
    if (address !== undefined) student.address = { ...student.address, ...address };
    if (presentAddress !== undefined) student.presentAddress = { ...student.presentAddress, ...presentAddress };
    if (bank !== undefined) student.bank = { ...student.bank, ...bank };
    await student.save();
    if (name || email) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        await user.save();
      }
    }
    const updated = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email username lastLoginAt')
      .populate('address.districtId', 'name code state')
      .populate('institutionId', 'name code address phone email')
      .populate('courseId', 'name code durationYears');
    res.json({ success: true, message: 'Profile updated successfully', student: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/me/completeness', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email')
      .populate('address.districtId');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const checks = [
      { key: 'name', label: 'Full Name', done: !!(student.userId && student.userId.name) },
      { key: 'email', label: 'Email', done: !!(student.userId && student.userId.email) },
      { key: 'phone', label: 'Phone', done: !!student.phone },
      { key: 'dob', label: 'Date of Birth', done: !!student.dateOfBirth },
      { key: 'gender', label: 'Gender', done: !!student.gender },
      { key: 'aadhaar', label: 'Aadhaar (last 4)', done: !!student.aadhaarLast4 },
      { key: 'address', label: 'Permanent Address', done: !!(student.address && student.address.line1 && student.address.pincode) },
      { key: 'district', label: 'District', done: !!(student.address && student.address.districtId) },
      { key: 'presentAddress', label: 'Present Address', done: !!(student.presentAddress && student.presentAddress.line1) },
      { key: 'institution', label: 'Institution', done: !!student.institutionId },
      { key: 'course', label: 'Course', done: !!student.courseId },
      { key: 'yearOfStudy', label: 'Year of Study', done: !!student.yearOfStudy },
      { key: 'bankHolder', label: 'Bank Account Holder', done: !!(student.bank && student.bank.accountHolder) },
      { key: 'bankName', label: 'Bank Name', done: !!(student.bank && student.bank.bankName) },
      { key: 'ifsc', label: 'IFSC', done: !!(student.bank && student.bank.ifsc) },
      { key: 'accountLast4', label: 'Account No (last 4)', done: !!(student.bank && student.bank.accountLast4) }
    ];
    const doneCount = checks.filter(c => c.done).length;
    const percent = Math.round((doneCount / checks.length) * 100);
    res.json({ success: true, percent, doneCount, total: checks.length, checks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/me/profile-pic', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ success: false, message: 'Profile picture data is required' });
    student.profilePic = profilePic;
    await student.save();
    res.json({ success: true, message: 'Profile photo updated successfully', profilePic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/students/qualifications
router.get('/qualifications', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    res.json({ success: true, qualifications: student.qualifications || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/students/qualifications
router.post('/qualifications', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const { semester, academicYear, gpa, percentage } = req.body;
    if (!semester) return res.status(400).json({ success: false, message: 'Semester is required' });

    // Prevent duplicate semester entry
    const existing = student.qualifications.find(q => q.semester === Number(semester));
    if (existing) {
      // Update in place
      existing.academicYear = academicYear || existing.academicYear;
      existing.gpa = gpa !== undefined ? gpa : existing.gpa;
      existing.percentage = percentage !== undefined ? percentage : existing.percentage;
    } else {
      student.qualifications.push({ semester: Number(semester), academicYear, gpa, percentage });
    }

    await student.save();
    res.status(201).json({ success: true, message: 'Qualification saved successfully', qualifications: student.qualifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/students/qualifications/:id
router.delete('/qualifications/:id', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const before = student.qualifications.length;
    student.qualifications = student.qualifications.filter(q => q._id.toString() !== req.params.id);
    if (student.qualifications.length === before) {
      return res.status(404).json({ success: false, message: 'Qualification record not found' });
    }

    await student.save();
    res.json({ success: true, message: 'Qualification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
