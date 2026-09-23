const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/memberships', require('./routes/membershipRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'FitTrack API running' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FitTrack server running on port ${PORT}`));
