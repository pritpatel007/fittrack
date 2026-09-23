const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
