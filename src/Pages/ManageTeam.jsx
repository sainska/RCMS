import React from "react";
import "./ManageTeam.css";

const teamMembers = [
  { name: "James Mwangi", role: "Project Manager", contact: "0712345678", id: "PM001" },
  { name: "Lucy Wanjiku", role: "Structural Engineer", contact: "0723456789", id: "ENG002" },
  { name: "Peter Otieno", role: "Architect", contact: "0745678901", id: "ARC003" },
  { name: "Grace Nyambura", role: "Quantity Surveyor", contact: "0798765432", id: "QS004" },
  { name: "Kevin Njoroge", role: "Technician", contact: "0781234567", id: "TECH005" },
  { name: "Mercy Achieng", role: "Civil Engineer", contact: "0754321890", id: "CIV006" },
  { name: "Brian Kiptoo", role: "Foreman", contact: "0700112233", id: "FRM007" },
  { name: "Catherine Njeri", role: "Site Supervisor", contact: "0799112233", id: "SUP008" },
  { name: "Samuel Mutua", role: "Planner", contact: "0723001122", id: "PLN009" },
  { name: "Nancy Wambui", role: "Inspector", contact: "0744221100", id: "INS010" },
  // Add more as needed
];

const ManageTeam = () => {
  return (
    <div className="manage-team-container">
      <header className="team-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => window.history.back()}>&lt;</div>
      </header>

      <h2 className="team-title">Project Team Directory</h2>

      <div className="team-boxes">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <h3>{member.name}</h3>
            <p><strong>Role:</strong> {member.role}</p>
            <p><strong>Contact:</strong> {member.contact}</p>
            <p><strong>ID:</strong> {member.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTeam;
