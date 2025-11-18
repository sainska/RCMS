const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  amount: Number,
  proposal: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);
