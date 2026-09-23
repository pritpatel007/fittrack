const User = require('../models/User');
const Membership = require('../models/Membership');

// @desc  Get all users (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), users });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single user
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc  Update own profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, age, gender, fitnessGoal } = req.body;
    const updateData = { name, phone, age, gender, fitnessGoal };
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true, runValidators: true,
    }).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc  Update user role/status (admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete user (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get members (trainer/admin)
exports.getMembers = async (req, res, next) => {
  try {
    const members = await User.find({ role: 'member' }).select('-password').sort('-createdAt');
    res.json({ success: true, members });
  } catch (err) {
    next(err);
  }
};
