const ProgressLog = require('../models/ProgressLog');

// @desc  Add progress log (member)
exports.addProgressLog = async (req, res, next) => {
  try {
    const { weight, height, bodyFat, chest, waist, hips, notes, date } = req.body;
    const log = await ProgressLog.create({
      userId: req.user.id, weight, height, bodyFat, chest, waist, hips, notes,
      date: date || new Date(),
    });
    res.status(201).json({ success: true, log });
  } catch (err) {
    next(err);
  }
};

// @desc  Get my progress logs with stats
exports.getMyProgress = async (req, res, next) => {
  try {
    const logs = await ProgressLog.find({ userId: req.user.id }).sort('date');

    let stats = null;
    if (logs.length >= 2) {
      const first = logs[0];
      const latest = logs[logs.length - 1];
      stats = {
        weightChange: parseFloat((latest.weight - first.weight).toFixed(1)),
        bmiChange: parseFloat((latest.bmi - first.bmi).toFixed(1)),
        latestWeight: latest.weight,
        latestBmi: latest.bmi,
        totalLogs: logs.length,
      };
    }

    res.json({ success: true, logs, stats });
  } catch (err) {
    next(err);
  }
};

// @desc  Get a member's progress (trainer/admin)
exports.getMemberProgress = async (req, res, next) => {
  try {
    const logs = await ProgressLog.find({ userId: req.params.userId }).sort('date');
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a progress log
exports.deleteProgressLog = async (req, res, next) => {
  try {
    const log = await ProgressLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    res.json({ success: true, message: 'Log deleted' });
  } catch (err) {
    next(err);
  }
};
