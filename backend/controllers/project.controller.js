const Project = require("../models/Project.model");

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("submittedBy", "name email");
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProjects,
  // other functions like createProject, updateProject, etc.
};
