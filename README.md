# FitTrack — Gym Management Platform

A production-grade full-stack gym management web application built with the MERN stack. Features role-based dashboards for members, trainers, and admins, with class booking, attendance tracking, workout plans, progress analytics, and membership management.

---

## Tech Stack

**Frontend:** React 18 + Vite · React Router v6 · Tailwind CSS · Axios · React Hook Form · Recharts · Lucide React

**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT Auth · bcryptjs · Multer · express-validator

---

## Project Structure

```
fittrack/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Navbar, Footer, Modal, Table, FormInput, LoadingSpinner
│   │   │   ├── dashboard/   # DashboardSidebar, StatCard, ProgressChart
│   │   │   └── public/      # PlanCard, TrainerCard, ClassCard
│   │   ├── context/         # AuthContext (JWT state management)
│   │   ├── layouts/         # PublicLayout, MemberLayout, TrainerLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/      # Home, About, Plans, Trainers, Classes, Contact, Login, Register
│   │   │   ├── member/      # Dashboard, Profile, Bookings, Attendance, Workout, Progress
│   │   │   ├── trainer/     # Dashboard, Members, Classes, WorkoutManager
│   │   │   └── admin/       # Dashboard, Users, Trainers, Plans, Classes, Bookings, Attendance
│   │   ├── routes/          # ProtectedRoute, RoleRoute
│   │   └── services/        # api.js (Axios + all API service functions)
│   └── index.html
│
└── server/                  # Node.js + Express backend
    ├── config/              # db.js (MongoDB connection)
    ├── controllers/         # auth, user, trainer, plan, membership, class,
    │                        #   booking, attendance, workout, progress, contact, admin
    ├── middleware/          # auth.js (JWT protect + authorize), errorHandler, upload
    ├── models/              # User, TrainerProfile, MembershipPlan, Membership,
    │                        #   Class, Booking, Attendance, WorkoutPlan, ProgressLog, ContactMessage
    ├── routes/              # All route files (12 route groups)
    ├── utils/               # seeder.js
    └── server.js
```

---

## Features

### Roles
| Role | Access |
|------|--------|
| **Member** | Dashboard, class booking, attendance history, workout plan (read), progress tracking |
| **Trainer** | Dashboard, member management, class management, workout plan creation |
| **Admin** | Full platform control: users, trainers, plans, classes, bookings, attendance, analytics |

### Core Modules
- **Authentication** — JWT-based login/register, bcrypt password hashing, role-based route protection
- **Membership Management** — Basic / Standard / Premium plans, auto-expiry detection, admin assignment
- **Class Booking** — Capacity enforcement, duplicate booking prevention, cancel/confirm flow
- **Attendance Tracking** — Admin/trainer mark attendance, per-member stats + percentage
- **Workout Plans** — Trainer creates weekly schedules with exercises (sets/reps/duration/rest)
- **Progress Tracking** — Members log weight/height/BMI, visualized with Recharts line charts
- **BMI Calculator** — Auto-calculated on progress log; also available as standalone tool on profile page
- **Admin Analytics** — Revenue overview, monthly signups bar chart, recent activity feed

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/fittrack.git
cd fittrack
```

### 2. Setup the server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

**Server `.env`:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fittrack
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed the database

```bash
# In the server directory
npm run seed
```

This creates:
- 1 Admin, 2 Trainers, 5 Members
- 3 Membership Plans (Basic $29, Standard $59, Premium $99)
- 5 Classes (HIIT, Yoga, Zumba, Strength Training, Cardio)
- Sample bookings, attendance records, workout plans, and progress logs

**Demo credentials (all use password: `password123`):**
| Role | Email |
|------|-------|
| Admin | admin@fittrack.com |
| Trainer | marcus@fittrack.com |
| Trainer | priya@fittrack.com |
| Member | james@fittrack.com |
| Member | sofia@fittrack.com |

### 4. Setup the client

```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` requests to the server on port 5000.

---

## API Reference

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Membership Plans
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/plans` | Public |
| POST | `/api/plans` | Admin |
| PUT | `/api/plans/:id` | Admin |
| DELETE | `/api/plans/:id` | Admin |

### Classes
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/classes` | Public |
| POST | `/api/classes` | Admin/Trainer |
| PUT | `/api/classes/:id` | Admin/Trainer |
| DELETE | `/api/classes/:id` | Admin |

### Bookings
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/bookings/my` | Member |
| POST | `/api/bookings` | Member |
| DELETE | `/api/bookings/:id` | Member/Admin |

### Workouts
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/workouts/my` | Member |
| GET | `/api/workouts/assigned` | Trainer |
| POST | `/api/workouts` | Trainer/Admin |
| PUT | `/api/workouts/:id` | Trainer/Admin |

### Progress
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/progress/me` | Member |
| POST | `/api/progress` | Member |
| DELETE | `/api/progress/:id` | Member |

### Admin
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/admin/stats` | Admin |

---

## Environment Variables

### Server (`server/.env.example`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fittrack
JWT_SECRET=change_me_in_production
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env.example`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Scripts

### Server
```bash
npm run dev    # Start with nodemon (hot reload)
npm run start  # Production start
npm run seed   # Seed the database with sample data
```

### Client
```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Business Logic

- JWT tokens expire in 30 days; interceptors auto-redirect to login on 401
- Class booking validates capacity before confirming; duplicate bookings rejected via unique index
- Membership expiry is auto-detected on `/api/memberships/me` and status updated
- BMI auto-calculated via Mongoose pre-save hook from weight (kg) and height (cm)
- Admin stats aggregate across all collections in a single request
- File uploads (avatars, trainer images) stored in `/server/uploads/`, served statically

---

## License

MIT — free to use as a portfolio project or starting point for a real gym platform.
