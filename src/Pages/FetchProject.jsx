import React, { useEffect, useState } from "react";
import "./FetchProject.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../AppContext';
import { FaDownload, FaPaperPlane, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import axios from "axios";
import { API_BASE } from "../utils/api";

const FetchProject = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const { setSelectedProject } = useAppContext();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
  const res = await axios.get(`${API_BASE}/api/projects`);
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleViewDetails = (project) => {
    const details = `
Project Details:\n\nName: ${project.projectName || project.title || 'Unnamed Project'}\nStatus: ${project.status || 'Pending'}\nLocation: ${project.latitude && project.longitude ? `${project.latitude}, ${project.longitude}` : project.location || 'Not specified'}\nBudget: ${project.budget ? `Ksh ${project.budget.allocated?.toLocaleString() || project.budget.toLocaleString()}` : 'Not specified'}\nDescription: ${project.description || 'No description available'}\nCreated: ${new Date(project.createdAt || Date.now()).toLocaleDateString()}\nProject ID: ${project._id || project.id}\n    `;
    
    alert(details);
  };

  const sendToCompany = (project) => {
    setSelectedProject(project);
    alert(`✅ Project "${project.projectName || project.title || 'Unnamed Project'}" sent to Construction Company successfully!`);
    
    // Store the project in context for construction company to access
    const projectsForCompany = JSON.parse(localStorage.getItem('projectsForCompany') || '[]');
    projectsForCompany.push({ ...project, sentToCompany: true, sentDate: new Date().toISOString() });
    localStorage.setItem('projectsForCompany', JSON.stringify(projectsForCompany));
  };

  return (
    <div className="fetch-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="fetch-title">Fetched User Projects</h2>

      <div className="project-grid">
        {projects.length === 0 ? (
          <p style={{ color: "#fff", textAlign: "center" }}>No projects available.</p>
        ) : (
          projects.map((project) => (
            <div className="project-card" key={project._id}>
              <h3>{project.projectName}</h3>
              <p>
                <strong>Status:</strong>{" "}
                {project.status === "Completed" ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaHourglassHalf color="#FFD700" />
                )}{" "}
                {project.status || "Pending"}
              </p>
              <p><strong>Location:</strong> {project.location}</p>
              <p><strong>Budget:</strong> {project.budget || "N/A"}</p>
              <p><strong>Submitted:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>

              <button
                className="details-btn"
                onClick={() => handleViewDetails(project)}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FaDownload /> View Details
              </button>

              <button
                className="send-btn"
                onClick={() => sendToCompany(project)}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "0.8rem" }}
              >
                <FaPaperPlane /> Send to Construction Co.
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FetchProject;
