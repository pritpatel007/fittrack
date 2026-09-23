const WorkoutPlan = require('../models/WorkoutPlan');

// @desc  Create workout plan (trainer/admin)
exports.createWorkoutPlan = async (req, res, next) => {
  try {
    const { memberId, goal, schedule, notes, endDate } = req.body;
    const plan = await WorkoutPlan.create({
      memberId, trainerId: req.user.id, goal, schedule, notes, endDate,
    });
    await plan.populate('memberId', 'name email');
    await plan.populate('trainerId', 'name');
    res.status(201).json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};

// @desc  Update workout plan (trainer/admin)
exports.updateWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('memberId', 'name email')
      .populate('trainerId', 'name');
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};

// @desc  Get workout plan for a specific member
exports.getMemberWorkoutPlan = async (req, res, next) => {
  try {
    const memberId = req.params.memberId || req.user.id;
    const plan = await WorkoutPlan.findOne({ memberId, isActive: true })
      .populate('trainerId', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all workout plans assigned by trainer
exports.getMyAssignedPlans = async (req, res, next) => {
  try {
    const plans = await WorkoutPlan.find({ trainerId: req.user.id })
      .populate('memberId', 'name email avatar')
      .sort('-createdAt');
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
};

// @desc  Get my own plan (member)
exports.getMyWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({ memberId: req.user.id, isActive: true })
      .populate('trainerId', 'name avatar');
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};
