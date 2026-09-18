import React from "react";
import { useNavigate } from "react-router-dom";
import { useAts } from "../context/AtsContext";
import { getCompanySlug } from "../utils/companySlug";
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  CalendarDays,
  Palette,
  UsersRound,
  Settings,
  ExternalLink,
  PlusCircle,
  MapPin,
  ShieldCheck,
  Globe,
  MonitorPlay,
  Zap,
  LogOut
} from "lucide-react";

export const AdminSidebar = () => {
  const {
    adminTab,
    setAdminTab,
    company,
    jobs,
    candidates,
    interviews,
    agencies,
    companyUsers = [],
    setIsJobModalOpen,
    setEditingJob,
    setActiveRole,
    currentUser: sessionUser,
    logout
  } = useAts();

  const navigate = useNavigate();

  // Active jobs count strictly for this company
  const activeJobsCount = jobs.filter(
    (j) => (j.companyId ? j.companyId === company.id : true) && j.status === "active"
  ).length;

  const activeCandidatesCount = candidates.filter((c) => c.stage !== "rejected").length;
  const upcomingInterviewsCount = interviews.filter((i) => i.status === "Confirmed").length;

  // Find active company user for the footer
  const activeUser = sessionUser || companyUsers.find((u) => u.companyId === company.id) || companyUsers[0] || {
    name: "Vikram Singhania",
    role: "Company Admin",
    title: "VP Engineering"
  };

  const userInitials = activeUser.name
    ? activeUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="company-badge-row">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-md)",
                objectFit: "contain",
                background: "var(--bg-surface)",
                padding: 3,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                border: "1px solid var(--border-subtle)",
                flexShrink: 0
              }}
            />
          ) : (
            <div
              className="company-logo-avatar"
              style={{ background: company.logoBadgeColor || company.brandColor }}
            >
              {company.logoInitials || "TS"}
            </div>
          )}

          <div className="company-info">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <h4>{company.name}</h4>
              <span title="Verified ATS Tenant" style={{ color: "var(--primary)", display: "inline-flex" }}>
                <ShieldCheck size={14} />
              </span>
            </div>
            <span>
              <MapPin size={11} /> {company.headquarters?.split("&")[0] || "India HQ"}
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          style={{ width: "100%", marginTop: 14, justifyContent: "center", height: 36, fontWeight: 700 }}
          onClick={() => {
            setEditingJob(null);
            setIsJobModalOpen(true);
          }}
        >
          <PlusCircle size={15} />
          <span>Post New Requisition</span>
        </button>
      </div>

      {/* Navigation Links Grouped */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-heading">Talent Acquisition</div>

        <button
          className={`sidebar-nav-item ${adminTab === "dashboard" ? "active" : ""}`}
          onClick={() => setAdminTab("dashboard")}
        >
          <LayoutDashboard size={17} />
          <span>Dashboard & Analytics</span>
        </button>

        <button
          className={`sidebar-nav-item ${adminTab === "jobs" ? "active" : ""}`}
          onClick={() => setAdminTab("jobs")}
        >
          <Briefcase size={17} />
          <span>Requisitions & Bounties</span>
          <span className="sidebar-count-badge">{activeJobsCount}</span>
        </button>

        <button
          className={`sidebar-nav-item ${adminTab === "pipeline" ? "active" : ""}`}
          onClick={() => setAdminTab("pipeline")}
        >
          <Kanban size={17} />
          <span>ATS Kanban Pipeline</span>
          <span className="sidebar-count-badge">{activeCandidatesCount}</span>
        </button>

        <button
          className={`sidebar-nav-item ${adminTab === "interviews" ? "active" : ""}`}
          onClick={() => setAdminTab("interviews")}
        >
          <CalendarDays size={17} />
          <span>Technical Rounds</span>
          {upcomingInterviewsCount > 0 && (
            <span className="sidebar-count-badge">
              {upcomingInterviewsCount}
            </span>
          )}
        </button>

        <div className="sidebar-nav-heading" style={{ marginTop: 6 }}>
          Platform & Channels
        </div>

        <button
          className={`sidebar-nav-item ${adminTab === "career_builder" ? "active" : ""}`}
          onClick={() => setAdminTab("career_builder")}
        >
          <Palette size={17} />
          <span>Career Page & Iframe</span>
        </button>

        <button
          className={`sidebar-nav-item ${adminTab === "agencies" ? "active" : ""}`}
          onClick={() => setAdminTab("agencies")}
        >
          <UsersRound size={17} />
          <span>Recruitment Agencies</span>
          <span className="sidebar-count-badge">{agencies.length}</span>
        </button>

        <button
          className={`sidebar-nav-item ${adminTab === "settings" ? "active" : ""}`}
          onClick={() => setAdminTab("settings")}
        >
          <Settings size={17} />
          <span>Platform Settings</span>
        </button>
      </nav>

      {/* Quick live previews box */}
      <div style={{ padding: "0 12px 12px" }}>
        <div
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
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
            <span>Live Portals</span>
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

          <button
            className="btn btn-ghost btn-sm"
            style={{
              justifyContent: "space-between",
              padding: "5px 8px",
              fontSize: "0.775rem",
              borderRadius: "var(--radius-sm)"
            }}
            onClick={() => {
              setActiveRole("public_careers");
              navigate(`/career-site/${getCompanySlug(company)}`);
            }}
            title={`View ${company.name} Live Career Portal (/career-site/${getCompanySlug(company)})`}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Globe size={13} color="var(--primary)" />
              <span>{company.name ? `${company.name.split(" ")[0]} Career Site` : "Public Career Site"}</span>
            </span>
            <ExternalLink size={11} color="var(--text-muted)" />
          </button>

          <button
            className="btn btn-ghost btn-sm"
            style={{
              justifyContent: "space-between",
              padding: "5px 8px",
              fontSize: "0.775rem",
              borderRadius: "var(--radius-sm)"
            }}
            onClick={() => setActiveRole("iframe_simulator")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MonitorPlay size={13} color="#059669" />
              <span>Website Iframe</span>
            </span>
            <ExternalLink size={11} color="var(--text-muted)" />
          </button>

          <button
            className="btn btn-ghost btn-sm"
            style={{
              justifyContent: "space-between",
              padding: "5px 8px",
              fontSize: "0.775rem",
              borderRadius: "var(--radius-sm)",
              marginTop: 2
            }}
            onClick={() => setActiveRole("experthire_platform")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={13} color="#4f46e5" />
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>ExpertHire Platform</span>
            </span>
            <ExternalLink size={11} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {/* User Footer with Online Status & Sign Out */}
      <div className="sidebar-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <div className="user-avatar-sm">{userInitials}</div>
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
              {activeUser.name}
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
              <span>{activeUser.title || activeUser.roleLabel || activeUser.role || "Company Admin"}</span>
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
