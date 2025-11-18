const mongoose = require('mongoose');

const fundingRequestSchema = new mongoose.Schema({
  project: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FundingRequest', fundingRequestSchema);
