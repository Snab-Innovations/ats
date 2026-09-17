import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import {
  ShieldAlert,
  Building2,
  Users,
  Briefcase,
  ExternalLink,
  PlusCircle,
  LogIn,
  Palette,
  CheckCircle,
  X,
  Mail,
  Phone,
  Search,
  Globe,
  Award,
  Zap,
  IndianRupee,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
  Trash2,
  Edit3
} from "lucide-react";

export const SuperAdminPortal = () => {
  const {
    companies,
    activeCompanyId,
    switchCompany,
    addCompanyTenant,
    updateCompanyBranding,
    companyUsers,
    addCompanyUser,
    removeCompanyUser,
    agencies,
    setSelectedAgencyId,
    setActiveRole,
    jobs,
    coverPresets
  } = useAts();

  const [activeTab, setActiveTab] = useState("companies"); // 'companies' | 'users' | 'agencies' | 'branding'
  const [companySearch, setCompanySearch] = useState("");
  const [userCompanyFilter, setUserCompanyFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  // Modals
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [selectedCompanyForBranding, setSelectedCompanyForBranding] = useState(null);

  // New Company Form State
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    tagline: "",
    domain: "",
    headquarters: "Bengaluru (Indiranagar)",
    employeeCount: "100-500 Builders",
    plan: "Enterprise Scale Tier",
    primaryAdminName: "",
    primaryAdmin: "",
    brandColor: "#4f46e5",
    accentColor: "#0284c7",
    coverImage: coverPresets[0]?.url || ""
  });

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    companyId: companies[0]?.id || "comp-bharat-101",
    name: "",
    email: "",
    phone: "+91 ",
    role: "Company Admin",
    title: "Senior Tech Recruiter",
    department: "Talent Acquisition"
  });

  // Branding Edit Form State
  const [brandingForm, setBrandingForm] = useState({
    name: "",
    tagline: "",
    logoInitials: "",
    logoUrl: "",
    coverImage: "",
    brandColor: "#4f46e5",
    accentColor: "#0284c7"
  });

  const handleOpenBranding = (comp) => {
    setSelectedCompanyForBranding(comp);
    setBrandingForm({
      name: comp.name,
      tagline: comp.tagline,
      logoInitials: comp.logoInitials,
      logoUrl: comp.logoUrl || "",
      coverImage: comp.coverImage || coverPresets[0]?.url,
      brandColor: comp.brandColor || "#4f46e5",
      accentColor: comp.accentColor || "#0284c7"
    });
    setIsBrandingModalOpen(true);
  };

  const handleSaveBranding = (e) => {
    e.preventDefault();
    if (!selectedCompanyForBranding) return;
    updateCompanyBranding(selectedCompanyForBranding.id, brandingForm);
    setIsBrandingModalOpen(false);
  };

  const handleCreateCompany = (e) => {
    e.preventDefault();
    if (!newCompanyForm.name.trim()) return;
    addCompanyTenant(newCompanyForm);
    setIsNewCompanyModalOpen(false);
    setNewCompanyForm({
      name: "",
      tagline: "",
      domain: "",
      headquarters: "Bengaluru (Indiranagar)",
      employeeCount: "100-500 Builders",
      plan: "Enterprise Scale Tier",
      primaryAdminName: "",
      primaryAdmin: "",
      brandColor: "#4f46e5",
      accentColor: "#0284c7",
      coverImage: coverPresets[0]?.url || ""
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;
    addCompanyUser(newUserForm);
    setIsNewUserModalOpen(false);
    setNewUserForm({
      companyId: companies[0]?.id || "comp-bharat-101",
      name: "",
      email: "",
      phone: "+91 ",
      role: "Company Admin",
      title: "Senior Tech Recruiter",
      department: "Talent Acquisition"
    });
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.domain.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredUsers = companyUsers.filter((u) => {
    const matchesCompany = userCompanyFilter === "all" || u.companyId === userCompanyFilter;
    const matchesQuery =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearch.toLowerCase());
    return matchesCompany && matchesQuery;
  });

  return (
    <div className="admin-shell">
      {/* Platform Owner Sidebar */}
      <SuperAdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCompanyModal={() => setIsNewCompanyModalOpen(true)}
        onOpenNewUserModal={() => setIsNewUserModalOpen(true)}
      />

      <div className="admin-main" style={{ minHeight: "100vh" }}>
        {/* Top Header */}
        <header className="page-header" style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
        <div className="page-title-group">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
                color: "#fff"
              }}
            >
              <ShieldAlert size={18} />
            </span>
            <h1>ExpertHire Super Admin Console</h1>
            <span className="badge badge-source-agency" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
              Platform Owner Engine
            </span>
          </div>
          <p style={{ marginTop: 4 }}>
            Multi-Tenant Management: Create multiple employer ATS logins, assign team user access, coordinate 3rd-party placement agencies, and personalize brand cover pages.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsNewUserModalOpen(true)}
          >
            <Users size={15} />
            <span>Add Team Login</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsNewCompanyModalOpen(true)}
          >
            <PlusCircle size={15} />
            <span>Create Employer Company</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="page-content" style={{ padding: "28px 32px 50px" }}>
        {/* KPI Summary Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Employer ATS Tenants</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)" }}>
                <Building2 size={18} />
              </div>
            </div>
            <div className="kpi-value">{companies.length}</div>
            <div className="kpi-footer">
              <span className="kpi-trend-up">Active Multi-Tenant Orgs</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Assigned Team Logins</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7" }}>
                <Users size={18} />
              </div>
            </div>
            <div className="kpi-value">{companyUsers.length}</div>
            <div className="kpi-footer">
              <span>Recruiters, Hiring Managers & Admins</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Placement Agency Partners</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(219, 39, 119, 0.1)", color: "#db2777" }}>
                <Award size={18} />
              </div>
            </div>
            <div className="kpi-value">{agencies.length}</div>
            <div className="kpi-footer">
              <span>3rd-Party Consultancies Connected</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Active Requisitions</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(5, 150, 105, 0.1)", color: "#059669" }}>
                <Briefcase size={18} />
              </div>
            </div>
            <div className="kpi-value">{jobs.length}</div>
            <div className="kpi-footer">
              <span className="badge badge-notice-immediate" style={{ fontSize: "0.72rem" }}>
                Syndicated Platform-Wide
              </span>
            </div>
          </div>
        </div>

        {/* Super Admin Navigation Tabs */}
        <div className="modal-tabs-container" style={{ margin: "20px 0 24px", borderRadius: "var(--radius-md) var(--radius-md) 0 0", border: "1px solid var(--border-subtle)", borderBottom: "none" }}>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "companies" ? "active" : ""}`}
            onClick={() => setActiveTab("companies")}
          >
            <Building2 size={16} />
            <span>Employer ATS Companies ({companies.length})</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={16} />
            <span>Company Team User Logins ({companyUsers.length})</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "agencies" ? "active" : ""}`}
            onClick={() => setActiveTab("agencies")}
          >
            <Award size={16} />
            <span>3rd-Party Placement Agencies ({agencies.length})</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "branding" ? "active" : ""}`}
            onClick={() => setActiveTab("branding")}
          >
            <Palette size={16} />
            <span>Cover Page Presets & Personalization</span>
          </button>
        </div>

        {/* TAB 1: Employer ATS Companies */}
        {activeTab === "companies" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 16, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Search employer company or domain..."
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsNewCompanyModalOpen(true)}
                >
                  <PlusCircle size={14} />
                  <span>New Employer Company</span>
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
              {filteredCompanies.map((comp) => {
                const isCurrentActive = comp.id === activeCompanyId;
                const assignedUsers = companyUsers.filter((u) => u.companyId === comp.id);

                return (
                  <div
                    key={comp.id}
                    className="card"
                    style={{
                      padding: 0,
                      overflow: "hidden",
                      border: isCurrentActive ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                      background: "var(--bg-surface)",
                      position: "relative"
                    }}
                  >
                    {/* Cover Banner Thumbnail */}
                    <div
                      style={{
                        height: 110,
                        backgroundImage: `linear-gradient(180deg, rgba(20, 16, 12, 0.2) 0%, rgba(20, 16, 12, 0.75) 100%), url(${comp.coverImage || coverPresets[0]?.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between"
                      }}
                    >
                      <span className="badge" style={{ background: "rgba(255, 255, 255, 0.9)", color: "#1c1917", fontWeight: 700 }}>
                        {comp.plan || "Enterprise Tier"}
                      </span>

                      {isCurrentActive && (
                        <span className="badge" style={{ background: "var(--primary)", color: "#fff", fontWeight: 800 }}>
                          Currently Active in ATS
                        </span>
                      )}
                    </div>

                    {/* Body Content */}
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: -32, marginBottom: 12 }}>
                        {comp.logoUrl ? (
                          <img
                            src={comp.logoUrl}
                            alt={comp.name}
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "var(--radius-md)",
                              objectFit: "cover",
                              border: "3px solid var(--bg-surface)",
                              boxShadow: "var(--shadow-md)"
                            }}
                          />
                        ) : (
                          <div
                            className="company-logo-avatar"
                            style={{
                              width: 48,
                              height: 48,
                              fontSize: "1.1rem",
                              background: comp.logoBadgeColor || "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
                              border: "3px solid var(--bg-surface)",
                              boxShadow: "var(--shadow-md)"
                            }}
                          >
                            {comp.logoInitials || "CO"}
                          </div>
                        )}

                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{comp.name}</h3>
                          <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                            {comp.domain} &bull; {comp.headquarters?.split("&")[0]}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 14 }}>
                        {comp.tagline}
                      </p>

                      <div
                        style={{
                          background: "var(--bg-surface-elevated)",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.775rem",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                          marginBottom: 16
                        }}
                      >
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Team Logins: </span>
                          <strong>{assignedUsers.length} Users</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Status: </span>
                          <strong style={{ color: "#059669" }}>{comp.status || "Active"}</strong>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                          <span style={{ color: "var(--text-muted)" }}>Primary Admin: </span>
                          <strong>{comp.primaryAdmin || "admin@" + comp.domain}</strong>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => {
                            switchCompany(comp.id);
                            setActiveRole("company_admin");
                          }}
                          title="Impersonate and manage this company's ATS directly"
                        >
                          <LogIn size={14} />
                          <span>Login to ATS</span>
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenBranding(comp)}
                          title="Personalize Logo, Cover Banner, & Brand Colors"
                        >
                          <Palette size={14} />
                          <span>Branding</span>
                        </button>

                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          onClick={() => {
                            switchCompany(comp.id);
                            setActiveRole("public_careers");
                          }}
                          title="Preview Public Career Portal"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Company Team User Logins */}
        {activeTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 320, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    placeholder="Search by user name, email, role..."
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <select
                  className="form-select"
                  style={{ width: 220 }}
                  value={userCompanyFilter}
                  onChange={(e) => setUserCompanyFilter(e.target.value)}
                >
                  <option value="all">All Employer Companies</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsNewUserModalOpen(true)}
              >
                <PlusCircle size={14} />
                <span>Add Team Member Login</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User & Identity</th>
                    <th>Employer Company</th>
                    <th>Role & Permissions</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const comp = companies.find((c) => c.id === user.companyId);
                    return (
                      <tr key={user.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "var(--radius-full)",
                                background: "var(--primary-subtle)",
                                color: "var(--primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.85rem"
                              }}
                            >
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <strong style={{ color: "var(--text-primary)", display: "block" }}>{user.name}</strong>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Building2 size={13} color="var(--primary)" />
                            <strong>{comp?.name || "Company"}</strong>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              user.role.includes("Admin")
                                ? "badge-source-agency"
                                : user.role.includes("Hiring")
                                ? "badge-source-direct"
                                : "badge-source-referral"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{user.department || "Engineering"}</td>
                        <td>
                          <span
                            className="badge badge-active"
                            style={{
                              background: user.status === "Active" ? "rgba(5, 150, 105, 0.12)" : "rgba(217, 119, 6, 0.12)",
                              color: user.status === "Active" ? "#059669" : "#d97706"
                            }}
                          >
                            {user.status || "Active"}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{user.lastLogin || "Recent"}</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            style={{ color: "#dc2626" }}
                            onClick={() => {
                              if (window.confirm(`Revoke login access for ${user.name}?`)) {
                                removeCompanyUser(user.id);
                              }
                            }}
                            title="Revoke User Access"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: 3rd-Party Placement Agencies */}
        {activeTab === "agencies" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: "1.1rem" }}>Platform Placement Partners & Headhunters</h3>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  Verified pan-India talent partners receiving syndicated requisitions with automated bounty payouts
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
              {agencies.map((agy) => (
                <div key={agy.id} className="card" style={{ background: "var(--bg-surface)", padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        className="company-logo-avatar"
                        style={{ width: 40, height: 40, background: agy.logoColor || "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" }}
                      >
                        {agy.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: "0.975rem" }}>{agy.name}</h4>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{agy.tier || "Elite Partner"}</span>
                      </div>
                    </div>
                    <span className="badge badge-active">{agy.status || "Active"}</span>
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 12 }}>
                    Specialization: <strong>{agy.specialization}</strong>
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 10, background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)", fontSize: "0.775rem", marginBottom: 14 }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Submissions: </span>
                      <strong>{agy.candidatesSubmitted}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Placements: </span>
                      <strong style={{ color: "#059669" }}>{agy.placementsHired}</strong>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <span style={{ color: "var(--text-muted)" }}>Commission: </span>
                      <strong>{agy.commissionTier}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setSelectedAgencyId(agy.id);
                        setActiveRole("agency_portal");
                      }}
                    >
                      <LogIn size={13} />
                      <span>Login as Agency</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Cover Presets & Personalization */}
        {activeTab === "branding" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: "1.1rem" }}>Platform Curated Cover Banners & Branding Presets</h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                These high-definition cover banners are available to all employer companies for their career portal heroes and ATS dashboards.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {coverPresets.map((preset) => (
                <div key={preset.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div
                    style={{
                      height: 160,
                      backgroundImage: `url(${preset.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ fontSize: "0.95rem" }}>{preset.title}</h4>
                      <span className="badge badge-source-direct">{preset.category}</span>
                    </div>
                    <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginTop: 6 }}>
                      High-resolution 4K asset optimized for ultra-fast CDN delivery with zero layout shift.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

      {/* MODAL 1: Create New Employer Company Tenant */}
      {isNewCompanyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewCompanyModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Building2 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.2rem" }}>Create New Employer ATS Company</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsNewCompanyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCompany}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Company Legal / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy Tech Labs, PhonePe Infra"
                    className="form-input"
                    value={newCompanyForm.name}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Tagline / Mission</label>
                  <input
                    type="text"
                    placeholder="e.g. Building India's Largest Consumer Internet Logistics"
                    className="form-input"
                    value={newCompanyForm.tagline}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Corporate Domain</label>
                    <input
                      type="text"
                      placeholder="e.g. swiggy.in"
                      className="form-input"
                      value={newCompanyForm.domain}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, domain: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Headquarters / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru (Koramangala)"
                      className="form-input"
                      value={newCompanyForm.headquarters}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, headquarters: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Primary Admin Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rohit Sharma"
                      className="form-input"
                      value={newCompanyForm.primaryAdminName}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, primaryAdminName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Admin Email (Login)</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@company.in"
                      className="form-input"
                      value={newCompanyForm.primaryAdmin}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, primaryAdmin: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Choose Initial Cover Banner Preset</label>
                  <select
                    className="form-select"
                    value={newCompanyForm.coverImage}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, coverImage: e.target.value })}
                  >
                    {coverPresets.map((p) => (
                      <option key={p.id} value={p.url}>
                        {p.title} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewCompanyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <PlusCircle size={15} />
                  <span>Create Employer Company</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Team Member User Login */}
      {isNewUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewUserModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.2rem" }}>Assign Team Member Login</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsNewUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Assign to Employer Company</label>
                  <select
                    className="form-select"
                    value={newUserForm.companyId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, companyId: e.target.value })}
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.domain})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Apte"
                    className="form-input"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Work Email (Login Username)</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. radhika@company.in"
                      className="form-input"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number (WhatsApp)</label>
                    <input
                      type="text"
                      placeholder="+91 98201 88492"
                      className="form-input"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Platform Role & Permission</label>
                    <select
                      className="form-select"
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    >
                      <option value="Company Admin">Company Admin (Full ATS Access)</option>
                      <option value="Lead Tech Recruiter">Lead Tech Recruiter (Pipeline & Sourcing)</option>
                      <option value="Hiring Manager">Hiring Manager (Scorecards & Offer Approval)</option>
                      <option value="Technical Interviewer">Technical Interviewer (Rounds Only)</option>
                      <option value="HR Coordinator">HR Coordinator (Offers & Paperwork)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Unit</label>
                    <input
                      type="text"
                      placeholder="e.g. Backend Engineering"
                      className="form-input"
                      value={newUserForm.department}
                      onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewUserModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <PlusCircle size={15} />
                  <span>Assign Login Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Company Branding (Logo, Cover Page, Colors) */}
      {isBrandingModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBrandingModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Palette size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.2rem" }}>Personalize Company Branding & Cover Page</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsBrandingModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBranding}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Live Preview Card */}
                <div
                  style={{
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-surface)"
                  }}
                >
                  <div
                    style={{
                      height: 100,
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url(${brandingForm.coverImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "flex-end"
                    }}
                  >
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
                      Cover Banner Preview
                    </span>
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    {brandingForm.logoUrl ? (
                      <img
                        src={brandingForm.logoUrl}
                        alt="Logo Preview"
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="company-logo-avatar"
                        style={{ width: 40, height: 40, background: brandingForm.brandColor }}
                      >
                        {brandingForm.logoInitials || "CO"}
                      </div>
                    )}
                    <div>
                      <strong style={{ fontSize: "1rem" }}>{brandingForm.name}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{brandingForm.tagline}</div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Banner Preset</label>
                  <select
                    className="form-select"
                    value={brandingForm.coverImage}
                    onChange={(e) => setBrandingForm({ ...brandingForm, coverImage: e.target.value })}
                  >
                    {coverPresets.map((p) => (
                      <option key={p.id} value={p.url}>
                        {p.title} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Or Custom Cover Banner Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                    value={brandingForm.coverImage}
                    onChange={(e) => setBrandingForm({ ...brandingForm, coverImage: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Logo Initials</label>
                    <input
                      type="text"
                      maxLength={3}
                      className="form-input"
                      value={brandingForm.logoInitials}
                      onChange={(e) => setBrandingForm({ ...brandingForm, logoInitials: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Or Custom Logo Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      className="form-input"
                      value={brandingForm.logoUrl}
                      onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Primary Brand Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="color"
                        style={{ width: 40, height: 36, border: "none", cursor: "pointer", borderRadius: 4 }}
                        value={brandingForm.brandColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, brandColor: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={brandingForm.brandColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, brandColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Accent Brand Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="color"
                        style={{ width: 40, height: 36, border: "none", cursor: "pointer", borderRadius: 4 }}
                        value={brandingForm.accentColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, accentColor: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={brandingForm.accentColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, accentColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsBrandingModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={15} />
                  <span>Save Branding Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
