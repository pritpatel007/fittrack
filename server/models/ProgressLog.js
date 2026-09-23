const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true }, // kg
  height: { type: Number, required: true }, // cm
  bmi: { type: Number }, // auto-calculated
  bodyFat: { type: Number }, // percentage, optional
  chest: { type: Number }, // cm
  waist: { type: Number }, // cm
  hips: { type: Number }, // cm
  notes: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-calculate BMI before save
progressLogSchema.pre('save', function (next) {
  if (this.weight && this.height) {
    const heightInMeters = this.height / 100;
    this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  next();
});

module.exports = mongoose.model('ProgressLog', progressLogSchema);
