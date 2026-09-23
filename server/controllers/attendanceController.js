const Attendance = require('../models/Attendance');

// @desc  Mark attendance (admin or trainer)
exports.markAttendance = async (req, res, next) => {
  try {
    const { userId, classId, date, status, notes } = req.body;
    const record = await Attendance.create({
      userId, classId, date: date || new Date(), status: status || 'present',
      markedBy: req.user.id, notes,
    });
    await record.populate('userId', 'name email');
    res.status(201).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

// @desc  Get my attendance
exports.getMyAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ userId: req.user.id })
      .populate('classId', 'name category date')
      .sort('-date');

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({ success: true, records, stats: { total, present, percentage } });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all attendance records (admin)
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { userId, classId, date } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (classId) filter.classId = classId;
    if (date) {
      const d = new Date(date);
      filter.date = { $gte: d, $lt: new Date(d.getTime() + 86400000) };
    }

    const records = await Attendance.find(filter)
      .populate('userId', 'name email')
      .populate('classId', 'name category')
      .sort('-date');

    res.json({ success: true, records });
  } catch (err) {
    next(err);
  }
};

// @desc  Get attendance for trainer's class members
exports.getClassAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ classId: req.params.classId })
      .populate('userId', 'name email')
      .sort('-date');
    res.json({ success: true, records });
  } catch (err) {
    next(err);
  }
};
