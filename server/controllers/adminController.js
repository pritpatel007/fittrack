const User = require('../models/User');
const Membership = require('../models/Membership');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');
const ProgressLog = require('../models/ProgressLog');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalMembers, totalTrainers,
      totalClasses, totalBookings, activeMemberships,
      recentUsers, recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'member' }),
      User.countDocuments({ role: 'trainer' }),
      Class.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Membership.countDocuments({ status: 'active', endDate: { $gte: new Date() } }),
      User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
      Booking.find().sort('-createdAt').limit(5)
        .populate('userId', 'name').populate('classId', 'name date'),
    ]);

    // Mock revenue (sum of active membership prices would require join)
    const membershipsWithPlan = await Membership.find({ paymentStatus: 'paid' })
      .populate('planId', 'price');
    const revenue = membershipsWithPlan.reduce((acc, m) => acc + (m.planId?.price || 0), 0);

    // Monthly signups for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]);

    // Attendance stats
    const totalAttendance = await Attendance.countDocuments();
    const presentAttendance = await Attendance.countDocuments({ status: 'present' });
    const attendanceRate = totalAttendance > 0
      ? Math.round((presentAttendance / totalAttendance) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalUsers, totalMembers, totalTrainers, totalClasses,
        totalBookings, activeMemberships, revenue,
        attendanceRate, totalAttendance,
      },
      recentUsers,
      recentBookings,
      monthlySignups,
    });
  } catch (err) {
    next(err);
  }
};
