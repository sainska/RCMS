import React, { useState, useEffect } from "react";
import "./ApproveMilestones.css";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaInfoCircle, FaUserCheck } from "react-icons/fa";
import { useAppContext } from '../AppContext';

const ApproveMilestones = () => {
  const navigate = useNavigate();
  const { selectedProject } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [milestones, setMilestones] = useState([]);

  const defaultMilestones = [
    { id: 1, title: "Foundation Completed", status: "Awaiting Approval", project: "" },
    { id: 2, title: "Walls Constructed", status: "In Progress", project: "" },
    { id: 3, title: "Roof Installed", status: "Completed", project: "" },
    { id: 4, title: "Finishing Touches", status: "In Progress", project: "" },
  ];

  useEffect(() => {
    // Fetch projects from localStorage or API
    const fetchProjects = async () => {
      try {
        const localProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        if (localProjects.length > 0) {
          setProjects(localProjects.map(p => ({
            id: p.id || p._id,
            name: p.projectName || p.title || 'Unnamed Project'
          })));
          if (selectedProject && selectedProject.id) {
            setSelectedProjectId(selectedProject.id);
          } else if (localProjects[0]) {
            setSelectedProjectId(localProjects[0].id || localProjects[0]._id);
          }
        } else {
          // Fallback to mock data
          setProjects([
            { id: 'Project A', name: 'Project A' },
            { id: 'Project B', name: 'Project B' }
          ]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [selectedProject]);

  useEffect(() => {
    // Load milestones for selected project
    if (selectedProjectId) {
      const projectMilestones = JSON.parse(localStorage.getItem(`milestones_${selectedProjectId}`) || '[]');
      if (projectMilestones.length > 0) {
        setMilestones(projectMilestones);
      } else {
        // Use default milestones with project association
        const milestonesWithProject = defaultMilestones.map(m => ({
          ...m,
          project: selectedProjectId,
          id: `${selectedProjectId}_${m.id}`
        }));
        setMilestones(milestonesWithProject);
      }
    } else {
      setMilestones(defaultMilestones);
    }
  }, [selectedProjectId]);

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleUserClearance = (milestoneId) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    alert(`📨 User has been requested to confirm milestone "${milestone?.title}" satisfaction.`);
    
    // Update milestone status
    setMilestones(prev =>
      prev.map(milestone => milestone.id === milestoneId ? { ...milestone, userRequested: true } : milestone)
    );
  };

  const handleApprove = (milestoneId) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    alert(`✅ Milestone "${milestone?.title}" Approved. Proceed to payment.`);
    
    setMilestones((prev) =>
      prev.map((milestone) =>
        milestone.id === milestoneId ? { ...milestone, status: "Approved" } : milestone
      )
    );

    // Store approved milestone for payment processing
    const approvedMilestones = JSON.parse(localStorage.getItem('approvedMilestones') || '[]');
    approvedMilestones.push({
      ...milestone,
      approvedBy: 'Project Manager',
      approvedDate: new Date().toISOString(),
      projectId: selectedProjectId
    });
    localStorage.setItem('approvedMilestones', JSON.stringify(approvedMilestones));
  };

  const handleViewDetails = (milestone) => {
    const details = `
Milestone Details:\n\nTitle: ${milestone.title}\nStatus: ${milestone.status}\nProject: ${projects.find(p => p.id === milestone.project)?.name || 'Unknown'}\n${milestone.userRequested ? 'User clearance requested' : 'User clearance not requested'}\n${milestone.status === 'Approved' ? 'Approved for payment' : 'Awaiting approval'}\n    `;
    
    alert(details);
  };

  return (
    <div className="milestone-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="milestone-title">Approve Project Milestones</h2>

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
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="milestone-grid">
        {milestones.map((item) => (
          <div className="milestone-card" key={item.id}>
            <h3>{item.title}</h3>
            <p>Status: <span className={`status ${item.status.replace(" ", "").toLowerCase()}`}>{item.status}</span></p>
            <div className="milestone-actions">
              <button className="view-btn" onClick={() => handleViewDetails(item)}>
                <FaInfoCircle /> View Details
              </button>
              <button className="clearance-btn" onClick={() => handleUserClearance(item.id)}>
                <FaUserCheck /> Request Clearance
              </button>
              <button className="approve-btn" onClick={() => handleApprove(item.id)}>
                <FaCheckCircle /> Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveMilestones;
