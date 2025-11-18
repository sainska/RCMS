import React from "react";
import "./ViewAssignments.css";

const assignments = [
  { id: 1, task: "Foundation Digging", worker: "James Otieno", status: "In Progress" },
  { id: 2, task: "Brick Laying", worker: "Alice Wambui", status: "Pending" },
  { id: 3, task: "Electrical Wiring", worker: "Kevin Mwangi", status: "Completed" },
];

const ViewAssignments = () => {
  return (
    <div className="view-assignments-container">
      <h2>Team Assignments</h2>
      <div className="assignments-list">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <h4>{assignment.task}</h4>
            <p><strong>Assigned to:</strong> {assignment.worker}</p>
            <p><strong>Status:</strong> <span className={`status ${assignment.status.toLowerCase()}`}>{assignment.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAssignments;
