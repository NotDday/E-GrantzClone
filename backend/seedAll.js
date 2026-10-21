require('dotenv').config();
const mongoose = require('mongoose');
const { User, Student, Institution, Course, District, Scheme, Application, Counter } = require('./models');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing seeded data (keep the official user)
  await Application.deleteMany({});
  await Student.deleteMany({});
  await User.deleteMany({ role: 'student' });
  await Institution.deleteMany({});
  await Course.deleteMany({});
  await District.deleteMany({});
  await Scheme.deleteMany({});
  await Counter.deleteMany({});

  // Reset counters
  await Counter.findByIdAndUpdate('student_register_number', { seq: 0 }, { upsert: true });
  await Counter.findByIdAndUpdate('application_' + new Date().getFullYear(), { seq: 0 }, { upsert: true });

  // 1. Seed Districts
  const districts = await District.insertMany([
    { name: 'Thiruvananthapuram', code: 'TVM', state: 'Kerala' },
    { name: 'Kollam', code: 'KLM', state: 'Kerala' },
    { name: 'Ernakulam', code: 'EKM', state: 'Kerala' },
    { name: 'Kozhikode', code: 'CLT', state: 'Kerala' },
    { name: 'Thrissur', code: 'TCR', state: 'Kerala' }
  ]);
  console.log(`Seeded ${districts.length} districts`);

  // 2. Seed Institutions
  const institutions = await Institution.insertMany([
    { name: 'TKM College of Engineering', code: 'TKMCE', districtId: districts[1]._id, address: 'Karicode, Kollam, Kerala', phone: '0474-2712345', email: 'office@tkmce.ac.in' },
    { name: 'College of Engineering Trivandrum', code: 'CET', districtId: districts[0]._id, address: 'Sreekaryam, Thiruvananthapuram', phone: '0471-2512345', email: 'office@cet.ac.in' },
    { name: 'Government Engineering College Thrissur', code: 'GECTCR', districtId: districts[4]._id, address: 'Ramavarmapuram, Thrissur', phone: '0487-2312345', email: 'office@gectcr.ac.in' },
    { name: 'NIT Calicut', code: 'NITC', districtId: districts[3]._id, address: 'Kattangal, Kozhikode', phone: '0495-2287201', email: 'admissions@nitc.ac.in' }
  ]);
  console.log(`Seeded ${institutions.length} institutions`);

  // 3. Seed Courses
  const courses = await Course.insertMany([
    { name: 'B.Tech Computer Science', code: 'CSE', institutionId: institutions[0]._id, durationYears: 4 },
    { name: 'B.Tech Mechanical Engineering', code: 'MEC', institutionId: institutions[0]._id, durationYears: 4 },
    { name: 'B.Tech Electronics & Communication', code: 'ECE', institutionId: institutions[1]._id, durationYears: 4 },
    { name: 'B.Tech Civil Engineering', code: 'CIV', institutionId: institutions[1]._id, durationYears: 4 },
    { name: 'B.Tech Information Technology', code: 'IT', institutionId: institutions[2]._id, durationYears: 4 },
    { name: 'M.Tech Structural Engineering', code: 'MSE', institutionId: institutions[3]._id, durationYears: 2 },
    { name: 'MCA - Master of Computer Applications', code: 'MCA', institutionId: institutions[0]._id, durationYears: 3 }
  ]);
  console.log(`Seeded ${courses.length} courses`);

  // 4. Seed Schemes
  const schemes = await Scheme.insertMany([
    { name: 'Post Matric Scholarship for SC Students', code: 'PMS-SC', description: 'Scholarship for SC students pursuing post-matric courses.', categoryEligible: ['SC'], maxIncome: 250000, amount: 13500 },
    { name: 'Post Matric Scholarship for ST Students', code: 'PMS-ST', description: 'Scholarship for ST students pursuing post-matric courses.', categoryEligible: ['ST'], maxIncome: 250000, amount: 13500 },
    { name: 'Post Matric Scholarship for OBC Students', code: 'PMS-OBC', description: 'Scholarship for OBC students pursuing post-matric courses.', categoryEligible: ['OBC'], maxIncome: 100000, amount: 10000 },
    { name: 'Post Matric Scholarship for OEC Students', code: 'PMS-OEC', description: 'Scholarship for OEC students pursuing post-matric courses.', categoryEligible: ['OEC'], maxIncome: 100000, amount: 10000 },
    { name: 'Overseas Scholarship for SC/ST Students', code: 'OSS-SCST', description: 'Scholarship for SC/ST students pursuing higher studies abroad.', categoryEligible: ['SC', 'ST'], maxIncome: 600000, amount: 450000 },
    { name: 'Educational Empowerment Programme (EEP)', code: 'EEP', description: 'Financial assistance for competitive exam preparation.', categoryEligible: ['SC', 'ST'], maxIncome: 250000, amount: 25000 }
  ]);
  console.log(`Seeded ${schemes.length} schemes`);

  // 5. Seed Students (Users + Student profiles)
  const studentDefs = [
    {
      name: 'Arjun Krishnan',
      email: 'arjun.krishnan@example.com',
      username: 'arjun_k',
      password: 'password123',
      registerNumber: 'STU000001',
      dateOfBirth: new Date('2003-05-14'),
      gender: 'male',
      phone: '9847012345',
      address: { line1: 'Puthan Veedu, Vattappara PO, Thiruvananthapuram', districtId: districts[0]._id, pincode: '695028' },
      presentAddress: { line1: 'TKM Hostel, Karicode, Kollam', pincode: '691005' },
      institutionId: institutions[0]._id,
      courseId: courses[0]._id,
      yearOfStudy: 3,
      aadhaarLast4: '1234',
      bank: { accountHolder: 'Arjun Krishnan', bankName: 'State Bank of India', branchName: 'Vattappara', ifsc: 'SBIN0001234', accountLast4: '5678' },
      applications: [
        { schemeIdx: 0, status: 'approved', academicYear: '2025-26', familyIncome: 180000 },
        { schemeIdx: 4, status: 'reverted', academicYear: '2025-26', familyIncome: 180000, remarks: 'Income proof documents incomplete' }
      ]
    },
    {
      name: 'Meera Nair',
      email: 'meera.nair@example.com',
      username: 'meera_nair',
      password: 'password123',
      registerNumber: 'STU000002',
      dateOfBirth: new Date('2002-11-23'),
      gender: 'female',
      phone: '9847023456',
      address: { line1: 'Nair Bhavan, Sreekaryam, Thiruvananthapuram', districtId: districts[0]._id, pincode: '695016' },
      presentAddress: { line1: 'CET Hostel, Sreekaryam, Thiruvananthapuram', pincode: '695016' },
      institutionId: institutions[1]._id,
      courseId: courses[2]._id,
      yearOfStudy: 4,
      aadhaarLast4: '2345',
      bank: { accountHolder: 'Meera Nair', bankName: 'Canara Bank', branchName: 'Sreekaryam', ifsc: 'CNRB0005678', accountLast4: '9012' },
      applications: [
        { schemeIdx: 2, status: 'submitted', academicYear: '2025-26', familyIncome: 85000 },
        { schemeIdx: 3, status: 'approved', academicYear: '2025-26', familyIncome: 85000 }
      ]
    },
    {
      name: 'Rahul Menon',
      email: 'rahul.menon@example.com',
      username: 'rahul_menon',
      password: 'password123',
      registerNumber: 'STU000003',
      dateOfBirth: new Date('2001-08-12'),
      gender: 'male',
      phone: '9847034567',
      address: { line1: 'Menon House, Ramavarmapuram, Thrissur', districtId: districts[4]._id, pincode: '680009' },
      presentAddress: { line1: 'GEC Hostel, Ramavarmapuram, Thrissur', pincode: '680009' },
      institutionId: institutions[2]._id,
      courseId: courses[4]._id,
      yearOfStudy: 2,
      aadhaarLast4: '3456',
      bank: { accountHolder: 'Rahul Menon', bankName: 'Federal Bank', branchName: 'Thrissur', ifsc: 'FEDL0009012', accountLast4: '3456' },
      applications: [
        { schemeIdx: 1, status: 'submitted', academicYear: '2025-26', familyIncome: 220000 },
        { schemeIdx: 5, status: 'approved', academicYear: '2025-26', familyIncome: 220000 }
      ]
    },
    {
      name: 'Sneha Thomas',
      email: 'sneha.thomas@example.com',
      username: 'sneha_t',
      password: 'password123',
      registerNumber: 'STU000004',
      dateOfBirth: new Date('2000-03-30'),
      gender: 'female',
      phone: '9847045678',
      address: { line1: 'Thomas Veedu, Kattangal, Kozhikode', districtId: districts[3]._id, pincode: '673601' },
      presentAddress: { line1: 'NITC Ladies Hostel, Kattangal, Kozhikode', pincode: '673601' },
      institutionId: institutions[3]._id,
      courseId: courses[5]._id,
      yearOfStudy: 1,
      aadhaarLast4: '4567',
      bank: { accountHolder: 'Sneha Thomas', bankName: 'HDFC Bank', branchName: 'Kozhikode', ifsc: 'HDFC0001234', accountLast4: '7890' },
      applications: [
        { schemeIdx: 0, status: 'approved', academicYear: '2025-26', familyIncome: 150000 }
      ]
    },
    {
      name: 'Vishnu Prasad',
      email: 'vishnu.prasad@example.com',
      username: 'vishnu_p',
      password: 'password123',
      registerNumber: 'STU000005',
      dateOfBirth: new Date('1999-12-05'),
      gender: 'male',
      phone: '9847056789',
      address: { line1: 'Prasad Nilayam, Karicode, Kollam', districtId: districts[1]._id, pincode: '691005' },
      presentAddress: { line1: 'TKM PG Block, Karicode, Kollam', pincode: '691005' },
      institutionId: institutions[0]._id,
      courseId: courses[6]._id,
      yearOfStudy: 2,
      aadhaarLast4: '5678',
      bank: { accountHolder: 'Vishnu Prasad', bankName: 'Indian Bank', branchName: 'Kollam', ifsc: 'IDIB000K012', accountLast4: '2345' },
      applications: [
        { schemeIdx: 0, status: 'reverted', academicYear: '2025-26', familyIncome: 200000, remarks: 'Caste certificate needs renewal' },
        { schemeIdx: 4, status: 'submitted', academicYear: '2025-26', familyIncome: 200000 }
      ]
    }
  ];

  let appCount = 0;
  for (const def of studentDefs) {
    // Create User
    const user = await User.create({
      username: def.username,
      name: def.name,
      email: def.email,
      password: def.password,
      role: 'student'
    });

    // Create Student
    const student = await Student.create({
      userId: user._id,
      registerNumber: def.registerNumber,
      dateOfBirth: def.dateOfBirth,
      gender: def.gender,
      phone: def.phone,
      address: def.address,
      presentAddress: def.presentAddress,
      institutionId: def.institutionId,
      courseId: def.courseId,
      yearOfStudy: def.yearOfStudy,
      aadhaarLast4: def.aadhaarLast4,
      bank: def.bank
    });

    // Create Applications
    for (const app of def.applications) {
      const year = new Date().getFullYear();
      const counter = await Counter.findByIdAndUpdate(
        `application_${year}`,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const appNumber = `EG-${year}-${String(counter.seq).padStart(6, '0')}`;
      await Application.create({
        applicationNumber: appNumber,
        studentId: student._id,
        schemeId: schemes[app.schemeIdx]._id,
        institutionId: def.institutionId,
        courseId: def.courseId,
        academicYear: app.academicYear,
        familyIncome: app.familyIncome,
        status: app.status,
        statusHistory: [{
          status: app.status,
          remarks: app.remarks || `Application ${app.status}`,
          at: new Date()
        }]
      });
      appCount++;
    }
  }

  // Update student counter
  await Counter.findByIdAndUpdate('student_register_number', { seq: studentDefs.length }, { upsert: true });

  console.log(`\n========================================`);
  console.log(`SEED COMPLETE`);
  console.log(`========================================`);
  console.log(`Districts:        ${districts.length}`);
  console.log(`Institutions:     ${institutions.length}`);
  console.log(`Courses:          ${courses.length}`);
  console.log(`Schemes:          ${schemes.length}`);
  console.log(`Students/Users:   ${studentDefs.length}`);
  console.log(`Applications:     ${appCount}`);
  console.log(`\n--- STUDENT CREDENTIALS ---`);
  for (const def of studentDefs) {
    console.log(`${def.name} | ${def.email} | ${def.username} | password: ${def.password} | Register: ${def.registerNumber}`);
  }
  console.log(`\n--- OFFICIAL CREDENTIALS ---`);
  console.log(`Department Official | official@egrantz.gov.in | official | password: password123`);

  await mongoose.disconnect();
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
