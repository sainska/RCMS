// backend/controllers/progress.controller.js
const Progress = require("../models/Progress.model");

// Get all progress stages for a project
exports.getProgressByProjectId = async (req, res) => {
  const { projectId } = req.params;
  try {
    const stages = await Progress.find({ projectId });
    res.status(200).json(stages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch progress stages", error });
  }
};

// Add a new stage
exports.addStage = async (req, res) => {
  const { projectId } = req.params;
  const { name, status, date } = req.body;
  try {
    const newStage = new Progress({ projectId, name, status, date });
    await newStage.save();
    res.status(201).json(newStage);
  } catch (error) {
    res.status(500).json({ message: "Failed to add stage", error });
  }
};

// Update an existing stage
exports.updateStage = async (req, res) => {
  const { projectId, stageId } = req.params;
  const updates = req.body;
  try {
    const updatedStage = await Progress.findOneAndUpdate(
      { _id: stageId, projectId },
      updates,
      { new: true }
    );
    res.status(200).json(updatedStage);
  } catch (error) {
    res.status(500).json({ message: "Failed to update stage", error });
  }
};

// Delete a stage
exports.deleteStage = async (req, res) => {
  const { projectId, stageId } = req.params;
  try {
    await Progress.findOneAndDelete({ _id: stageId, projectId });
    res.status(200).json({ message: "Stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete stage", error });
  }
};
