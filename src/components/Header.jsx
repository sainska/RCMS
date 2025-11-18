import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = ({ dashboardName, role }) => {
  return (
    <header className="dashboard-header">
      <div className="logo-section">
        <img src="/Logo.jpg" alt="RCMS Logo" className="rcms-logo" />
        <span className="rcms-title">RCMS</span>
      </div>
      <div className="header-center">
        <span className="dashboard-name">{dashboardName}</span>
      </div>
      <div className="header-right">
        <span className="role-badge">{role}</span>
        <FaUserCircle className="header-icon" title="Profile" />
        <FaSignOutAlt className="header-icon" title="Sign Out" />
      </div>
    </header>
  );
};

export default Header;
