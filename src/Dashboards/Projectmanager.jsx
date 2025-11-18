import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaFolderOpen, FaDollarSign, FaCamera, FaCheckCircle, FaTools, FaChartPie, FaCog } from "react-icons/fa";
import { DashboardHero, StatsGrid, ActivityFeed, SummaryCard, MediaGallery } from "@/components/dashboard";
import { projectManagerDashboardConfig } from "@/utils/dashboardConfig";
import useRoleGuard from "@/hooks/useRoleGuard";
import "./Projectmanager.css";

const mainModules = [
  { name: "Fetch Project", icon: <FaFolderOpen className="w-5 h-5 mr-3" />, route: "/fetch-project" },
  { name: "Budget Allocation", icon: <FaDollarSign className="w-5 h-5 mr-3" />, route: "/budget-allocation" },
  { name: "Upload Photos", icon: <FaCamera className="w-5 h-5 mr-3" />, route: "/upload-photos" },
  { name: "Approve Milestones", icon: <FaCheckCircle className="w-5 h-5 mr-3" />, route: "/approve-milestones" },
  { name: "Manage Resources", icon: <FaTools className="w-5 h-5 mr-3" />, route: "/manage-resources" }
];
const analyticsModules = [
  { name: "Analytics", icon: <FaChartPie className="w-5 h-5 mr-3" />, route: "/analytics" },
  { name: "Settings", icon: <FaCog className="w-5 h-5 mr-3" />, route: "/settings" }
];

const Projectmanager = () => {
  const navigate = useNavigate();
  const { user } = useRoleGuard({ roles: ["project_manager"] });
  const displayName = user?.fullName || user?.name || "Project Manager";
  const { hero, stats, activities, summaries, media } = projectManagerDashboardConfig;

  return (
    <DashboardLayout
      title="RCMS"
      subtitle={projectManagerDashboardConfig.layout.subtitle}
      mainModules={mainModules}
      analytics={analyticsModules}
      onNavigate={(route) => navigate(route)}
    >
      <div className="space-y-10">
        <DashboardHero
          {...hero}
          description={`Welcome back, ${displayName}. ${hero.description}`}
          onNavigate={(route) => navigate(route)}
        />
        <StatsGrid title="Project Overview" stats={stats} ctaLabel="View details" onCtaClick={() => navigate("/analytics")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed
              title="Recent Milestones"
              description="Latest project achievements and pending approvals"
              items={activities}
            />
          </div>
          <SummaryCard {...summaries[0]} />
        </div>

        <MediaGallery title="Recent Photo Documentation" description="Latest site photos and documentation" items={media} />
      </div>
    </DashboardLayout>
  );
};

export default Projectmanager;


