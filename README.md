# e-Grantz 3.0: MERN Clone

Full-stack educational clone of the Kerala government scholarship portal [https://egrantz.kerala.gov.in/](https://egrantz.kerala.gov.in/), built for the Advanced Web Technologies course.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Database | MongoDB Atlas (cloud) |
| Backend | Express.js 4.x, Node.js 18+ |
| API | REST, JWT authentication |
| Frontend | React 18, Vite 5 |
| ORM/ODM | Mongoose 8.x |
| Auth | bcryptjs, jsonwebtoken |
| HTTP Client | axios |

---

## Project Structure

```
.
├── backend/                # Express API server
│   ├── config/            # DB connection
│   ├── middleware/        # auth, rateLimiter
│   ├── models/            # Mongoose schemas (User, Student, Application, etc.)
│   ├── routes/            # API endpoints (auth, notices, students, etc.)
│   ├── utils/             # Helper utilities (e.g. mailer)
│   ├── seed.js            # Database seeder (districts, castes, schemes, sample users)
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env.example       # Environment template
├── frontend/              # Vite + React SPA
│   ├── src/
│   │   ├── components/    # Navbar, LoginSection, NoticeBoard, etc.
│   │   ├── pages/         # StudentLogin, StudentRegister, ForgotPassword
│   │   ├── assets/        # CSS, images, fonts
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js     # Dev server + API proxy
├── .gitignore
├── package.json           # Root workspace scripts
├── package-lock.json
└── README.md
```

---

## Features

### Backend API
- **Authentication:** Login with username/email/register number, JWT tokens, role-based access (student/institution/official/admin)
- **Students:** Registration, profile management, register number generation
- **Applications:** Scholarship application submission with status tracking
- **Institutions:** Institution registration, verification workflows
- **Notices:** CRUD operations for scholarship notices
- **Schemes:** Scholarship scheme management with eligibility rules

### Frontend
- Student registration with Aadhaar and bank details
- Login with remember-me option (local/session storage)
- Dashboard with notice board
- Responsive navigation with top/bottom bars

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### Backend Setup

1. Copy environment template:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Configure `.env` variables:

   | Variable | Description |
   |----------|-------------|
   | `MONGO_URI` | MongoDB Atlas connection string (`mongodb+srv://...`) |
   | `JWT_SECRET` | Secret key for JWT signing |
   | `JWT_EXPIRES_IN` | Token expiration (default: `1d`) |
   | `CLIENT_URL` | Frontend URL (e.g., `http://localhost:5173`) |
   | `PORT` | Server port (default: `5000`) |
   | `SMTP_SERVICE` | Email provider service (e.g., `gmail`) |
   | `SMTP_USER` | Email address for sending OTP/notices |
   | `SMTP_PASS` | App password for SMTP auth |

3. Generate a secure JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. Install dependencies and seed database:
   ```bash
   npm install
   npm run seed
   ```

5. Start the server:
   ```bash
   npm start   # or: node server.js
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Access the app:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:5000/api](http://localhost:5000/api)

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | User authentication | Public |
| GET | `/api/notices` | List all notices | Public |
| POST | `/api/students/register` | Student registration | Public |
| GET | `/api/students/profile` | Get student profile | Student |
| GET | `/api/applications` | List user's applications | Student |
| POST | `/api/applications` | Submit new application | Student |
| PUT | `/api/applications/:id` | Update application | Student |
| GET | `/api/schemes` | List scholarship schemes | Public |

---

## Database Models

- **User:** Authentication, roles (student/institution/official/admin)
- **Student:** Profile, bank details, Aadhaar last 4, institution linkage
- **Application:** Scholarship application with status (pending/approved/rejected)
- **Institution:** College/institution data
- **Scheme:** Scholarship scheme details
- **Notice:** Portal announcements
- **District, Caste, Course:** Reference data for dropdowns
- **AcademicRecord, Document, Payment:** Supporting entities

---

## License

Educational project. Not affiliated with Kerala Government.