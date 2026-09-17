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
  ReceiptText
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
    setActiveRole
  } = useAts();

  // Active syndicated jobs across ALL client companies
  const syndicatedJobs = jobs.filter(
    (j) => j.syndicateToAgencies && j.status === "active"
  );

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
            className="company-logo-avatar"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)"
            }}
          >
            {agencyInitials}
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
      </nav>

      {/* Agency Partner Switcher & Quick ATS Links */}
      <div style={{ padding: "0 12px 12px" }}>
        <div
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#7c3aed",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>Partner Firm Seat</span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px #10b981"
              }}
            />
          </div>

          <select
            className="form-select"
            style={{
              padding: "6px 8px",
              fontSize: "0.75rem",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              fontWeight: 600
            }}
            value={selectedAgencyId}
            onChange={(e) => setSelectedAgencyId(e.target.value)}
          >
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.city})
              </option>
            ))}
          </select>

          <button
            className="btn btn-ghost btn-sm"
            style={{
              justifyContent: "space-between",
              padding: "5px 8px",
              fontSize: "0.75rem",
              borderRadius: "var(--radius-sm)",
              marginTop: 4
            }}
            onClick={() => setActiveRole("company_admin")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Building size={13} color="var(--primary)" />
              <span>Switch to Employer ATS</span>
            </span>
            <ArrowRight size={11} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {/* Recruiter / Account Manager Footer */}
      <div className="sidebar-footer">
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
