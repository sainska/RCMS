import {
  FaChartBar,
  FaChartLine,
  FaTools,
  FaUsers,
  FaBuilding,
  FaFolderOpen,
  FaDollarSign,
  FaCheckCircle,
  FaCamera,
  FaBriefcase,
  FaTruck,
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaHandHoldingUsd,
} from "react-icons/fa";

export const userDashboardConfig = {
  layout: { subtitle: "User Dashboard" },
  hero: {
    eyebrow: "User workspace",
    title: "RCMS User Dashboard",
    description: "Monitor progress, coordinate teams, and keep every milestone on schedule with personalized insights.",
    highlightLabel: "Active Projects",
    highlightValue: "12",
    highlightHelper: "All systems optimal",
    actions: [
      { label: "View Projects", icon: FaChartBar, route: "/view-progress" },
      { label: "Create Project", icon: FaBuilding, route: "/create-project", variant: "default" },
    ],
  },
  stats: [
    { title: "Active Projects", value: 12, change: "+2", trend: "up", helper: "vs last week", icon: FaChartLine },
    { title: "Equipment Online", value: "89%", change: "+5%", trend: "up", helper: "fleet health", icon: FaTools },
    { title: "Personnel On Site", value: 247, change: "+12", trend: "up", helper: "all shifts", icon: FaUsers },
    { title: "Safety Alerts", value: 3, change: "-2", trend: "down", helper: "needs attention", icon: FaChartBar },
  ],
  activities: [
    { title: "Project Alpha milestone completed", meta: "Phase 2 structural work", timestamp: "2 hours ago", variant: "success" },
    { title: "Equipment maintenance scheduled", meta: "Crusher 4B", timestamp: "5 hours ago", variant: "warning" },
    { title: "New team member added", meta: "Site Gamma • Safety lead", timestamp: "1 day ago", variant: "info" },
  ],
  summaries: [
    {
      title: "Team Status",
      description: "Current workforce distribution",
      icon: FaUsers,
      metrics: [
        { label: "On Site", value: 247, accent: "success" },
        { label: "Remote", value: 18, accent: "info" },
        { label: "On Leave", value: 5, accent: "warning" },
      ],
      footer: { label: "Deployment rate", value: "91.5%" },
    },
  ],
  media: [
    { label: "Site Alpha — Concrete", timestamp: "2 hours ago", icon: FaCamera },
    { label: "Site Beta — Framework", timestamp: "5 hours ago", icon: FaCamera },
    { label: "Site Gamma — Electrical", timestamp: "1 day ago", icon: FaCamera },
    { label: "Site Delta — Plumbing", timestamp: "2 days ago", icon: FaCamera },
  ],
};

export const projectManagerDashboardConfig = {
  layout: { subtitle: "Project Manager" },
  hero: {
    eyebrow: "Project leadership",
    title: "RCMS Project Manager Dashboard",
    description: "Stay ahead of approvals, costs, and documentation with a single glance.",
    highlightLabel: "Open Projects",
    highlightValue: "8",
    highlightHelper: "3 approvals pending",
    actions: [
      { label: "View Projects", icon: FaFolderOpen, route: "/fetch-project" },
      { label: "Approve Milestones", icon: FaCheckCircle, route: "/approve-milestones", variant: "default" },
    ],
  },
  stats: [
    { title: "Open Projects", value: 8, change: "+1", trend: "up", helper: "vs last week", icon: FaFolderOpen },
    { title: "Pending Approvals", value: 3, change: "-1", trend: "down", helper: "awaiting sign-off", icon: FaCheckCircle },
    { title: "Photos Uploaded", value: 124, change: "+20", trend: "up", helper: "last 7 days", icon: FaCamera },
    { title: "Resources Assigned", value: 46, change: "+4", trend: "up", helper: "live crews", icon: FaTools },
  ],
  activities: [
    { title: "Foundation completed — Project Beta", meta: "Approved • QA passed", timestamp: "2 hours ago", variant: "success" },
    { title: "Frame inspection — Project Alpha", meta: "Pending approval", timestamp: "5 hours ago", variant: "warning" },
    { title: "Electrical rough-in — Project Gamma", meta: "Ready for review", timestamp: "1 day ago", variant: "info" },
  ],
  summaries: [
    {
      title: "Budget Utilization",
      description: "Current financial posture",
      icon: FaDollarSign,
      metrics: [
        { label: "Total Budget", value: "$2.5M", accent: "info" },
        { label: "Allocated", value: "$1.8M", accent: "warning" },
        { label: "Remaining", value: "$700K", accent: "success" },
      ],
      footer: { label: "Utilization", value: "72%" },
    },
  ],
  media: [
    { label: "Site A — Foundation", timestamp: "2 hours ago", icon: FaCamera },
    { label: "Site B — Frame", timestamp: "5 hours ago", icon: FaCamera },
    { label: "Site C — Electrical", timestamp: "1 day ago", icon: FaCamera },
    { label: "Site D — Plumbing", timestamp: "2 days ago", icon: FaCamera },
  ],
};

export const constructionDashboardConfig = {
  layout: { subtitle: "Construction Company" },
  hero: {
    eyebrow: "Operations overview",
    title: "RCMS Construction Company Dashboard",
    description: "Bid smarter, track deliveries, and manage crews across every site.",
    highlightLabel: "Open Bids",
    highlightValue: "5",
    highlightHelper: "2 expiring today",
    actions: [
      { label: "View Bids", icon: FaBriefcase, route: "/bid-projects" },
      { label: "Request Materials", icon: FaTools, route: "/request-materials", variant: "default" },
    ],
  },
  stats: [
    { title: "Open Bids", value: 5, change: "+1", trend: "up", helper: "today", icon: FaBriefcase },
    { title: "Materials Requested", value: 14, change: "+3", trend: "up", helper: "since yesterday", icon: FaTools },
    { title: "Deliveries Today", value: 7, change: "+2", trend: "up", helper: "on schedule", icon: FaTruck },
    { title: "Active Workforce", value: 132, change: "+8", trend: "up", helper: "multi-site", icon: FaUsers },
  ],
  activities: [
    { title: "Steel beams delivered — Site A", meta: "2.5 tons", timestamp: "2 hours ago", variant: "success" },
    { title: "Concrete mixer delayed", meta: "ETA: tomorrow", timestamp: "5 hours ago", variant: "warning" },
    { title: "Safety equipment shipped", meta: "50 units", timestamp: "1 day ago", variant: "info" },
  ],
  summaries: [
    {
      title: "Workforce Status",
      description: "Personnel allocation",
      icon: FaUsers,
      metrics: [
        { label: "On Site", value: 110, accent: "success" },
        { label: "In Transit", value: 22, accent: "warning" },
        { label: "Available", value: 45, accent: "info" },
      ],
      footer: { label: "Deployment rate", value: "62%" },
    },
  ],
};

export const bankDashboardConfig = {
  layout: { subtitle: "Bank Management" },
  hero: {
    eyebrow: "Financial control",
    title: "RCMS Bank Management Dashboard",
    description: "Track invoices, payments, and funding requests with real-time clarity.",
    highlightLabel: "Total Budget",
    highlightValue: "$2.4M",
    highlightHelper: "Across active projects",
    actions: [
      { label: "View Invoices", icon: FaFileInvoiceDollar, route: "/view-invoices" },
      { label: "Approve Payments", icon: FaMoneyCheckAlt, route: "/make-payments", variant: "default" },
    ],
  },
  stats: [
    { title: "Pending Invoices", value: 24, change: "+3", trend: "up", helper: "action needed", icon: FaFileInvoiceDollar },
    { title: "Payments Today", value: 6, change: "+1", trend: "up", helper: "processed", icon: FaMoneyCheckAlt },
    { title: "Funding Requests", value: 5, change: "0", trend: "down", helper: "awaiting review", icon: FaHandHoldingUsd },
    { title: "Transactions", value: 142, change: "+12", trend: "up", helper: "last 7 days", icon: FaChartLine },
  ],
  activities: [
    { title: "Payment received — Project Alpha", meta: "$45,000", timestamp: "2 hours ago", variant: "success" },
    { title: "Invoice #1234 pending approval", meta: "$12,500", timestamp: "5 hours ago", variant: "warning" },
    { title: "Funding request approved", meta: "$78,000", timestamp: "1 day ago", variant: "info" },
  ],
  summaries: [
    {
      title: "Budget Status",
      description: "Current allocation snapshot",
      icon: FaHandHoldingUsd,
      metrics: [
        { label: "Total Budget", value: "$1.2M", accent: "info" },
        { label: "Allocated", value: "$890K", accent: "warning" },
        { label: "Available", value: "$310K", accent: "success" },
      ],
      footer: { label: "Utilization", value: "74%" },
    },
  ],
};

export const dashboardConfigsByRole = {
  user: userDashboardConfig,
  project_manager: projectManagerDashboardConfig,
  construction_company: constructionDashboardConfig,
  bank: bankDashboardConfig,
};

