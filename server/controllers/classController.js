const Class = require('../models/Class');

exports.getClasses = async (req, res, next) => {
  try {
    const { category, trainerId, upcoming } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (trainerId) filter.trainerId = trainerId;
    if (upcoming === 'true') filter.date = { $gte: new Date() };

    const classes = await Class.find(filter)
      .populate('trainerId', 'name avatar')
      .sort('date');

    res.json({ success: true, classes });
  } catch (err) {
    next(err);
  }
};

exports.getClassById = async (req, res, next) => {
  try {
    const gymClass = await Class.findById(req.params.id)
      .populate('trainerId', 'name avatar')
      .populate('enrolledMembers', 'name avatar');
    if (!gymClass) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, class: gymClass });
  } catch (err) {
    next(err);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    const gymClass = await Class.create(req.body);
    await gymClass.populate('trainerId', 'name avatar');
    res.status(201).json({ success: true, class: gymClass });
  } catch (err) {
    next(err);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    const gymClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('trainerId', 'name avatar');
    if (!gymClass) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, class: gymClass });
  } catch (err) {
    next(err);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const gymClass = await Class.findByIdAndDelete(req.params.id);
    if (!gymClass) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, message: 'Class deleted' });
  } catch (err) {
    next(err);
  }
};

// Trainer: get their own classes
exports.getMyClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ trainerId: req.user.id }).sort('date');
    res.json({ success: true, classes });
  } catch (err) {
    next(err);
  }
};
