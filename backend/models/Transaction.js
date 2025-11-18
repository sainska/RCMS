const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  project: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Pending' },
  date: { type: Date, required: true },
  // Payment provider details (optional)
  provider: { type: String, enum: ['mpesa', 'card', 'bank'], default: 'mpesa' },
  phoneNumber: { type: String },
  // M-Pesa metadata (optional)
  merchantRequestId: { type: String },
  checkoutRequestId: { type: String },
  receiptNumber: { type: String },
  resultCode: { type: String },
  resultDesc: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
