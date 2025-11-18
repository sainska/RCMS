import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaBuilding, FaChartBar, FaChartLine, FaTools, FaUsers, FaCog } from "react-icons/fa";
import { DashboardHero, StatsGrid, ActivityFeed, SummaryCard, MediaGallery } from "@/components/dashboard";
import { userDashboardConfig } from "@/utils/dashboardConfig";
import useRoleGuard from "@/hooks/useRoleGuard";
import "./Userdashboard.css";

const mainModules = [
  { name: "Dashboard", icon: <FaChartLine className="w-5 h-5 mr-3" />, route: "/dashboard" },
  { name: "Create Project", icon: <FaBuilding className="w-5 h-5 mr-3" />, route: "/create-project" },
  { name: "View Progress", icon: <FaChartBar className="w-5 h-5 mr-3" />, route: "/view-progress" },
  { name: "Manage Team", icon: <FaUsers className="w-5 h-5 mr-3" />, route: "/manage-team" },
  { name: "Project Schedule", icon: <FaChartLine className="w-5 h-5 mr-3" />, route: "/project-schedule" },
  { name: "Tools & Resources", icon: <FaTools className="w-5 h-5 mr-3" />, route: "/tools-resources" }
];
const analyticsModules = [
  { name: "Analytics", icon: <FaChartLine className="w-5 h-5 mr-3" />, route: "/analytics" },
  { name: "Settings", icon: <FaCog className="w-5 h-5 mr-3" />, route: "/settings" }
];


const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useRoleGuard({ roles: ["user"] });
  const displayName = user?.fullName || user?.name || "User";
  const { hero, stats, activities, summaries, media } = userDashboardConfig;

  const personalizedHero = {
    ...hero,
    description: `Welcome back, ${displayName}. ${hero.description}`,
  };

  return (
    <DashboardLayout
      title="RCMS"
      subtitle={userDashboardConfig.layout.subtitle}
      mainModules={mainModules}
      analytics={analyticsModules}
      onNavigate={(route) => navigate(route)}
    >
      <div className="space-y-10">
        <DashboardHero {...personalizedHero} onNavigate={(route) => navigate(route)} />
        <StatsGrid
          title="Performance Overview"
          stats={stats}
          ctaLabel="View analytics"
          onCtaClick={() => navigate("/analytics")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed title="Recent Activity" description="Live updates from your projects" items={activities} />
                    </div>
          <SummaryCard {...summaries[0]} />
              </div>
              
        <MediaGallery title="Recent Photo Documentation" description="Latest uploads across all sites" items={media} />
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
