const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  project: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
