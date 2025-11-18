import React, { useState } from "react";
import "./ManageResources.css";
import { useNavigate } from "react-router-dom";
import { FaTools, FaUserFriends, FaChartBar, FaClipboardList } from "react-icons/fa";

const ManageResources = () => {
  const navigate = useNavigate();
  const [equipment] = useState([
    { id: 1, name: "Excavator", status: "Available", location: "Site A", condition: "Good" },
    { id: 2, name: "Concrete Mixer", status: "In Use", location: "Site B", condition: "Good" },
    { id: 3, name: "Scaffolding Set", status: "Available", location: "Warehouse", condition: "Fair" },
    { id: 4, name: "Power Tools Kit", status: "In Use", location: "Site C", condition: "Excellent" },
  ]);

  const [allocations] = useState([
    { id: 1, resource: "Excavator", project: "Site A Foundation", assignedTo: "John Doe", date: "2025-01-15" },
    { id: 2, resource: "Concrete Mixer", project: "Site B Walls", assignedTo: "Jane Smith", date: "2025-01-14" },
  ]);

  const [requests] = useState([
    { id: 1, item: "Additional Scaffolding", project: "Site C Roofing", requestBy: "Mike Johnson", priority: "High", status: "Pending" },
    { id: 2, item: "Safety Equipment", project: "Site A Finishing", requestBy: "Sarah Wilson", priority: "Medium", status: "Approved" },
  ]);

  const handleViewEquipment = () => {
    const equipmentList = equipment.map(eq => 
      `${eq.name} - ${eq.status} - ${eq.location} (${eq.condition})`
    ).join('\n');
    
    alert(`Available Equipment:\n\n${equipmentList}`);
  };

  const handleAllocateResources = () => {
    const allocationList = allocations.map(alloc => 
      `${alloc.resource} → ${alloc.project} (${alloc.assignedTo})`
    ).join('\n');
    
    alert(`Current Resource Allocations:\n\n${allocationList}`);
  };

  const handleViewUsage = () => {
    const inUseCount = equipment.filter(eq => eq.status === "In Use").length;
    const availableCount = equipment.filter(eq => eq.status === "Available").length;
    const totalValue = "Ksh 2,500,000"; // Sample value
    
    alert(`Resource Usage Analytics:\n\n• Equipment in Use: ${inUseCount}\n• Equipment Available: ${availableCount}\n• Total Equipment Value: ${totalValue}\n• Utilization Rate: ${Math.round((inUseCount / equipment.length) * 100)}%`);
  };

  const handleViewRequests = () => {
    const requestList = requests.map(req => 
      `${req.item} for ${req.project} - ${req.priority} Priority - ${req.status}`
    ).join('\n');
    
    alert(`Pending Resource Requests:\n\n${requestList}`);
  };

  return (
    <div className="resources-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="resources-title">Manage Resources</h2>

      <div className="resources-grid">
        <div className="resource-card">
          <FaTools className="resource-icon" />
          <h3>Available Equipment</h3>
          <p>View all equipment currently in stock and usable on sites.</p>
          <button className="resource-btn" onClick={handleViewEquipment}>View Equipment</button>
        </div>

        <div className="resource-card">
          <FaUserFriends className="resource-icon" />
          <h3>Allocate Resources</h3>
          <p>Assign labor or tools to active projects based on site needs.</p>
          <button className="resource-btn" onClick={handleAllocateResources}>Allocate Now</button>
        </div>

        <div className="resource-card">
          <FaChartBar className="resource-icon" />
          <h3>Usage Analytics</h3>
          <p>Monitor how resources are utilized over time.</p>
          <button className="resource-btn" onClick={handleViewUsage}>View Usage</button>
        </div>

        <div className="resource-card">
          <FaClipboardList className="resource-icon" />
          <h3>Requests</h3>
          <p>Review incoming requests for new materials or manpower.</p>
          <button className="resource-btn" onClick={handleViewRequests}>View Requests</button>
        </div>
      </div>
    </div>
  );
};

export default ManageResources;
