import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">RCMS</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/user-dashboard">User</Link></li>
        <li><Link to="/project-manager">Project Manager</Link></li>
        <li><Link to="/construction-company">Construction Co.</Link></li>
        <li><Link to="/bank-management">Bank</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
