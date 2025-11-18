// models/MaterialRequest.js
const mongoose = require('mongoose');

const materialRequestSchema = new mongoose.Schema({
  materialName: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MaterialRequest', materialRequestSchema);
