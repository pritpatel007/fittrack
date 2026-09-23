const User = require('../models/User');
const TrainerProfile = require('../models/TrainerProfile');

// @desc  Get all trainers with profiles
exports.getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await User.find({ role: 'trainer', isActive: true }).select('-password');
    const profiles = await TrainerProfile.find({
      userId: { $in: trainers.map((t) => t._id) },
    });

    const result = trainers.map((trainer) => {
      const profile = profiles.find((p) => p.userId.toString() === trainer._id.toString());
      return { ...trainer.toObject(), profile: profile || null };
    });

    res.json({ success: true, trainers: result });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single trainer profile
exports.getTrainerById = async (req, res, next) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: 'trainer' }).select('-password');
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    const profile = await TrainerProfile.findOne({ userId: trainer._id });
    res.json({ success: true, trainer: { ...trainer.toObject(), profile } });
  } catch (err) {
    next(err);
  }
};

// @desc  Create/update trainer profile (trainer or admin)
exports.upsertTrainerProfile = async (req, res, next) => {
  try {
    const { specialization, experience, bio, certifications } = req.body;
    const userId = req.user.role === 'admin' ? req.params.id : req.user.id;

    const updateData = { specialization, experience, bio, certifications };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const profile = await TrainerProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// @desc  Get trainer profile for logged-in trainer
exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await TrainerProfile.findOne({ userId: req.user.id });
    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};
