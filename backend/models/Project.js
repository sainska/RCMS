const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  coordinates: {
    latitude: String,
    longitude: String,
  },
  budget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
