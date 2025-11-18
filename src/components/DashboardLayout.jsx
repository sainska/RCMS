import React from "react";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import "@/components/dashboard/dashboard.css";

const DashboardLayout = ({ title, subtitle, mainModules = [], analytics = [], onNavigate, children }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar
        title={title}
        subtitle={subtitle}
        mainModules={mainModules}
        analytics={analytics}
        onNavigate={onNavigate}
      />
      <div className="dashboard-stage">
        <HeaderBar />
        <main className="dashboard-main">
          <div className="dashboard-content">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
