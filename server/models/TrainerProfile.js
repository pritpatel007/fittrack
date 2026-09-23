const mongoose = require('mongoose');

const trainerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: [{ type: String }],
  experience: { type: Number, default: 0 }, // years
  bio: { type: String },
  image: { type: String, default: '' },
  certifications: [{ type: String }],
  rating: { type: Number, default: 4.5 },
}, { timestamps: true });

module.exports = mongoose.model('TrainerProfile', trainerProfileSchema);
