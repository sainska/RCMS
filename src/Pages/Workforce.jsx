import React, { useState } from "react";
import "./Workforce.css";
import { useNavigate } from "react-router-dom";

const Workforce = () => {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([
    {
      name: "Kevin Otieno",
      role: "Supervisor",
      status: "Active",
      contact: "0712345678",
      project: "Phase 1 - Bypass",
      lastActive: "Today",
    },
    {
      name: "Esther Wanjiku",
      role: "Plumber",
      status: "Inactive",
      contact: "0702345678",
      project: "Nairobi Waterline",
      lastActive: "3 days ago",
    },
  ]);

  const [newWorker, setNewWorker] = useState({
    name: "",
    role: "",
    status: "Active",
    contact: "",
    project: "",
    lastActive: "Just Added",
  });

  const handleAddWorker = () => {
    if (
      newWorker.name &&
      newWorker.role &&
      newWorker.contact &&
      newWorker.project
    ) {
      setWorkers([...workers, newWorker]);
      setNewWorker({
        name: "",
        role: "",
        status: "Active",
        contact: "",
        project: "",
        lastActive: "Just Added",
      });
    } else {
      alert("Please fill all fields to add a worker.");
    }
  };

  const dismissWorker = (index) => {
    const confirm = window.confirm("Are you sure you want to dismiss this worker?");
    if (confirm) {
      const updated = [...workers];
      updated.splice(index, 1);
      setWorkers(updated);
    }
  };

  return (
    <div className="workforce-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="workforce-title">Workforce Management</h2>

      <div className="add-worker-form">
        <input
          type="text"
          placeholder="Full Name"
          value={newWorker.name}
          onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role (e.g. Mason)"
          value={newWorker.role}
          onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={newWorker.contact}
          onChange={(e) => setNewWorker({ ...newWorker, contact: e.target.value })}
        />
        <input
          type="text"
          placeholder="Assigned Project"
          value={newWorker.project}
          onChange={(e) => setNewWorker({ ...newWorker, project: e.target.value })}
        />
        <select
          value={newWorker.status}
          onChange={(e) => setNewWorker({ ...newWorker, status: e.target.value })}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button onClick={handleAddWorker}>Add Worker</button>
      </div>

      <div className="workforce-grid">
        {workers.map((worker, index) => (
          <div key={index} className={`worker-card ${worker.status.toLowerCase()}`}>
            <h3>{worker.name}</h3>
            <p><strong>Role:</strong> {worker.role}</p>
            <p><strong>Contact:</strong> {worker.contact}</p>
            <p><strong>Project:</strong> {worker.project}</p>
            <p><strong>Last Active:</strong> {worker.lastActive}</p>
            <p className="status"><strong>Status:</strong> {worker.status}</p>
            <button className="dismiss-btn" onClick={() => dismissWorker(index)}>
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workforce;
