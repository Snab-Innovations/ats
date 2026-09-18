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
  Globe,
  Database,
  LogOut
} from "lucide-react";

export const SuperAdminSidebar = ({
  activeTab,
  setActiveTab,
  onOpenNewCompanyModal,
  onOpenNewAgencyModal,
  onOpenNewUserModal
}) => {
  const {
    companies,
    companyUsers,
    agencies,
    switchCompany,
    activeCompanyId,
    setActiveRole,
    isDbConnected,
    logout,
    currentUser
  } = useAts();

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="company-badge-row">
          <div
            style={{
              width: 44,
              height: 44,
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <img
              src="/logo-exhier.png"
              alt="ExpertHier"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "transparent",
                border: "none",
                boxShadow: "none",
                mixBlendMode: "multiply"
              }}
            />
          </div>

          <div className="company-info">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <h4>ExpertHire Engine</h4>
              <span title="Super Admin Verified" style={{ color: "#4f46e5", display: "inline-flex" }}>
                <ShieldCheck size={14} />
              </span>
            </div>
            <span>Platform Owner &bull; Multi-Tenant</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
          <button
            className="btn btn-primary btn-sm"
            style={{
              width: "100%",
              justifyContent: "center",
              height: 34,
              fontWeight: 700,
              background: "#4f46e5"
            }}
            onClick={onOpenNewCompanyModal}
          >
            <PlusCircle size={14} />
            <span>Create Company Tenant</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{
              width: "100%",
              justifyContent: "center",
              height: 30,
              fontWeight: 600,
              fontSize: "0.75rem"
            }}
            onClick={onOpenNewAgencyModal}
          >
            <UsersRound size={13} />
            <span>Register Agency</span>
          </button>
        </div>
      </div>

      {/* Navigation Links Grouped */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-heading">Platform Administration</div>

        <button
          className={`sidebar-nav-item ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Globe size={17} />
          <span>Platform Overview</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "companies" ? "active" : ""}`}
          onClick={() => setActiveTab("companies")}
        >
          <Building2 size={17} />
          <span>Employer ATS Tenants</span>
          <span className="sidebar-count-badge">{companies.length}</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "agencies" ? "active" : ""}`}
          onClick={() => setActiveTab("agencies")}
        >
          <UsersRound size={17} />
          <span>Placement Agencies</span>
          <span className="sidebar-count-badge">{agencies.length}</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={17} />
          <span>Company Team Logins</span>
          <span className="sidebar-count-badge">{companyUsers.length}</span>
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

        <div className="sidebar-nav-heading" style={{ marginTop: 6 }}>
          Cloud Infrastructure
        </div>

        <button
          className={`sidebar-nav-item ${activeTab === "database" ? "active" : ""}`}
          onClick={() => setActiveTab("database")}
        >
          <Database size={17} />
          <span>PostgreSQL & Storage</span>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              marginLeft: "auto",
              background: isDbConnected ? "#10b981" : "#f59e0b",
              boxShadow: isDbConnected ? "0 0 6px #10b981" : "none"
            }}
            title={isDbConnected ? "Connected to Supabase PostgreSQL" : "Local Storage Mode"}
          />
        </button>
      </nav>

      {/* Super Admin User Footer & Sign Out */}
      <div className="sidebar-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <div
            className="user-avatar-sm"
            style={{ background: "#4f46e5" }}
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
              title={currentUser?.name || "Platform Super Admin"}
            >
              {currentUser?.name || "Platform Super Admin"}
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
              title={currentUser?.email || currentUser?.id || "Master Root Controls"}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#10b981"
                }}
              />
              <span>{currentUser?.email || currentUser?.id || "Master Root Controls"}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="btn btn-ghost btn-sm"
          style={{
            padding: "5px 8px",
            height: 28,
            color: "var(--text-muted)",
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.7rem",
            flexShrink: 0
          }}
          title="Sign Out to Login Portal"
        >
          <LogOut size={13} />
          <span>Exit</span>
        </button>
      </div>
    </aside>
  );
};
