import React, { useState, useEffect } from "react";
import "./BudgetAllocation.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../AppContext';
import { FaDownload, FaUpload, FaCheckCircle, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import { API_BASE } from '../utils/api';

const BudgetAllocation = () => {
  const navigate = useNavigate();
  const { selectedProject } = useAppContext();
  const [ApprovedFile, setApprovedFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [userBudget, setUserBudget] = useState({
    foundation: 500000,
    framing: 300000,
    roofing: 400000,
    finishing: 800000,
    total: 2000000
  });
  const [contractorBudget, setContractorBudget] = useState({
    foundation: 550000,
    framing: 350000,
    roofing: 420000,
    finishing: 780000,
    total: 2100000
  });

  useEffect(() => {
    // Fetch projects from localStorage or API
    const fetchProjects = async () => {
      try {
        const localProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        if (localProjects.length > 0) {
          setProjects(localProjects);
          if (selectedProject && selectedProject.id) {
            setSelectedProjectId(selectedProject.id);
          } else if (localProjects[0]) {
            setSelectedProjectId(localProjects[0].id || localProjects[0]._id);
          }
        } else {
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
  }, [selectedProject]);

  const handleUpload = (e) => {
    setApprovedFile(e.target.files[0]);
    alert("📤 Approved budget uploaded successfully!");
  };

  const handleApproval = async () => {
    if (!selectedProjectId) {
      alert("⚠️ Please select a project first.");
      return;
    }

    try {
      // Store approved budget in localStorage for demo
      const approvedBudgets = JSON.parse(localStorage.getItem('approvedBudgets') || '[]');
      approvedBudgets.push({
        projectId: selectedProjectId,
        contractorBudget,
        approvedBy: 'Project Manager',
        approvedDate: new Date().toISOString(),
        file: ApprovedFile?.name
      });
      localStorage.setItem('approvedBudgets', JSON.stringify(approvedBudgets));
      
      alert("✅ Budget Approved and Sent to User!");
      
      // Update project status
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = projects.map(p => 
        p.id === selectedProjectId ? { ...p, budgetApproved: true, approvedBudget: contractorBudget } : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
    } catch (error) {
      console.error("Error approving budget:", error);
      alert("❌ Failed to approve budget. Please try again.");
    }
  };

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleContractorBudgetChange = (category, value) => {
    const updated = { ...contractorBudget, [category]: parseInt(value) || 0 };
    updated.total = updated.foundation + updated.framing + updated.roofing + updated.finishing;
    setContractorBudget(updated);
  };

  return (
    <div className="budget-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="budget-title">Budget Allocation Review</h2>

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
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project.id || project._id} value={project.id || project._id}>
              {project.projectName || project.title || 'Unnamed Project'}
            </option>
          ))}
        </select>
      </div>

      <div className="budget-sections">
        <div className="budget-card user">
          <h3>User Proposed Budget</h3>
          <ul>
            <li>Foundation: KES 500,000</li>
            <li>Framing: KES 300,000</li>
            <li>Roofing: KES 400,000</li>
            <li>Finishing: KES 800,000</li>
          </ul>
          <p>Total: <strong>KES 2,000,000</strong></p>
          <a href="/user-budget.pdf" download className="budget-btn">
            <FaDownload /> Download Proposal
          </a>
        </div>

        <div className="budget-card contractor">
          <h3>Contractor Proposed Budget (Editable)</h3>
          <div className="budget-inputs">
            <div className="budget-item">
              <label>Foundation:</label>
              <input 
                type="number" 
                value={contractorBudget.foundation} 
                onChange={(e) => handleContractorBudgetChange('foundation', e.target.value)}
                style={{ marginLeft: '0.5rem', width: '120px', padding: '0.25rem' }}
              />
              <span style={{ marginLeft: '0.5rem' }}>KES</span>
            </div>
            <div className="budget-item">
              <label>Framing:</label>
              <input 
                type="number" 
                value={contractorBudget.framing} 
                onChange={(e) => handleContractorBudgetChange('framing', e.target.value)}
                style={{ marginLeft: '0.5rem', width: '120px', padding: '0.25rem' }}
              />
              <span style={{ marginLeft: '0.5rem' }}>KES</span>
            </div>
            <div className="budget-item">
              <label>Roofing:</label>
              <input 
                type="number" 
                value={contractorBudget.roofing} 
                onChange={(e) => handleContractorBudgetChange('roofing', e.target.value)}
                style={{ marginLeft: '0.5rem', width: '120px', padding: '0.25rem' }}
              />
              <span style={{ marginLeft: '0.5rem' }}>KES</span>
            </div>
            <div className="budget-item">
              <label>Finishing:</label>
              <input 
                type="number" 
                value={contractorBudget.finishing} 
                onChange={(e) => handleContractorBudgetChange('finishing', e.target.value)}
                style={{ marginLeft: '0.5rem', width: '120px', padding: '0.25rem' }}
              />
              <span style={{ marginLeft: '0.5rem' }}>KES</span>
            </div>
          </div>
          <p>Total: <strong>KES {contractorBudget.total.toLocaleString()}</strong></p>

          <input type="file" className="upload-field" onChange={handleUpload} />
          <button className="budget-btn upload" onClick={handleApproval}>
            <FaCheckCircle /> Approve & Send to User
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocation;
