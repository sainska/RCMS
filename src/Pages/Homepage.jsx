import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, HardHat, Users } from "lucide-react";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <div className="message-box">
        <h1>Welcome to RCMS</h1>
        <p>
          Remote Construction Management System (RCMS) helps you manage construction
          projects, teams, schedules, and materials from anywhere in real-time.
        </p>
        <div className="features">
          <div className="feature"><HardHat /> Project Oversight</div>
          <div className="feature"><Users /> Team Coordination</div>
          <div className="feature"><ShieldCheck /> Secure Access</div>
        </div>
      </div>
      <div className="home-buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Homepage;
