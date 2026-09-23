const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled', 'pending'], default: 'active' },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
}, { timestamps: true });

// Auto-derive status based on endDate
membershipSchema.methods.checkExpiry = function () {
  if (new Date() > this.endDate) this.status = 'expired';
  return this;
};

module.exports = mongoose.model('Membership', membershipSchema);
