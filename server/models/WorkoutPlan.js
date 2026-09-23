const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. "Monday"
  exerciseName: { type: String, required: true },
  sets: { type: Number },
  reps: { type: Number },
  duration: { type: Number }, // minutes
  restTime: { type: Number }, // seconds
  notes: { type: String },
});

const workoutPlanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: String, required: true },
  schedule: [exerciseSchema],
  notes: { type: String },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
