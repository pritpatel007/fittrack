const Booking = require('../models/Booking');
const Class = require('../models/Class');

// @desc  Book a class (member only)
exports.createBooking = async (req, res, next) => {
  try {
    const { classId } = req.body;
    const gymClass = await Class.findById(classId);
    if (!gymClass) return res.status(404).json({ success: false, message: 'Class not found' });

    // Check capacity
    if (gymClass.enrolledMembers.length >= gymClass.capacity) {
      return res.status(400).json({ success: false, message: 'Class is full' });
    }

    // Check duplicate booking
    const exists = await Booking.findOne({ userId: req.user.id, classId });
    if (exists) return res.status(400).json({ success: false, message: 'Already booked this class' });

    const booking = await Booking.create({ userId: req.user.id, classId });

    // Add to enrolled members
    gymClass.enrolledMembers.push(req.user.id);
    await gymClass.save();

    await booking.populate('classId', 'name date time category');
    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// @desc  Cancel booking (member)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Remove from class enrolled list
    await Class.findByIdAndUpdate(booking.classId, {
      $pull: { enrolledMembers: req.user.id },
    });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get my bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('classId', 'name date time category duration trainerId location')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all bookings (admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('classId', 'name date time category')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};
