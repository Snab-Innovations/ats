import React from "react";
import { useAts } from "../context/AtsContext";
import {
  Briefcase,
  FileSpreadsheet,
  Users2,
  IndianRupee,
  ShieldCheck,
  Building,
  MapPin,
  ExternalLink,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ReceiptText,
  LogOut,
  Settings
} from "lucide-react";

export const AgencySidebar = ({ activeTab, setActiveTab, onOpenSubmitModal }) => {
  const {
    company,
    companies = [],
    jobs,
    candidates,
    agencies,
    selectedAgencyId,
    setSelectedAgencyId,
    activeAgency,
    setActiveRole,
    logout
  } = useAts();

  // Active syndicated jobs across client companies, excluding any blocked companies
  const syndicatedJobs = jobs.filter((j) => {
    if (!j.syndicateToAgencies || j.status !== "active") return false;
    const jobCompId = j.companyId || company.id;
    const isBlocked = (activeAgency?.blockedCompanyIds || []).includes(jobCompId);
    return !isBlocked;
  });

  // Agency submitted candidates
  const mySubmissions = candidates.filter(
    (c) => c.sourceType === "agency" || (activeAgency?.name && c.source?.includes(activeAgency.name.split(" ")[0]))
  );

  const agencyInitials = activeAgency?.name
    ? activeAgency.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AP";

  const contactInitials = activeAgency?.primaryContact
    ? activeAgency.primaryContact
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RC";

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="company-badge-row">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#ffffff",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              overflow: "hidden",
              flexShrink: 0
            }}
          >
            <img
              src={activeAgency?.logoUrl || activeAgency?.logo || "/logo-exhier.png"}
              alt={activeAgency?.name || "Agency Logo"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/logo-exhier.png";
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </div>

          <div className="company-info">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <h4>{activeAgency?.name || "Agency Partner"}</h4>
              <span title="Verified Placement Partner" style={{ color: "#7c3aed", display: "inline-flex" }}>
                <ShieldCheck size={14} />
              </span>
            </div>
            <span>
              <MapPin size={11} /> {activeAgency?.city || "India"} &bull; {activeAgency?.commissionRate || "8.5% CTC"}
            </span>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          className="btn btn-primary btn-sm"
          style={{
            width: "100%",
            marginTop: 12,
            justifyContent: "center",
            height: 36,
            fontWeight: 700,
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            border: "none",
            boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)"
          }}
          onClick={() => setActiveTab("bulk_upload")}
        >
          <FileSpreadsheet size={15} />
          <span>Fast-Track Bulk Import</span>
        </button>
      </div>

      {/* Navigation Links Grouped */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-heading">Talent Sourcing</div>

        <button
          className={`sidebar-nav-item ${activeTab === "mandates" ? "active" : ""}`}
          onClick={() => setActiveTab("mandates")}
        >
          <Briefcase size={17} />
          <span>Active Mandates & Bounties</span>
          <span className="sidebar-count-badge">
            {syndicatedJobs.length}
          </span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "bulk_upload" ? "active" : ""}`}
          onClick={() => setActiveTab("bulk_upload")}
        >
          <FileSpreadsheet size={17} />
          <span>Fast-Track Bulk Import</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "pipeline" ? "active" : ""}`}
          onClick={() => setActiveTab("pipeline")}
        >
          <Users2 size={17} />
          <span>Submitted Pipeline</span>
          <span className="sidebar-count-badge">
            {mySubmissions.length}
          </span>
        </button>

        <div className="sidebar-nav-heading" style={{ marginTop: 6 }}>
          Commercials & Intel
        </div>

        <button
          className={`sidebar-nav-item ${activeTab === "payouts" ? "active" : ""}`}
          onClick={() => setActiveTab("payouts")}
        >
          <IndianRupee size={17} />
          <span>Commission Wallet</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "duplicate_check" ? "active" : ""}`}
          onClick={() => setActiveTab("duplicate_check")}
        >
          <ShieldCheck size={17} />
          <span>Attribution & Dup Check</span>
        </button>

        <div className="sidebar-nav-heading" style={{ marginTop: 8 }}>
          Agency Management
        </div>

        <button
          className={`sidebar-nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={17} />
          <span>Agency Details & Settings</span>
        </button>
      </nav>

      {/* Recruiter / Account Manager Footer & Sign Out */}
      <div className="sidebar-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <div
            className="user-avatar-sm"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)" }}
          >
            {contactInitials}
          </div>
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <div
              style={{
                fontSize: "0.825rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {activeAgency?.primaryContact || "Placement Manager"}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#10b981"
                }}
              />
              <span>{activeAgency?.portalCode || "PARTNER"} &bull; Tier-1 Vendor</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="btn btn-ghost btn-sm"
          style={{
            padding: "5px 10px",
            height: 30,
            color: "#ef4444",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: "0.75rem",
            fontWeight: 700,
            flexShrink: 0,
            cursor: "pointer"
          }}
          title="Exit and Sign Out of Agency Portal"
        >
          <LogOut size={13} />
          <span>Exit</span>
        </button>
      </div>

      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          color: "var(--text-muted)",
          textAlign: "center",
          padding: "6px 12px 10px",
          letterSpacing: "0.02em"
        }}
      >
        Powered by <span style={{ color: "var(--primary)", fontWeight: 700 }}>ExpertHire ATS</span>
      </div>
    </aside>
  );
};
