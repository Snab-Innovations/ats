import React from "react";
import { useAts } from "../context/AtsContext";
import {
  Building2,
  Users,
  UsersRound,
  Palette,
  ShieldAlert,
  PlusCircle,
  ExternalLink,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Globe
} from "lucide-react";

export const SuperAdminSidebar = ({
  activeTab,
  setActiveTab,
  onOpenNewCompanyModal,
  onOpenNewUserModal
}) => {
  const {
    companies,
    companyUsers,
    agencies,
    switchCompany,
    activeCompanyId,
    setActiveRole
  } = useAts();

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="company-badge-row">
          <div
            className="company-logo-avatar"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
            }}
          >
            <ShieldAlert size={20} color="#fff" />
          </div>

          <div className="company-info">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <h4>ExpertHire Engine</h4>
              <span title="Super Admin Verified" style={{ color: "#db2777", display: "inline-flex" }}>
                <ShieldCheck size={14} />
              </span>
            </div>
            <span>Platform Owner &bull; Multi-Tenant</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          className="btn btn-primary btn-sm"
          style={{
            width: "100%",
            marginTop: 14,
            justifyContent: "center",
            height: 36,
            fontWeight: 700,
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
          }}
          onClick={onOpenNewCompanyModal}
        >
          <PlusCircle size={15} />
          <span>Provision New Company</span>
        </button>
      </div>

      {/* Navigation Links Grouped */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-heading">Platform Administration</div>

        <button
          className={`sidebar-nav-item ${activeTab === "companies" ? "active" : ""}`}
          onClick={() => setActiveTab("companies")}
        >
          <Building2 size={17} />
          <span>Employer ATS Tenants</span>
          <span className="sidebar-count-badge">{companies.length}</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={17} />
          <span>Company Team Logins</span>
          <span className="sidebar-count-badge">{companyUsers.length}</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "agencies" ? "active" : ""}`}
          onClick={() => setActiveTab("agencies")}
        >
          <UsersRound size={17} />
          <span>Placement Agencies</span>
          <span className="sidebar-count-badge">{agencies.length}</span>
        </button>

        <div className="sidebar-nav-heading" style={{ marginTop: 6 }}>
          Platform Customization
        </div>

        <button
          className={`sidebar-nav-item ${activeTab === "branding" ? "active" : ""}`}
          onClick={() => setActiveTab("branding")}
        >
          <Palette size={17} />
          <span>Cover Presets & Theme</span>
        </button>
      </nav>

      {/* Quick Jump to Active Tenant ATS */}
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
              color: "var(--primary)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>Target Employer Tenant</span>
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
            value={activeCompanyId}
            onChange={(e) => switchCompany(e.target.value)}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
              <ExternalLink size={13} color="var(--primary)" />
              <span>Login to Employer ATS</span>
            </span>
            <ArrowRight size={11} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {/* Super Admin User Footer */}
      <div className="sidebar-footer">
        <div
          className="user-avatar-sm"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)" }}
        >
          SA
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
            Platform Super Admin
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
            <span>Owner &bull; Master Controls</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
