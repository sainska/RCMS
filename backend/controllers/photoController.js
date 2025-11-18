const Photo = require("../models/photoModel");
const path = require('path');

const uploadPhoto = async (req, res) => {
  try {
    const { projectId, caption } = req.body;
    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    let imageUrl = req.body.imageUrl;
    if (req.file) {
      // Serve via /uploads static path
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl or photo file is required" });
    }

    const newPhoto = new Photo({ projectId, imageUrl, caption });
    await newPhoto.save();

    res.status(201).json({ message: "Photo uploaded successfully", photo: newPhoto });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ message: "Server error while uploading photo" });
  }
};

const getPhotosByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const photos = await Photo.find({ projectId });

    res.status(200).json(photos);
  } catch (err) {
    console.error("Fetch photo error:", err);
    res.status(500).json({ message: "Server error while fetching photos" });
  }
};

module.exports = { uploadPhoto, getPhotosByProject };
