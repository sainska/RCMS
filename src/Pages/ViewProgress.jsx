import React, { useEffect, useState } from "react";
import "./ViewProgress.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../AppContext';
import axios from "axios";
import { API_BASE } from '../utils/api';
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ViewProgress = () => {
  const navigate = useNavigate();
  const { selectedProject } = useAppContext();
  const [projectStages, setProjectStages] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    // Fetch projects from localStorage or API
    const fetchProjects = async () => {
      try {
        // Try to get from localStorage first (for demo)
        const localProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        if (localProjects.length > 0) {
          setProjects(localProjects);
          if (localProjects[0]) {
            setSelectedProjectId(localProjects[0].id || localProjects[0]._id);
          }
        } else {
          // Fallback to API
          const response = await axios.get(`${API_BASE}/api/projects`);
          setProjects(response.data);
          if (response.data[0]) {
            setSelectedProjectId(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!selectedProjectId) return;
      
      try {
        // For demo, create mock stages based on project
        const mockStages = [
          { _id: '1', name: 'Foundation', status: 'Completed', date: '2025-01-10', percentage: 100 },
          { _id: '2', name: 'Framing', status: 'In Progress', date: '2025-01-15', percentage: 75 },
          { _id: '3', name: 'Roofing', status: 'Pending', date: '2025-01-20', percentage: 0 },
          { _id: '4', name: 'Finishing', status: 'Pending', date: '2025-01-25', percentage: 0 },
        ];
        
        setProjectStages(mockStages);
        const completed = mockStages.filter(s => s.status === "Completed").length;
        setProgressPercentage(Math.round((completed / mockStages.length) * 100));
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };
    
    fetchProgress();
  }, [selectedProjectId]);

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleMarkComplete = async (stageId) => {
    try {
      setProjectStages(prev =>
        prev.map(stage => stage._id === stageId ? { ...stage, status: "Completed", percentage: 100 } : stage)
      );
      
      // Recalculate progress
      const updatedStages = projectStages.map(stage => 
        stage._id === stageId ? { ...stage, status: "Completed", percentage: 100 } : stage
      );
      const completed = updatedStages.filter(s => s.status === "Completed").length;
      setProgressPercentage(Math.round((completed / updatedStages.length) * 100));
      
      alert(`✅ Stage marked as complete!`);
    } catch (err) {
      console.error("Error updating stage:", err);
    }
  };

  const handleDeleteStage = async (stageId) => {
    try {
      setProjectStages(prev => prev.filter(stage => stage._id !== stageId));
      alert(`✅ Stage deleted successfully!`);
    } catch (err) {
      console.error("Error deleting stage:", err);
    }
  };

  const pieData = {
    labels: projectStages.map((stage) => stage.name),
    datasets: [
      {
        label: "Project Stages",
        data: projectStages.map(() => 25), // placeholder values
        backgroundColor: ["#006400", "#228B22", "#90EE90", "#2E8B57"],
      },
    ],
  };

  const barData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Progress (%)",
        data: [20, 40, 60, progressPercentage],
        backgroundColor: "#00a859",
      },
    ],
  };

  return (
    <div className="view-progress-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="title">Project Progress Overview</h2>

      {/* Project Selector */}
      <div className="project-selector" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <label style={{ marginRight: '1rem', fontWeight: '600' }}>Select Project:</label>
        <select 
          value={selectedProjectId} 
          onChange={(e) => handleProjectChange(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '8px',
            border: '2px solid #006400',
            fontSize: '1rem',
            minWidth: '200px'
          }}
        >
          {projects.map(project => (
            <option key={project.id || project._id} value={project.id || project._id}>
              {project.projectName || project.title || 'Unnamed Project'}
            </option>
          ))}
        </select>
      </div>

      <div className="progress-details">
        <p>🛠️ <strong>Progress:</strong> {progressPercentage}% Completed</p>
      </div>

      <div className="stage-boxes">
        {projectStages.map((stage, index) => (
          <div key={index} className={`stage-card ${stage.status.toLowerCase()}`}>
            <div className="stage-header">
              <h3>{stage.name}</h3>
              <span className="delete-button" onClick={() => handleDeleteStage(stage._id)}>✖</span>
            </div>
            <p>Status: <strong>{stage.status}</strong></p>
            <p>{stage.date}</p>
            {stage.status !== "Completed" && (
              <div className="stage-actions">
                <button onClick={() => handleMarkComplete(stage._id)}>✅ Mark as Complete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="charts">
        <div className="chart-box">
          <h4>Stage Breakdown</h4>
          <Pie data={pieData} />
        </div>
        <div className="chart-box">
          <h4>Weekly Progress</h4>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default ViewProgress;
