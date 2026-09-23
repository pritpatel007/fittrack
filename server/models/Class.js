const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g. "09:00 AM"
  duration: { type: Number, required: true }, // minutes
  capacity: { type: Number, required: true, default: 20 },
  enrolledMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: {
    type: String,
    enum: ['Yoga', 'HIIT', 'Cardio', 'Zumba', 'Strength Training', 'Pilates', 'Boxing'],
    required: true,
  },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  location: { type: String, default: 'Main Hall' },
}, { timestamps: true });

classSchema.virtual('spotsLeft').get(function () {
  return this.capacity - this.enrolledMembers.length;
});

module.exports = mongoose.model('Class', classSchema);
