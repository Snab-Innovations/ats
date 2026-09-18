import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAts } from "./context/AtsContext";
import { LoginPage } from "./components/LoginPage";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminDashboard } from "./components/AdminDashboard";
import { JobsManager } from "./components/JobsManager";
import { CandidatePipeline } from "./components/CandidatePipeline";
import { InterviewScheduler } from "./components/InterviewScheduler";
import { CareerPageBuilder } from "./components/CareerPageBuilder";
import { AgencyManager } from "./components/AgencyManager";
import { SettingsManager } from "./components/SettingsManager";
import { JobEditorModal } from "./components/JobEditorModal";
import { CandidateDetailModal } from "./components/CandidateDetailModal";
import { StageTransitionModal } from "./components/StageTransitionModal";
import { AgencyPortal } from "./components/AgencyPortal";
import { PublicCareerPage } from "./components/PublicCareerPage";
import { IframeSimulator } from "./components/IframeSimulator";
import { SuperAdminPortal } from "./components/SuperAdminPortal";
import { ExpertHirePlatform } from "./components/ExpertHirePlatform";
import { LandingPage } from "./components/LandingPage";

// Route protection wrapper for production ATS
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAts();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === "super_admin") return <Navigate to="/super-admin" replace />;
    if (currentUser.role === "agency_portal") return <Navigate to="/agency-portal" replace />;
    return <Navigate to="/employer-dashboard" replace />;
  }

  return children;
};

// Dynamic Root Redirect based on active session
const RootRedirect = () => {
  const { currentUser } = useAts();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === "super_admin") return <Navigate to="/super-admin" replace />;
  if (currentUser.role === "agency_portal") return <Navigate to="/agency-portal" replace />;
  return <Navigate to="/employer-dashboard" replace />;
};

// Employer ATS Page Component with URL Subtabs
const EmployerATSPage = () => {
  const { tab } = useParams();
  const { adminTab } = useAts();

  // Normalize subtab
  const resolvedTab = tab
    ? tab === "career-builder" ? "career_builder" : tab
    : adminTab || "dashboard";

  return (
    <div className="admin-shell">
      <AdminSidebar />
      {resolvedTab === "dashboard" && <AdminDashboard />}
      {resolvedTab === "jobs" && <JobsManager />}
      {resolvedTab === "pipeline" && <CandidatePipeline />}
      {resolvedTab === "interviews" && <InterviewScheduler />}
      {resolvedTab === "career_builder" && <CareerPageBuilder />}
      {resolvedTab === "agencies" && <AgencyManager />}
      {resolvedTab === "settings" && <SettingsManager />}
    </div>
  );
};

export default function App() {
  return (
    <div className="app-container">
      {/* Real multi-page routes for production ATS software - DemoSwitcherBar removed */}
      <Routes>
        {/* Unified Enterprise Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        {/* Dynamic Product Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* 1. Employer ATS Workspace */}
        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["company_admin", "super_admin"]}>
              <EmployerATSPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer-dashboard/:tab"
          element={
            <ProtectedRoute allowedRoles={["company_admin", "super_admin"]}>
              <EmployerATSPage />
            </ProtectedRoute>
          }
        />
        <Route path="/employer-ats" element={<Navigate to="/employer-dashboard" replace />} />
        <Route path="/employer-ats/:tab" element={<EmployerATSPage />} />
        <Route path="/ats" element={<Navigate to="/employer-dashboard" replace />} />
        <Route path="/ats/:tab" element={<EmployerATSPage />} />

        {/* 2. Super Admin Multi-Tenant Engine */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/:tab"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminPortal />
            </ProtectedRoute>
          }
        />
        <Route path="/superadmin" element={<Navigate to="/super-admin" replace />} />
        <Route
          path="/superadmin/:tab"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminPortal />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/super-admin" replace />} />
        <Route
          path="/admin/:tab"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminPortal />
            </ProtectedRoute>
          }
        />

        {/* 3. Agency Portal */}
        <Route
          path="/agency-portal"
          element={
            <ProtectedRoute allowedRoles={["agency_portal", "super_admin"]}>
              <AgencyPortal />
            </ProtectedRoute>
          }
        />
        <Route path="/agency" element={<Navigate to="/agency-portal" replace />} />
        <Route path="/agency-dashboard" element={<Navigate to="/agency-portal" replace />} />

        {/* 4. Candidate Public Career Site & Unified Placement Platform */}
        <Route path="/career-site" element={<ExpertHirePlatform />} />
        <Route path="/career-site/:companySlug" element={<PublicCareerPage isEmbedded={false} />} />
        <Route path="/careers" element={<ExpertHirePlatform />} />
        <Route path="/careers/:companySlug" element={<PublicCareerPage isEmbedded={false} />} />
        <Route path="/career-page" element={<Navigate to="/career-site" replace />} />
        <Route path="/:companySlug-careers" element={<PublicCareerPage isEmbedded={false} />} />

        {/* 5. ExpertHire Direct Candidate Unified Platform */}
        <Route path="/experthire-platform" element={<ExpertHirePlatform />} />
        <Route path="/experthire" element={<Navigate to="/experthire-platform" replace />} />
        <Route path="/jobs" element={<ExpertHirePlatform />} />

        {/* 6. Embedded Website Iframe Simulator */}
        <Route path="/iframe-simulator" element={<IframeSimulator />} />
        <Route path="/iframe" element={<Navigate to="/iframe-simulator" replace />} />
        <Route path="/embed" element={<Navigate to="/iframe-simulator" replace />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>

      {/* Global Modals for ATS */}
      <JobEditorModal />
      <CandidateDetailModal />
      <StageTransitionModal />
    </div>
  );
}
