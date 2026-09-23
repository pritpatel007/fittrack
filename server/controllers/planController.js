const MembershipPlan = require('../models/MembershipPlan');

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort('price');
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
};

exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find().sort('price');
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
};

exports.createPlan = async (req, res, next) => {
  try {
    const { name, price, durationInDays, features, color } = req.body;
    const plan = await MembershipPlan.create({ name, price, durationInDays, features, color });
    res.status(201).json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, message: 'Plan deleted' });
  } catch (err) {
    next(err);
  }
};
