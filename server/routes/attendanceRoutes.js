const express = require('express');
const router = express.Router();
const { markAttendance, getMyAttendance, getAllAttendance, getClassAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMyAttendance);
router.get('/', protect, authorize('admin'), getAllAttendance);
router.get('/class/:classId', protect, authorize('trainer', 'admin'), getClassAttendance);
router.post('/', protect, authorize('admin', 'trainer'), markAttendance);

module.exports = router;
