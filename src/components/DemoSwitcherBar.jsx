import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAts } from "../context/AtsContext";
import { getCompanySlug } from "../utils/companySlug";
import {
  Building2,
  Users2,
  Globe,
  MonitorPlay,
  RotateCcw,
  Sun,
  Moon,
  ShieldAlert,
  Zap
} from "lucide-react";

export const DemoSwitcherBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSuperAdmin = location.pathname.startsWith("/super-admin") || location.pathname.startsWith("/superadmin") || location.pathname.startsWith("/admin");
  const isEmployerAts = location.pathname.startsWith("/employer-dashboard") || location.pathname.startsWith("/employer-ats") || location.pathname.startsWith("/ats") || location.pathname === "/";
  const isAgencyPortal = location.pathname.startsWith("/agency");
  const isCareerSite = location.pathname.startsWith("/career") || location.pathname.endsWith("-careers");
  const isExpertHire = location.pathname.startsWith("/experthire") || location.pathname.startsWith("/jobs");
  const isIframe = location.pathname.startsWith("/iframe") || location.pathname.startsWith("/embed");

  const {
    activeRole,
    setActiveRole,
    resetToDefaults,
    theme,
    toggleTheme,
    companies = [],
    activeCompanyId,
    switchCompany,
    company
  } = useAts();

  return (
    <div className="demo-topbar">
      {/* Micro Left Branding */}
      <div className="demo-topbar-left">
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 6px #10b981"
            }}
          />
          EXPERTHIRE ATS
        </span>
        <span style={{ color: "var(--border-medium)", fontSize: "0.7rem" }}>|</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                objectFit: "contain",
                background: "var(--bg-surface)"
              }}
            />
          ) : (
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: company?.brandColor || "var(--primary)",
                color: "#fff",
                fontSize: "0.6rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {company?.logoInitials || "TS"}
            </div>
          )}
          <span style={{ fontWeight: 700, fontSize: "0.775rem", color: "var(--text-primary)" }}>
            {company?.name || "BharatScale"}
          </span>
        </div>
      </div>

      {/* Micro Role Switcher Tabs */}
      <div className="demo-role-tabs">
        <button
          className={`demo-role-btn ${isSuperAdmin ? "active" : ""}`}
          onClick={() => {
            setActiveRole("super_admin");
            navigate("/super-admin");
          }}
          title="Super Admin: Multi-Tenant Platform Engine (http://localhost:5173/super-admin)"
          style={
            isSuperAdmin
              ? { background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)", color: "#fff" }
              : {}
          }
        >
          <ShieldAlert size={12} />
          <span>Super Admin</span>
        </button>

        <button
          className={`demo-role-btn ${isEmployerAts ? "active" : ""}`}
          onClick={() => {
            setActiveRole("company_admin");
            navigate("/employer-dashboard");
          }}
          title="Company Admin ATS Dashboard (http://localhost:5173/employer-dashboard)"
        >
          <Building2 size={12} />
          <span>Employer ATS</span>
        </button>

        <button
          className={`demo-role-btn ${isAgencyPortal ? "active" : ""}`}
          onClick={() => {
            setActiveRole("agency_portal");
            navigate("/agency-portal");
          }}
          title="Recruitment Agency Partner Portal (http://localhost:5173/agency-portal)"
        >
          <Users2 size={12} />
          <span>Agency Portal</span>
        </button>

        <button
          className={`demo-role-btn ${isCareerSite ? "active" : ""}`}
          onClick={() => {
            setActiveRole("public_careers");
            navigate(`/career-site/${getCompanySlug(company)}`);
          }}
          title={`${company?.name || "Company"} Career Portal (http://localhost:5173/career-site/${getCompanySlug(company)})`}
        >
          <Globe size={12} />
          <span>{company?.name ? `${company.name.split(" ")[0]} Careers` : "Career Site"}</span>
        </button>

        <button
          className={`demo-role-btn ${isExpertHire ? "active" : ""}`}
          onClick={() => {
            setActiveRole("experthire_platform");
            navigate("/experthire-platform");
          }}
          title="ExpertHire Direct Candidate Platform (http://localhost:5173/experthire-platform)"
          style={
            isExpertHire
              ? { background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)", color: "#fff" }
              : {}
          }
        >
          <Zap size={12} fill={isExpertHire ? "#fff" : "currentColor"} />
          <span>ExpertHire Platform</span>
        </button>

        <button
          className={`demo-role-btn ${isIframe ? "active" : ""}`}
          onClick={() => {
            setActiveRole("iframe_simulator");
            navigate("/iframe-simulator");
          }}
          title="Embedded Iframe Widget (http://localhost:5173/iframe-simulator)"
        >
          <MonitorPlay size={12} />
          <span>Iframe</span>
        </button>
      </div>

      {/* Micro Right Controls */}
      <div className="demo-topbar-right">
        {isEmployerAts && (
          <select
            style={{
              padding: "2px 6px",
              fontSize: "0.7rem",
              height: 24,
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              fontWeight: 700,
              color: "var(--text-primary)"
            }}
            value={activeCompanyId}
            onChange={(e) => switchCompany(e.target.value)}
            title="Switch Active Employer Company"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Day Mode"}
        >
          {theme === "light" ? <Moon size={13} color="var(--primary)" /> : <Sun size={13} color="#fbbf24" />}
        </button>

        <button
          className="reset-demo-btn"
          onClick={() => {
            if (window.confirm("Reset all prototype data to defaults?")) {
              resetToDefaults();
            }
          }}
          title="Reset dataset"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
