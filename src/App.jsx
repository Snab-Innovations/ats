import React from "react";
import { AtsProvider, useAts } from "./context/AtsContext";
import { DemoSwitcherBar } from "./components/DemoSwitcherBar";
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
import { AgencyPortal } from "./components/AgencyPortal";
import { PublicCareerPage } from "./components/PublicCareerPage";
import { IframeSimulator } from "./components/IframeSimulator";
import { SuperAdminPortal } from "./components/SuperAdminPortal";
import { ExpertHirePlatform } from "./components/ExpertHirePlatform";

const MainContent = () => {
  const { activeRole, adminTab } = useAts();

  // Render Role-based View
  if (activeRole === "super_admin") {
    return <SuperAdminPortal />;
  }

  if (activeRole === "agency_portal") {
    return <AgencyPortal />;
  }

  if (activeRole === "public_careers") {
    return <PublicCareerPage isEmbedded={false} />;
  }

  if (activeRole === "experthire_platform") {
    return <ExpertHirePlatform />;
  }

  if (activeRole === "iframe_simulator") {
    return <IframeSimulator />;
  }

  // Default: Company Admin ATS
  return (
    <div className="admin-shell">
      <AdminSidebar />
      {adminTab === "dashboard" && <AdminDashboard />}
      {adminTab === "jobs" && <JobsManager />}
      {adminTab === "pipeline" && <CandidatePipeline />}
      {adminTab === "interviews" && <InterviewScheduler />}
      {adminTab === "career_builder" && <CareerPageBuilder />}
      {adminTab === "agencies" && <AgencyManager />}
      {adminTab === "settings" && <SettingsManager />}
    </div>
  );
};

export default function App() {
  return (
    <AtsProvider>
      <div className="app-container">
        {/* Top bar with instant switcher for pitch / demo */}
        <DemoSwitcherBar />

        {/* Active Portal Content */}
        <MainContent />

        {/* Global Modals for Admin */}
        <JobEditorModal />
        <CandidateDetailModal />
      </div>
    </AtsProvider>
  );
}
