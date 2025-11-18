import React from "react";
import { Routes, Route } from "react-router-dom";

// General Pages
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword"; // ✅ NEW

// Dashboards
import Userdashboard from "./Dashboards/Userdashboard";
import Projectmanager from "./Dashboards/Projectmanager";
import Constructioncompany from "./Dashboards/Constructioncompany";
import Bankmanagement from "./Dashboards/Bankmanagement";

// User Dashboard Modules
import CreateProject from "./Pages/CreateProject";
import ViewProgress from "./Pages/ViewProgress";
import ManageTeam from "./Pages/ManageTeam";
import ProjectSchedule from "./Pages/ProjectSchedule";
import ToolsResources from "./Pages/ToolsResources";
import CommunicationSettings from "./Pages/CommunicationSettings";
import Analytics from "./Pages/Analytics";

// Project Manager Modules
import FetchProject from "./Pages/FetchProject";
import BudgetAllocation from "./Pages/BudgetAllocation";
import UploadPhotos from "./Pages/UploadPhotos";
import ApproveMilestones from "./Pages/ApproveMilestones";
import ManageResources from "./Pages/ManageResources";

// Construction Company Modules
import BidProjects from "./Pages/BidProjects";
import RequestMaterials from "./Pages/RequestMaterials";
import TrackDeliveries from "./Pages/TrackDeliveries";
import Workforce from "./Pages/Workforce";

// Bank Management Modules
import MakePayments from "./Pages/MakePayments";
import ViewInvoices from "./Pages/ViewInvoices";
import FundingRequests from "./Pages/FundingRequests";
import TransactionHistory from "./Pages/TransactionHistory";

// Reports Module
import GenerateReports from "./Pages/GenerateReports";

const App = () => {
  return (
    <Routes>
      {/* General Pages */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ NEW */}

      {/* Dashboard Routes */}
      <Route path="/user-dashboard" element={<Userdashboard />} />
      <Route path="/project-manager" element={<Projectmanager />} />
      <Route path="/construction-company" element={<Constructioncompany />} />
  <Route path="/bank-management" element={<Bankmanagement />} />

      {/* User Dashboard Pages */}
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/view-progress" element={<ViewProgress />} />
      <Route path="/manage-team" element={<ManageTeam />} />
      <Route path="/project-schedule" element={<ProjectSchedule />} />
      <Route path="/tools-resources" element={<ToolsResources />} />
      <Route path="/settings" element={<CommunicationSettings />} />
      <Route path="/analytics" element={<Analytics />} />

      {/* Project Manager Pages */}
      <Route path="/fetch-project" element={<FetchProject />} />
      <Route path="/budget-allocation" element={<BudgetAllocation />} />
      <Route path="/upload-photos" element={<UploadPhotos />} />
      <Route path="/approve-milestones" element={<ApproveMilestones />} />
      <Route path="/manage-resources" element={<ManageResources />} />

      {/* Construction Company Pages */}
      <Route path="/bid-projects" element={<BidProjects />} />
      <Route path="/request-materials" element={<RequestMaterials />} />
      <Route path="/track-deliveries" element={<TrackDeliveries />} />
      <Route path="/workforce" element={<Workforce />} />

      {/* Bank Management Pages */}
      <Route path="/make-payments" element={<MakePayments />} />
      <Route path="/view-invoices" element={<ViewInvoices />} />
      <Route path="/funding-requests" element={<FundingRequests />} />
      <Route path="/transaction-history" element={<TransactionHistory />} />

      {/* Reports Page - Available to All Dashboards */}
      <Route path="/generate-reports" element={<GenerateReports />} />
    </Routes>
  );
};

export default App;
