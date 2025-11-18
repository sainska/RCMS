const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: String,
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "In Progress", "Completed"],
    default: "Pending",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
