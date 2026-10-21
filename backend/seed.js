const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const {
  User,
  Student,
  District,
  Caste,
  Institution,
  Course,
  Scheme,
  AcademicRecord,
  Counter,
  Document,
  Application,
  Payment,
  Notice,
  Contact,
  syncAllIndexes
} = require('./models');
const { encrypt } = require('./utils/crypto');

const keralaDistricts = [
  { name: 'Thiruvananthapuram', code: 'TVM', state: 'Kerala' },
  { name: 'Kollam', code: 'KLM', state: 'Kerala' },
  { name: 'Pathanamthitta', code: 'PTA', state: 'Kerala' },
  { name: 'Alappuzha', code: 'ALP', state: 'Kerala' },
  { name: 'Kottayam', code: 'KTM', state: 'Kerala' },
  { name: 'Idukki', code: 'IDK', state: 'Kerala' },
  { name: 'Ernakulam', code: 'EKM', state: 'Kerala' },
  { name: 'Thrissur', code: 'TCR', state: 'Kerala' },
  { name: 'Palakkad', code: 'PKD', state: 'Kerala' },
  { name: 'Malappuram', code: 'MLP', state: 'Kerala' },
  { name: 'Kozhikode', code: 'KKD', state: 'Kerala' },
  { name: 'Wayanad', code: 'WYD', state: 'Kerala' },
  { name: 'Kannur', code: 'KNR', state: 'Kerala' },
  { name: 'Kasaragod', code: 'KSD', state: 'Kerala' }
];

const castesData = [
  { name: 'Ezhava', category: 'OBC' },
  { name: 'Pulaya', category: 'SC' },
  { name: 'Kanikkar', category: 'ST' },
  { name: 'Dheevara', category: 'OEC' },
  { name: 'Nair', category: 'General' }
];

const noticesData = [
  {
    title: 'OEC Prematric Circular & Amended Guidelines 2025-26',
    link: 'https://egrantz.kerala.gov.in/egrantz_uploads/2d4bff24b8b04383d5fe06f7bb9eb1a9.pdf',
    isPdf: true,
    category: 'Circular',
    published: true,
    active: true
  },
  {
    title: 'Standard Operating Procedure (SOP) for Aadhaar Seeding Status Verification via NPCI Portal',
    link: 'https://egrantz.kerala.gov.in/egrantz_uploads/7c53ae72e34ee672419d8e093bb51589.pdf',
    isPdf: true,
    category: 'Instructions',
    published: true,
    active: true
  },
  {
    title: 'Post-Matric Scholarship 2025-26: Applications Open for SC/ST and OBC Students',
    link: '#',
    isPdf: false,
    category: 'Notification',
    published: true,
    active: true
  },
  {
    title: 'Overseas Scholarship Scheme 2025-26 Rank List Published',
    link: 'https://egrantz.kerala.gov.in/egrantz_uploads/d3c63aabbf194791169bdc6ca515a87f.pdf',
    isPdf: true,
    category: 'Results',
    published: true,
    active: true
  },
  {
    title: 'Last date for Institutional Verification of E-Grantz applications extended to 15-Nov-2026',
    link: '#',
    isPdf: false,
    category: 'General',
    published: true,
    active: true
  }
];

const contactsData = [
  {
    directorate: 'Directorate of Scheduled Castes Development',
    address: 'Museum-Nandhavanam Road, Nandhavanam, Vikasbhavan P.O., Thiruvananthapuram - 695033',
    phone: '0471-2737252, 0471-2737251',
    email: 'egrantz.sc@gmail.com',
    tollFree: '1800 425 2311'
  },
  {
    directorate: 'Directorate of Scheduled Tribes Development Department',
    address: '4th Floor, Vikas Bhavan, Thiruvananthapuram - 695033',
    phone: '0471-2304594, 0471-2303229',
    email: 'egrantzstdd@gmail.com',
    tollFree: '1800 425 2312'
  }
];

const seedData = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/egrantz';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`Connected to MongoDB for seeding: ${conn.connection.host}`);

    // Sync all indexes
    await syncAllIndexes();
    console.log('Indexes synchronized across all models.');

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      Student.deleteMany(),
      District.deleteMany(),
      Caste.deleteMany(),
      Institution.deleteMany(),
      Course.deleteMany(),
      Scheme.deleteMany(),
      AcademicRecord.deleteMany(),
      Counter.deleteMany(),
      Document.deleteMany(),
      Application.deleteMany(),
      Payment.deleteMany(),
      Notice.deleteMany(),
      Contact.deleteMany()
    ]);
    console.log('Cleared existing records.');

    // 1. Seed 14 Kerala districts
    const districts = await District.insertMany(keralaDistricts);
    console.log(`Seeded ${districts.length} Kerala districts.`);
    const districtMap = {};
    districts.forEach(d => { districtMap[d.name] = d._id; });

    // 2. Seed Castes
    const castes = await Caste.insertMany(castesData);
    console.log(`Seeded ${castes.length} caste/category records.`);
    const casteMap = {};
    castes.forEach(c => { casteMap[c.name] = c._id; });

    // 3. Seed 3 Institutions with 2 courses each
    const tkmce = await Institution.create({
      name: 'TKM College of Engineering, Kollam',
      code: 'TKMCE',
      districtId: districtMap['Kollam'],
      address: 'Karicode, Kollam - 691005',
      phone: '0474-2712024',
      email: 'principal@tkmce.ac.in'
    });
    const cet = await Institution.create({
      name: 'College of Engineering Trivandrum',
      code: 'CET',
      districtId: districtMap['Thiruvananthapuram'],
      address: 'Engineering College P.O., Sreekaryam, Thiruvananthapuram - 695016',
      phone: '0471-2515502',
      email: 'principal@cet.ac.in'
    });
    const gect = await Institution.create({
      name: 'Government Engineering College, Thrissur',
      code: 'GECT',
      districtId: districtMap['Thrissur'],
      address: 'Engineering College P.O., Ramavarmapuram, Thrissur - 680009',
      phone: '0487-2334144',
      email: 'principal@gect.ac.in'
    });
    console.log('Seeded 3 institutions.');

    const tkmceCse = await Course.create({
      name: 'B.Tech Computer Science and Engineering',
      code: 'CSE',
      institutionId: tkmce._id,
      durationYears: 4
    });
    const tkmceMe = await Course.create({
      name: 'B.Tech Mechanical Engineering',
      code: 'ME',
      institutionId: tkmce._id,
      durationYears: 4
    });

    const cetCe = await Course.create({
      name: 'B.Tech Civil Engineering',
      code: 'CE',
      institutionId: cet._id,
      durationYears: 4
    });
    const cetEee = await Course.create({
      name: 'B.Tech Electrical & Electronics Engineering',
      code: 'EEE',
      institutionId: cet._id,
      durationYears: 4
    });

    const gectChe = await Course.create({
      name: 'B.Tech Chemical Engineering',
      code: 'CHE',
      institutionId: gect._id,
      durationYears: 4
    });
    const gectEce = await Course.create({
      name: 'B.Tech Electronics & Communication Engineering',
      code: 'ECE',
      institutionId: gect._id,
      durationYears: 4
    });
    console.log('Seeded 6 courses (2 per institution).');

    // 4. Seed 3 Schemes
    const scheme1 = await Scheme.create({
      name: 'Post-Matric Scholarship for SC/ST Students',
      code: 'PMS-SCST',
      description: 'Comprehensive financial assistance including maintenance fee for SC/ST students in higher education',
      categoryEligible: ['SC', 'ST'],
      maxIncome: 250000,
      amount: 25000,
      active: true
    });
    const scheme2 = await Scheme.create({
      name: 'Merit-cum-Means Scholarship for OBC/OEC Students',
      code: 'MCM-OBCOEC',
      description: 'Financial aid for meritorious students belonging to OBC and OEC communities',
      categoryEligible: ['OBC', 'OEC'],
      maxIncome: 200000,
      amount: 15000,
      active: true
    });
    const scheme3 = await Scheme.create({
      name: 'Higher Education Fee Concession Scheme',
      code: 'HE-FEE-CONCESSION',
      description: 'Tuition and exam fee waiver scheme for economically weaker students across all categories',
      categoryEligible: ['SC', 'ST', 'OBC', 'OEC', 'General'],
      maxIncome: 100000,
      amount: 10000,
      active: true
    });
    console.log('Seeded 3 active schemes.');

    // 5. Seed Users
    const adminUser = await User.create({
      username: 'ADM001',
      name: 'State Admin Officer',
      email: 'admin@egrantz.kerala.gov.in',
      password: 'admin123',
      role: 'admin'
    });

    const officialUser = await User.create({
      username: 'OFF001',
      name: 'District Welfare Officer',
      email: 'welfare.kollam@egrantz.gov.in',
      password: 'official123',
      role: 'official'
    });

    const instUser = await User.create({
      username: 'INST001',
      name: 'TKMCE Nodal Officer',
      email: 'nodal@tkmce.ac.in',
      password: 'institution123',
      role: 'institution',
      institutionId: tkmce._id
    });

    const s1User = await User.create({
      username: 'S2026001',
      name: 'Ananya Nair',
      email: 'ananya.s2026@student.edu',
      password: 'student123',
      role: 'student'
    });

    const s2User = await User.create({
      username: 'S2026002',
      name: 'Rahul Pulayan',
      email: 'rahul.s2026@student.edu',
      password: 'student123',
      role: 'student'
    });

    const s3User = await User.create({
      username: 'S2026003',
      name: 'Kavya Kanikkar',
      email: 'kavya.s2026@student.edu',
      password: 'student123',
      role: 'student'
    });
    console.log('Seeded 1 admin, 1 official, 1 institution, and 3 student users.');

    // 6. Seed Matching Students
    const student1 = await Student.create({
      userId: s1User._id,
      registerNumber: 'S2026001',
      dateOfBirth: new Date('2004-05-15'),
      gender: 'female',
      phone: '9847012345',
      address: {
        line1: 'House No 12, Civil Station Ward',
        districtId: districtMap['Kollam'],
        pincode: '691001'
      },
      casteId: casteMap['Ezhava'],
      institutionId: tkmce._id,
      courseId: tkmceCse._id,
      yearOfStudy: 3,
      aadhaarLast4: '1234',
      bank: {
        accountHolder: 'Ananya Nair',
        bankName: 'State Bank of India',
        ifsc: 'SBIN0070033',
        accountLast4: '5678',
        accountNumberEncrypted: encrypt('123456785678')
      }
    });

    const student2 = await Student.create({
      userId: s2User._id,
      registerNumber: 'S2026002',
      dateOfBirth: new Date('2003-08-20'),
      gender: 'male',
      phone: '9847012346',
      address: {
        line1: 'Vikas Nagar 4B, Sreekaryam',
        districtId: districtMap['Thiruvananthapuram'],
        pincode: '695016'
      },
      casteId: casteMap['Pulaya'],
      institutionId: cet._id,
      courseId: cetCe._id,
      yearOfStudy: 2,
      aadhaarLast4: '5678',
      bank: {
        accountHolder: 'Rahul Pulayan',
        bankName: 'Canara Bank',
        ifsc: 'CNRB0001234',
        accountLast4: '9012',
        accountNumberEncrypted: encrypt('987654329012')
      }
    });

    const student3 = await Student.create({
      userId: s3User._id,
      registerNumber: 'S2026003',
      dateOfBirth: new Date('2004-11-10'),
      gender: 'female',
      phone: '9847012347',
      address: {
        line1: 'Forest Colony Road, Ramavarmapuram',
        districtId: districtMap['Thrissur'],
        pincode: '680009'
      },
      casteId: casteMap['Kanikkar'],
      institutionId: gect._id,
      courseId: gectChe._id,
      yearOfStudy: 1,
      aadhaarLast4: '9012',
      bank: {
        accountHolder: 'Kavya Kanikkar',
        bankName: 'Federal Bank',
        ifsc: 'FDRL0001001',
        accountLast4: '3456',
        accountNumberEncrypted: encrypt('554433223456')
      }
    });
    console.log('Seeded 3 students with encrypted bank records.');

    // 7. Seed 2 Academic Records per student
    await AcademicRecord.insertMany([
      { studentId: student1._id, semester: 1, academicYear: '2024-2025', gpa: 8.5, percentage: 85, passed: true },
      { studentId: student1._id, semester: 2, academicYear: '2024-2025', gpa: 8.8, percentage: 88, passed: true },
      { studentId: student2._id, semester: 1, academicYear: '2024-2025', gpa: 7.9, percentage: 79, passed: true },
      { studentId: student2._id, semester: 2, academicYear: '2024-2025', gpa: 8.1, percentage: 81, passed: true },
      { studentId: student3._id, semester: 1, academicYear: '2025-2026', gpa: 8.2, percentage: 82, passed: true },
      { studentId: student3._id, semester: 2, academicYear: '2025-2026', gpa: 8.4, percentage: 84, passed: true }
    ]);
    console.log('Seeded 6 academic records (2 per student).');

    // 8. Seed 5 Notices
    await Notice.insertMany(noticesData);
    console.log('Seeded 5 notices.');

    // 9. Seed 2 Contacts
    await Contact.insertMany(contactsData);
    console.log('Seeded 2 contacts.');

    // 10. Seed Documents for applications
    const doc1 = await Document.create({
      studentId: student1._id,
      documentType: 'income_certificate',
      fileName: 'income_certificate_2025.pdf',
      fileUrl: 'https://egrantz.kerala.gov.in/uploads/doc1.pdf'
    });
    const doc2 = await Document.create({
      studentId: student2._id,
      documentType: 'caste_certificate',
      fileName: 'caste_certificate_2025.pdf',
      fileUrl: 'https://egrantz.kerala.gov.in/uploads/doc2.pdf'
    });

    // 11. Seed 2 Sample Applications
    const app1 = await Application.create({
      applicationNumber: 'EG-2026-000001',
      studentId: student1._id,
      schemeId: scheme2._id,
      institutionId: tkmce._id,
      courseId: tkmceCse._id,
      academicYear: '2025-2026',
      familyIncome: 95000,
      status: 'submitted',
      statusHistory: [
        {
          status: 'draft',
          changedBy: s1User._id,
          remarks: 'Draft application initiated by student',
          at: new Date(Date.now() - 86400000 * 5)
        },
        {
          status: 'submitted',
          changedBy: s1User._id,
          remarks: 'Application submitted for institutional nodal verification',
          at: new Date(Date.now() - 86400000 * 3)
        }
      ],
      documents: [doc1._id]
    });

    const app2 = await Application.create({
      applicationNumber: 'EG-2026-000002',
      studentId: student2._id,
      schemeId: scheme1._id,
      institutionId: cet._id,
      courseId: cetCe._id,
      academicYear: '2025-2026',
      familyIncome: 60000,
      status: 'approved',
      statusHistory: [
        {
          status: 'draft',
          changedBy: s2User._id,
          remarks: 'Application created',
          at: new Date(Date.now() - 86400000 * 10)
        },
        {
          status: 'submitted',
          changedBy: s2User._id,
          remarks: 'Submitted with income & caste certificates',
          at: new Date(Date.now() - 86400000 * 8)
        },
        {
          status: 'institution_verified',
          changedBy: instUser._id,
          remarks: 'Academic and attendance eligibility confirmed by College Nodal Officer',
          at: new Date(Date.now() - 86400000 * 5)
        },
        {
          status: 'approved',
          changedBy: officialUser._id,
          remarks: 'Sanction order approved by District Welfare Officer',
          at: new Date(Date.now() - 86400000 * 2)
        }
      ],
      documents: [doc2._id]
    });

    // Seed Payment for Application 2
    await Payment.create({
      applicationId: app2._id,
      studentId: student2._id,
      amount: scheme1.amount,
      transactionId: 'TXN-2026-KL-987654',
      paidAt: new Date(),
      status: 'success'
    });
    console.log('Seeded 2 sample applications (1 submitted, 1 approved with status trail & payment).');

    await Counter.findByIdAndUpdate(
      'application_2026',
      { seq: 2 },
      { upsert: true }
    );

    console.log('Seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
