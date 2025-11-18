import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaFileInvoiceDollar, FaMoneyCheckAlt, FaHandHoldingUsd, FaHistory, FaChartPie, FaCog } from "react-icons/fa";
import { DashboardHero, StatsGrid, ActivityFeed, SummaryCard } from "@/components/dashboard";
import { bankDashboardConfig } from "@/utils/dashboardConfig";
import useRoleGuard from "@/hooks/useRoleGuard";
import "./Bankmanagement.css";

const mainModules = [
  { name: "View Invoices", icon: <FaFileInvoiceDollar className="w-5 h-5 mr-3" />, route: "/view-invoices" },
  { name: "Make Payments", icon: <FaMoneyCheckAlt className="w-5 h-5 mr-3" />, route: "/make-payments" },
  { name: "Funding Requests", icon: <FaHandHoldingUsd className="w-5 h-5 mr-3" />, route: "/funding-requests" },
  { name: "Transaction History", icon: <FaHistory className="w-5 h-5 mr-3" />, route: "/transaction-history" }
];
const analyticsModules = [
  { name: "Analytics", icon: <FaChartPie className="w-5 h-5 mr-3" />, route: "/analytics" },
  { name: "Settings", icon: <FaCog className="w-5 h-5 mr-3" />, route: "/settings" }
];

const Bankmanagement = () => {
  const navigate = useNavigate();
  const { user } = useRoleGuard({ roles: ["bank"] });
  const displayName = user?.fullName || user?.name || "Bank Manager";
  const { hero, stats, activities, summaries } = bankDashboardConfig;

  return (
    <DashboardLayout
      title="RCMS"
      subtitle={bankDashboardConfig.layout.subtitle}
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
        <StatsGrid title="Financial Overview" stats={stats} ctaLabel="View details" onCtaClick={() => navigate("/analytics")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed
              title="Recent Transactions"
              description="Latest financial activities"
              items={activities}
            />
          </div>
          <SummaryCard {...summaries[0]} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Bankmanagement;
