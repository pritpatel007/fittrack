const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationInDays: { type: Number, required: true },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#6366f1' }, // for UI theming
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
