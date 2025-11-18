import React from "react";
import "./ReviewTeam.css";

const mockTeam = [
  {
    name: "David Otieno",
    role: "Site Engineer",
    status: "Active",
    performance: "Excellent",
  },
  {
    name: "Faith Achieng",
    role: "Architect",
    status: "On Leave",
    performance: "Good",
  },
  {
    name: "John Mwangi",
    role: "Plumber",
    status: "Active",
    performance: "Average",
  },
];

const ReviewTeam = () => {
  return (
    <div className="review-team-container">
      <h2>Review Team</h2>
      <p className="description">
        View team performance, roles, and activity status.
      </p>

      <div className="team-table">
        <div className="table-header">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
          <span>Performance</span>
        </div>
        {mockTeam.map((member, index) => (
          <div key={index} className="table-row">
            <span>{member.name}</span>
            <span>{member.role}</span>
            <span
              className={`status ${
                member.status === "Active" ? "active" : "inactive"
              }`}
            >
              {member.status}
            </span>
            <span className={`performance ${member.performance.toLowerCase()}`}>
              {member.performance}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTeam;
