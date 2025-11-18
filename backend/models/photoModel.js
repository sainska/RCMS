const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Photo", photoSchema);
