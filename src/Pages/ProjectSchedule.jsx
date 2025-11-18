import React from "react";
import "./ProjectSchedule.css";

const schedule = [
  { stage: "Site Clearing", date: "2025-07-01", status: "Completed", percentage: 100 },
  { stage: "Foundation Work", date: "2025-07-10", status: "In Progress", percentage: 70 },
  { stage: "Structural Framing", date: "2025-07-20", status: "Pending", percentage: 0 },
  { stage: "Roofing", date: "2025-07-30", status: "Pending", percentage: 0 },
  { stage: "Finishing", date: "2025-08-05", status: "Pending", percentage: 0 },
];

const ProjectSchedule = () => {
  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => window.history.back()}>&lt;</div>
      </header>

      <h2 className="schedule-title">Project Schedule</h2>

      <div className="schedule-grid">
        {schedule.map((item, index) => (
          <div key={index} className="schedule-card">
            <h3>{item.stage}</h3>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${item.percentage}%` }}>
                {item.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSchedule;
