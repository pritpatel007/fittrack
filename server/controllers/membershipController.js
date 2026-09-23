const Membership = require('../models/Membership');
const MembershipPlan = require('../models/MembershipPlan');

// @desc  Get current user's active membership
exports.getMyMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({ userId: req.user.id, status: 'active' })
      .populate('planId')
      .sort('-createdAt');

    if (membership && new Date() > membership.endDate) {
      membership.status = 'expired';
      await membership.save();
    }

    res.json({ success: true, membership });
  } catch (err) {
    next(err);
  }
};

// @desc  Assign / purchase membership (admin or member)
exports.createMembership = async (req, res, next) => {
  try {
    const { userId, planId, paymentStatus } = req.body;
    const targetUserId = userId || req.user.id;

    const plan = await MembershipPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    // Cancel existing active membership
    await Membership.updateMany(
      { userId: targetUserId, status: 'active' },
      { status: 'cancelled' }
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const membership = await Membership.create({
      userId: targetUserId, planId, startDate, endDate,
      paymentStatus: paymentStatus || 'paid',
    });

    await membership.populate('planId');
    res.status(201).json({ success: true, membership });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all memberships (admin)
exports.getAllMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.find()
      .populate('userId', 'name email')
      .populate('planId', 'name price')
      .sort('-createdAt');
    res.json({ success: true, memberships });
  } catch (err) {
    next(err);
  }
};

// @desc  Update membership status (admin)
exports.updateMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'name email').populate('planId', 'name price');
    if (!membership) return res.status(404).json({ success: false, message: 'Membership not found' });
    res.json({ success: true, membership });
  } catch (err) {
    next(err);
  }
};
