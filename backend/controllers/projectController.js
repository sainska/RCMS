const Project = require("../models/Project.model");

// Create New Project (aligned with frontend CreateProject.jsx payload)
// Frontend sends: { title, description, latitude, longitude }
// This maps to Project.model schema: { projectName, location, description, submittedBy? }
exports.createProject = async (req, res) => {
  try {
    const { title, description, latitude, longitude, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    // Build a human-readable location string if lat/lng provided
    const locationString = location || (
      latitude && longitude ? `Lat: ${latitude}, Lng: ${longitude}` : "Unknown"
    );

    const newProject = new Project({
      projectName: title,
      description,
      location: locationString,
      // submittedBy is optional for now; can be set from auth middleware later
    });

    await newProject.save();
    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    res.status(500).json({ message: "Project creation failed", error: error.message });
  }
};

// Get Projects by User ID
exports.getProjectsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const projects = await Project.find({ userId });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};
