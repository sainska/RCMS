import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaBriefcase, FaTools, FaTruck, FaUsers, FaChartPie, FaCog } from "react-icons/fa";
import { DashboardHero, StatsGrid, ActivityFeed, SummaryCard } from "@/components/dashboard";
import { constructionDashboardConfig } from "@/utils/dashboardConfig";
import useRoleGuard from "@/hooks/useRoleGuard";
import "./Constructioncompany.css";

const mainModules = [
  { name: "Bid Projects", icon: <FaBriefcase className="w-5 h-5 mr-3" />, route: "/bid-projects" },
  { name: "Request Materials", icon: <FaTools className="w-5 h-5 mr-3" />, route: "/request-materials" },
  { name: "Track Deliveries", icon: <FaTruck className="w-5 h-5 mr-3" />, route: "/track-deliveries" },
  { name: "Workforce", icon: <FaUsers className="w-5 h-5 mr-3" />, route: "/workforce" }
];
const analyticsModules = [
  { name: "Analytics", icon: <FaChartPie className="w-5 h-5 mr-3" />, route: "/analytics" },
  { name: "Settings", icon: <FaCog className="w-5 h-5 mr-3" />, route: "/settings" }
];

const Constructioncompany = () => {
  const navigate = useNavigate();
  const { user } = useRoleGuard({ roles: ["construction_company"] });
  const displayName = user?.fullName || user?.name || "Contractor";
  const { hero, stats, activities, summaries } = constructionDashboardConfig;

  return (
    <DashboardLayout
      title="RCMS"
      subtitle={constructionDashboardConfig.layout.subtitle}
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
        <StatsGrid title="Operations Overview" stats={stats} ctaLabel="View details" onCtaClick={() => navigate("/analytics")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed
              title="Recent Deliveries"
              description="Latest material and equipment shipments"
              items={activities}
            />
          </div>
          <SummaryCard {...summaries[0]} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Constructioncompany;
