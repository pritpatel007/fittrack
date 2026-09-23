const express = require('express');
const router = express.Router();
const { createBooking, cancelBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyBookings);
router.get('/', protect, authorize('admin'), getAllBookings);
router.post('/', protect, authorize('member'), createBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
