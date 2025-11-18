import React, { useState } from "react";
import { useAppContext } from '../AppContext';
import "./UploadPhotos.css";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaImages, FaBox, FaFileAlt } from "react-icons/fa";
import axios from "axios";
import { API_BASE } from '../utils/api';

const UploadPhotos = () => {
  const { user: _user, selectedProject: _selectedProject } = useAppContext();
  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const projectId = _selectedProject?._id || _selectedProject?.id || "";

  const handleFileChange = (e, category) => {
    setFiles({ ...files, [category]: e.target.files[0] });
    alert(`${category} file selected.`);
  };

  const handleUpload = async (category) => {
    if (!files[category]) {
      alert(`❌ No file selected for ${category}`);
      return;
    }

    const formData = new FormData();
    formData.append("photo", files[category]);
    formData.append("category", category);
    formData.append("projectId", projectId);

    try {
      if (!projectId) {
        alert("❌ Please select a project first (via Fetch Project).");
        return;
      }
      await axios.post(`${API_BASE}/api/photos/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`📤 ${category} uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`❌ Failed to upload ${category}`);
    }
  };

  return (
    <div className="upload-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="upload-title">Upload Project Files</h2>

      <div className="upload-grid">
        <div className="upload-card">
          <FaImages className="upload-icon" />
          <h3>Construction Progress</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "Progress")} />
          <button onClick={() => handleUpload("Progress")}>Upload</button>
        </div>

        <div className="upload-card">
          <FaBox className="upload-icon" />
          <h3>Materials Received</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "Materials")} />
          <button onClick={() => handleUpload("Materials")}>Upload</button>
        </div>

        <div className="upload-card">
          <FaFileAlt className="upload-icon" />
          <h3>Inspection Documents</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "Inspection")} />
          <button onClick={() => handleUpload("Inspection")}>Upload</button>
        </div>

        <div className="upload-card">
          <FaImages className="upload-icon" />
          <h3>Site Overview</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "Site Overview")} />
          <button onClick={() => handleUpload("Site Overview")}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotos;
