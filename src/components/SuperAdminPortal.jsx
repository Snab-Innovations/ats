import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import {
  ShieldAlert,
  Building2,
  Users,
  UsersRound,
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
  Edit3,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export const SuperAdminPortal = () => {
  const {
    companies,
    activeCompanyId,
    switchCompany,
    addCompanyTenant,
    toggleCompanyStatus,
    updateCompanyCredentials,
    removeCompanyTenant,
    updateCompanyBranding,
    companyUsers,
    addCompanyUser,
    removeCompanyUser,
    agencies,
    addAgency,
    toggleAgencyStatus,
    updateAgency,
    removeAgency,
    setSelectedAgencyId,
    setActiveRole,
    jobs,
    candidates,
    coverPresets
  } = useAts();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'companies' | 'agencies' | 'users' | 'branding'
  const [companySearch, setCompanySearch] = useState("");
  const [companyStatusFilter, setCompanyStatusFilter] = useState("all");
  const [agencySearch, setAgencySearch] = useState("");
  const [agencyStatusFilter, setAgencyStatusFilter] = useState("all");
  const [userCompanyFilter, setUserCompanyFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  // Visible password toggle states
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Modals
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isNewAgencyModalOpen, setIsNewAgencyModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [selectedCompanyForBranding, setSelectedCompanyForBranding] = useState(null);

  // Credentials Edit Modal (for either Company or Agency)
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credentialTarget, setCredentialTarget] = useState(null); // { type: 'company' | 'agency', data: object }
  const [credentialForm, setCredentialForm] = useState({ email: "", password: "" });

  // Generate strong random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass + "!";
  };

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
    adminPassword: "Company#2026!",
    brandColor: "#4f46e5",
    accentColor: "#0284c7",
    coverImage: coverPresets[0]?.url || ""
  });

  // New Agency Form State
  const [newAgencyForm, setNewAgencyForm] = useState({
    name: "",
    portalCode: "",
    city: "Bengaluru",
    primaryContact: "",
    email: "",
    phone: "+91 ",
    portalPassword: "Agency#2026Pass!",
    specialization: "Distributed Systems & Cloud",
    commissionTier: "8.33% (1 Month CTC)",
    tier: "Elite Partner"
  });

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    companyId: companies[0]?.id || "comp-bharat-101",
    name: "",
    email: "",
    phone: "+91 ",
    role: "Company Admin",
    title: "Senior Tech Recruiter",
    department: "Talent Acquisition",
    password: "User#2026!"
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

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Credentials Modal
  const handleOpenCredentials = (type, item) => {
    setCredentialTarget({ type, data: item });
    setCredentialForm({
      email: type === "company" ? item.primaryAdmin || "" : item.email || "",
      password: type === "company" ? item.adminPassword || "Company#2026!" : item.portalPassword || "Agency#2026!"
    });
    setIsCredentialsModalOpen(true);
  };

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    if (!credentialTarget) return;

    if (credentialTarget.type === "company") {
      updateCompanyCredentials(credentialTarget.data.id, {
        primaryAdmin: credentialForm.email,
        adminPassword: credentialForm.password
      });
    } else {
      updateAgency(credentialTarget.data.id, {
        email: credentialForm.email,
        portalPassword: credentialForm.password
      });
    }
    setIsCredentialsModalOpen(false);
  };

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
    if (!newCompanyForm.name.trim() || !newCompanyForm.primaryAdmin.trim()) return;
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
      adminPassword: "Company#2026!",
      brandColor: "#4f46e5",
      accentColor: "#0284c7",
      coverImage: coverPresets[0]?.url || ""
    });
    setActiveTab("companies");
  };

  const handleCreateAgency = (e) => {
    e.preventDefault();
    if (!newAgencyForm.name.trim() || !newAgencyForm.email.trim()) return;
    const generatedCode =
      newAgencyForm.portalCode.trim() ||
      newAgencyForm.name.split(" ").map((w) => w[0]).join("").toUpperCase() + "-PARTNER";

    addAgency({
      ...newAgencyForm,
      portalCode: generatedCode
    });
    setIsNewAgencyModalOpen(false);
    setNewAgencyForm({
      name: "",
      portalCode: "",
      city: "Bengaluru",
      primaryContact: "",
      email: "",
      phone: "+91 ",
      portalPassword: "Agency#2026Pass!",
      specialization: "Distributed Systems & Cloud",
      commissionTier: "8.33% (1 Month CTC)",
      tier: "Elite Partner"
    });
    setActiveTab("agencies");
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
      department: "Talent Acquisition",
      password: "User#2026!"
    });
    setActiveTab("users");
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.domain.toLowerCase().includes(companySearch.toLowerCase()) ||
      (c.primaryAdmin && c.primaryAdmin.toLowerCase().includes(companySearch.toLowerCase()));
    const matchesStatus = companyStatusFilter === "all" || c.status === companyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAgencies = agencies.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(agencySearch.toLowerCase()) ||
      a.city.toLowerCase().includes(agencySearch.toLowerCase()) ||
      (a.primaryContact && a.primaryContact.toLowerCase().includes(agencySearch.toLowerCase())) ||
      (a.email && a.email.toLowerCase().includes(agencySearch.toLowerCase()));
    const matchesStatus = agencyStatusFilter === "all" || (a.status || "active").toLowerCase() === agencyStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
        onOpenNewAgencyModal={() => setIsNewAgencyModalOpen(true)}
        onOpenNewUserModal={() => setIsNewUserModalOpen(true)}
      />

      <div className="admin-main" style={{ minHeight: "100vh" }}>
        {/* Top Header */}
        <header
          className="page-header"
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16
          }}
        >
          <div className="page-title-group">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)"
                }}
              >
                <ShieldAlert size={19} />
              </span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                    ExpertHire Super Admin Console
                  </h1>
                  <span className="badge badge-source-agency" style={{ fontSize: "0.725rem", padding: "2px 8px" }}>
                    Multi-Tenant Master
                  </span>
                </div>
                <p style={{ marginTop: 2, fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  Create employer ATS company portals with login passwords, provision placement agencies, and manage access.
                </p>
              </div>
            </div>
          </div>

          <div className="header-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600 }}
              onClick={() => setIsNewUserModalOpen(true)}
            >
              <Users size={14} />
              <span>Add Team User</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600 }}
              onClick={() => setIsNewAgencyModalOpen(true)}
            >
              <UsersRound size={14} />
              <span>Register Agency</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
              }}
              onClick={() => setIsNewCompanyModalOpen(true)}
            >
              <PlusCircle size={15} />
              <span>Create Company Tenant</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="page-content" style={{ padding: "28px 32px 60px" }}>
          {/* Super Admin Top Navigation Tabs Bar */}
          <div
            className="modal-tabs-container"
            style={{
              marginBottom: 24,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-surface-elevated)"
            }}
          >
            <button
              type="button"
              className={`modal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <Globe size={15} />
              <span>Platform Overview</span>
            </button>

            <button
              type="button"
              className={`modal-tab-btn ${activeTab === "companies" ? "active" : ""}`}
              onClick={() => setActiveTab("companies")}
            >
              <Building2 size={15} />
              <span>Employer ATS Tenants ({companies.length})</span>
            </button>

            <button
              type="button"
              className={`modal-tab-btn ${activeTab === "agencies" ? "active" : ""}`}
              onClick={() => setActiveTab("agencies")}
            >
              <UsersRound size={15} />
              <span>Placement Agencies ({agencies.length})</span>
            </button>

            <button
              type="button"
              className={`modal-tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <Users size={15} />
              <span>Company Team Logins ({companyUsers.length})</span>
            </button>

            <button
              type="button"
              className={`modal-tab-btn ${activeTab === "branding" ? "active" : ""}`}
              onClick={() => setActiveTab("branding")}
            >
              <Palette size={15} />
              <span>Cover Presets & Branding</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: PLATFORM OVERVIEW & GLOBAL DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div>
              {/* Global KPI Metrics */}
              <div className="kpi-grid" style={{ marginBottom: 26 }}>
                <div className="kpi-card kpi-accent-indigo" onClick={() => setActiveTab("companies")} style={{ cursor: "pointer" }}>
                  <div className="kpi-header">
                    <span className="kpi-title">Employer Tenants</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)" }}>
                      <Building2 size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{companies.length}</div>
                  <div className="kpi-footer">
                    <span className="kpi-trend-up">{companies.filter((c) => c.status === "Active").length} Active Orgs</span>
                    <span>&bull; Full ATS Portals</span>
                  </div>
                </div>

                <div className="kpi-card kpi-accent-fuchsia" onClick={() => setActiveTab("agencies")} style={{ cursor: "pointer" }}>
                  <div className="kpi-header">
                    <span className="kpi-title">Placement Agencies</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(219, 39, 119, 0.1)", color: "#db2777" }}>
                      <UsersRound size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{agencies.length}</div>
                  <div className="kpi-footer">
                    <span className="kpi-trend-up">{agencies.reduce((acc, a) => acc + (a.candidatesSubmitted || 0), 0)} Submissions</span>
                    <span>&bull; Pan-India Network</span>
                  </div>
                </div>

                <div className="kpi-card kpi-accent-emerald">
                  <div className="kpi-header">
                    <span className="kpi-title">Active Requisitions</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(5, 150, 105, 0.1)", color: "#059669" }}>
                      <Briefcase size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{jobs.length}</div>
                  <div className="kpi-footer">
                    <span className="badge badge-active" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                      {jobs.filter((j) => j.status === "active").length} Live Openings
                    </span>
                  </div>
                </div>

                <div className="kpi-card kpi-accent-sky">
                  <div className="kpi-header">
                    <span className="kpi-title">Total Candidates</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7" }}>
                      <Users size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{candidates.length}</div>
                  <div className="kpi-footer">
                    <span>Direct + Agency Syndicated</span>
                  </div>
                </div>
              </div>

              {/* Master Control Launchpad */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 14 }}>
                  Super Admin Management Actions
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {/* Action 1 */}
                  <div className="admin-action-card admin-action-card-company">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            background: "rgba(79, 70, 229, 0.12)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Building2 size={19} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>Provision Employer Company</h4>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Onboard new enterprise client</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                        Create a dedicated employer ATS organization, set up corporate domain, and generate primary admin login credentials.
                      </p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
                        fontWeight: 700,
                        boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)"
                      }}
                      onClick={() => setIsNewCompanyModalOpen(true)}
                    >
                      <PlusCircle size={14} />
                      <span>Provision Company & Password</span>
                    </button>
                  </div>

                  {/* Action 2 */}
                  <div className="admin-action-card admin-action-card-agency">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            background: "rgba(219, 39, 119, 0.12)",
                            color: "#db2777",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <UsersRound size={19} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>Register Placement Agency</h4>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Onboard headhunter partner</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                        Connect staffing consultancy, issue unique agency portal code, commission tier, and set agency login password.
                      </p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                        fontWeight: 700,
                        boxShadow: "0 2px 8px rgba(236, 72, 153, 0.25)"
                      }}
                      onClick={() => setIsNewAgencyModalOpen(true)}
                    >
                      <PlusCircle size={14} />
                      <span>Register Agency & Password</span>
                    </button>
                  </div>

                  {/* Action 3 */}
                  <div className="admin-action-card admin-action-card-team">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            background: "rgba(2, 132, 199, 0.12)",
                            color: "#0284c7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Users size={19} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>Add Team Member Login</h4>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Recruiter or hiring manager</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                        Assign login credentials for recruiter, interviewer, or hiring manager to any active employer ATS organization.
                      </p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
                        fontWeight: 700,
                        boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)"
                      }}
                      onClick={() => setIsNewUserModalOpen(true)}
                    >
                      <PlusCircle size={14} />
                      <span>Assign User Credentials</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Directory Preview Table */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>Employer ATS Tenant Directory</h4>
                    <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>Active client organizations with direct login credentials</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("companies")}>
                    <span>View All ({companies.length}) &rarr;</span>
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: "23%" }}>Company Tenant</th>
                        <th style={{ width: "16%" }}>Domain / Plan</th>
                        <th style={{ width: "20%" }}>Admin Login Email</th>
                        <th style={{ width: "19%" }}>Admin Login Password</th>
                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "12%", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.slice(0, 5).map((comp) => {
                        const passVisible = visiblePasswords[`comp-${comp.id}`];
                        const passText = comp.adminPassword || "Company#2026!";

                        return (
                          <tr key={comp.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {comp.logoUrl ? (
                                  <img
                                    src={comp.logoUrl}
                                    alt={comp.name}
                                    style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain" }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: 8,
                                      background: comp.brandColor || "var(--primary)",
                                      color: "#fff",
                                      fontWeight: 800,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    {comp.logoInitials || "CO"}
                                  </div>
                                )}
                                <div>
                                  <span style={{ fontWeight: 700, display: "block", color: "var(--text-primary)" }}>{comp.name}</span>
                                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{comp.headquarters?.split("&")[0]}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.775rem", fontWeight: 600 }}>{comp.domain}</span>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>{comp.plan}</span>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>
                                {comp.primaryAdmin || "admin@" + comp.domain}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span className="admin-pass-pill">
                                  {passVisible ? passText : "••••••••••••"}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon btn-sm"
                                  style={{ width: 26, height: 26, padding: 0 }}
                                  onClick={() => togglePasswordVisibility(`comp-${comp.id}`)}
                                  title={passVisible ? "Hide password" : "View password"}
                                >
                                  {passVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon btn-sm"
                                  style={{ width: 26, height: 26, padding: 0 }}
                                  onClick={() => handleCopy(`comp-${comp.id}`, passText)}
                                  title="Copy password"
                                >
                                  {copiedId === `comp-${comp.id}` ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                                </button>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${comp.status === "Active" ? "badge-active" : "badge-paused"}`}>
                                {comp.status || "Active"}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div style={{ display: "inline-flex", gap: 6, alignItems: "center", justifyContent: "flex-end" }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: "0.72rem", padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}
                                  onClick={() => handleOpenCredentials("company", comp)}
                                  title="Edit login password"
                                >
                                  <Key size={12} style={{ color: "var(--primary)" }} />
                                  <span>Edit Pass</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  style={{
                                    fontSize: "0.72rem",
                                    padding: "4px 10px",
                                    background: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4
                                  }}
                                  onClick={() => {
                                    switchCompany(comp.id);
                                    setActiveRole("company_admin");
                                  }}
                                  title="Enter Employer ATS Workspace"
                                >
                                  <LogIn size={12} />
                                  <span>Enter ATS</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EMPLOYER ATS TENANTS / COMPANIES MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "companies" && (
            <div>
              {/* Filter and Action Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  gap: 14,
                  flexWrap: "wrap"
                }}
              >
                <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 280, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                    <Search
                      size={15}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="text"
                      placeholder="Search company, domain, or admin email..."
                      className="form-input"
                      style={{ paddingLeft: 36, height: 38 }}
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-select"
                    style={{ width: 140, height: 38 }}
                    value={companyStatusFilter}
                    onChange={(e) => setCompanyStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    style={{
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
                    }}
                    onClick={() => setIsNewCompanyModalOpen(true)}
                  >
                    <PlusCircle size={15} />
                    <span>Create Company Tenant</span>
                  </button>
                </div>
              </div>

              {/* Grid of Company Tenant Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                {filteredCompanies.map((comp) => {
                  const isCurrentActive = comp.id === activeCompanyId;
                  const assignedUsers = companyUsers.filter((u) => u.companyId === comp.id);
                  const passVisible = visiblePasswords[`comp-${comp.id}`];
                  const passText = comp.adminPassword || "Company#2026!";

                  return (
                    <div
                      key={comp.id}
                      className="card"
                      style={{
                        padding: 0,
                        overflow: "hidden",
                        border: isCurrentActive ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                        background: "var(--bg-surface)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      {/* Cover Thumbnail */}
                      <div
                        style={{
                          height: 100,
                          backgroundImage: `linear-gradient(180deg, rgba(20, 16, 12, 0.2) 0%, rgba(20, 16, 12, 0.75) 100%), url(${comp.coverImage || coverPresets[0]?.url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between"
                        }}
                      >
                        <span className="badge" style={{ background: "rgba(255, 255, 255, 0.92)", color: "#1c1917", fontWeight: 700 }}>
                          {comp.plan || "Enterprise Tier"}
                        </span>

                        <span
                          className={`badge ${comp.status === "Active" ? "badge-active" : "badge-paused"}`}
                          style={{ fontWeight: 800 }}
                        >
                          {comp.status || "Active"}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          {/* Logo + Titles */}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: -32, marginBottom: 12 }}>
                            {comp.logoUrl ? (
                              <img
                                src={comp.logoUrl}
                                alt={comp.name}
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  objectFit: "contain",
                                  background: "var(--bg-surface)",
                                  border: "3px solid var(--bg-surface)",
                                  boxShadow: "var(--shadow-md)",
                                  padding: 2
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  background: comp.brandColor || "var(--primary)",
                                  color: "#fff",
                                  fontSize: "1.1rem",
                                  fontWeight: 800,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "3px solid var(--bg-surface)",
                                  boxShadow: "var(--shadow-md)"
                                }}
                              >
                                {comp.logoInitials || "CO"}
                              </div>
                            )}

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                                {comp.name}
                              </h3>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                {comp.domain} &bull; {comp.headquarters?.split("&")[0]}
                              </div>
                            </div>
                          </div>

                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 14 }}>
                            {comp.tagline}
                          </p>

                          {/* Credentials & Access Container */}
                          <div
                            style={{
                              background: "var(--bg-surface-elevated)",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              fontSize: "0.775rem",
                              marginBottom: 14,
                              border: "1px solid var(--border-subtle)"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: 5 }}>
                                <Lock size={12} />
                                <span>Company Admin Credentials</span>
                              </span>
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ fontSize: "0.7rem", padding: "1px 6px", height: "auto" }}
                                onClick={() => handleOpenCredentials("company", comp)}
                              >
                                Edit Pass
                              </button>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ color: "var(--text-muted)" }}>Login Email:</span>
                              <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                                {comp.primaryAdmin || "admin@" + comp.domain}
                              </span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "var(--text-muted)" }}>Password:</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                                  {passVisible ? passText : "••••••••••••"}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon btn-sm"
                                  style={{ width: 22, height: 22, padding: 0 }}
                                  onClick={() => togglePasswordVisibility(`comp-${comp.id}`)}
                                  title={passVisible ? "Hide password" : "Show password"}
                                >
                                  {passVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon btn-sm"
                                  style={{ width: 22, height: 22, padding: 0 }}
                                  onClick={() => handleCopy(`comp-${comp.id}`, passText)}
                                  title="Copy password"
                                >
                                  {copiedId === `comp-${comp.id}` ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Stats Pill Row */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 8,
                              fontSize: "0.75rem",
                              marginBottom: 16
                            }}
                          >
                            <div style={{ background: "var(--bg-surface-elevated)", padding: "8px 10px", borderRadius: "8px" }}>
                              <span style={{ color: "var(--text-muted)", display: "block" }}>Team Logins</span>
                              <strong>{assignedUsers.length} Users</strong>
                            </div>
                            <div style={{ background: "var(--bg-surface-elevated)", padding: "8px 10px", borderRadius: "8px" }}>
                              <span style={{ color: "var(--text-muted)", display: "block" }}>Live Jobs</span>
                              <strong>{jobs.filter((j) => j.companyId === comp.id).length} Requisitions</strong>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="admin-card-footer">
                          {/* Secondary Actions: Brand, Credentials, Suspend */}
                          <div className="admin-card-actions-grid-3">
                            <button
                              type="button"
                              className="btn-card-action btn-card-neutral"
                              onClick={() => handleOpenBranding(comp)}
                              title="Customize organization branding"
                            >
                              <Palette size={13} style={{ color: "var(--primary)" }} />
                              <span>Brand</span>
                            </button>

                            <button
                              type="button"
                              className="btn-card-action btn-card-neutral"
                              onClick={() => handleOpenCredentials("company", comp)}
                              title="Manage admin login credentials"
                            >
                              <Key size={13} style={{ color: "#3b82f6" }} />
                              <span>Pass</span>
                            </button>

                            <button
                              type="button"
                              className={`btn-card-action ${comp.status === "Active" ? "btn-card-suspend" : "btn-card-activate"}`}
                              onClick={() => toggleCompanyStatus(comp.id)}
                              title={comp.status === "Active" ? "Suspend company" : "Activate company"}
                            >
                              {comp.status === "Active" ? <ShieldAlert size={13} /> : <Check size={13} />}
                              <span>{comp.status === "Active" ? "Suspend" : "Activate"}</span>
                            </button>
                          </div>

                          {/* Primary Action: Full-width Portal Access CTA */}
                          <button
                            type="button"
                            className="btn-card-launch-company"
                            onClick={() => {
                              switchCompany(comp.id);
                              setActiveRole("company_admin");
                            }}
                          >
                            <LogIn size={14} />
                            <span>Login to ATS &rarr;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PLACEMENT AGENCIES & HEADHUNTERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "agencies" && (
            <div>
              {/* Filter and Action Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  gap: 14,
                  flexWrap: "wrap"
                }}
              >
                <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 280, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                    <Search
                      size={15}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="text"
                      placeholder="Search agency, city, contact, or email..."
                      className="form-input"
                      style={{ paddingLeft: 36, height: 38 }}
                      value={agencySearch}
                      onChange={(e) => setAgencySearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-select"
                    style={{ width: 140, height: 38 }}
                    value={agencyStatusFilter}
                    onChange={(e) => setAgencyStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    style={{
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #db2777 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 12px rgba(219, 39, 119, 0.3)"
                    }}
                    onClick={() => setIsNewAgencyModalOpen(true)}
                  >
                    <PlusCircle size={15} />
                    <span>Register New Agency</span>
                  </button>
                </div>
              </div>

              {/* Grid of Agency Partner Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                {filteredAgencies.map((agy) => {
                  const passVisible = visiblePasswords[`agy-${agy.id}`];
                  const passText = agy.portalPassword || "Agency#2026Pass!";
                  const isActive = (agy.status || "active").toLowerCase() === "active";

                  return (
                    <div
                      key={agy.id}
                      className="card"
                      style={{
                        background: "var(--bg-surface)",
                        padding: 20,
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        {/* Agency Header */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              className="company-logo-avatar"
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: "12px",
                                background: agy.logoColor || "linear-gradient(135deg, #db2777 0%, #8b5cf6 100%)",
                                color: "#fff",
                                fontWeight: 800,
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              {agy.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <h4 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0 }}>{agy.name}</h4>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                                <span className="badge badge-source-referral" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                                  {agy.tier || "Elite Partner"}
                                </span>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{agy.city}</span>
                              </div>
                            </div>
                          </div>

                          <span className={`badge ${isActive ? "badge-active" : "badge-paused"}`}>
                            {isActive ? "Active" : "Suspended"}
                          </span>
                        </div>

                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                          Specialization: <strong>{agy.specialization || "Distributed Systems & Cloud"}</strong>
                        </p>

                        {/* Agency Portal Credentials Box */}
                        <div
                          style={{
                            background: "var(--bg-surface-elevated)",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            fontSize: "0.775rem",
                            marginBottom: 14,
                            border: "1px solid var(--border-subtle)"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: "#db2777", display: "flex", alignItems: "center", gap: 5 }}>
                              <Key size={12} />
                              <span>Agency Portal Login Pass</span>
                            </span>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: "0.7rem", padding: "1px 6px", height: "auto" }}
                              onClick={() => handleOpenCredentials("agency", agy)}
                            >
                              Edit Pass
                            </button>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ color: "var(--text-muted)" }}>Portal Code / ID:</span>
                            <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{agy.portalCode || agy.id}</span>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ color: "var(--text-muted)" }}>Login Email:</span>
                            <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{agy.email}</span>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "var(--text-muted)" }}>Password:</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                                {passVisible ? passText : "••••••••••••"}
                              </span>
                              <button
                                type="button"
                                className="btn btn-ghost btn-icon btn-sm"
                                style={{ width: 22, height: 22, padding: 0 }}
                                onClick={() => togglePasswordVisibility(`agy-${agy.id}`)}
                                title={passVisible ? "Hide password" : "Show password"}
                              >
                                {passVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-icon btn-sm"
                                style={{ width: 22, height: 22, padding: 0 }}
                                onClick={() => handleCopy(`agy-${agy.id}`, passText)}
                                title="Copy password"
                              >
                                {copiedId === `agy-${agy.id}` ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Performance Grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 8,
                            padding: 10,
                            background: "var(--bg-surface-elevated)",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.775rem",
                            marginBottom: 16
                          }}
                        >
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>Contact: </span>
                            <strong>{agy.primaryContact}</strong>
                          </div>
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>Phone: </span>
                            <strong>{agy.phone}</strong>
                          </div>
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>Submissions: </span>
                            <strong>{agy.candidatesSubmitted || 0}</strong>
                          </div>
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>Placements: </span>
                            <strong style={{ color: "#059669" }}>{agy.placementsHired || 0}</strong>
                          </div>
                          <div style={{ gridColumn: "span 2", paddingTop: 4, borderTop: "1px solid var(--border-subtle)" }}>
                            <span style={{ color: "var(--text-muted)" }}>Commission Rate: </span>
                            <strong style={{ color: "var(--primary)" }}>{agy.commissionTier || "8.33% [1 Month CTC]"}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="admin-card-footer">
                        {/* Secondary Actions: Suspend / Activate & Credentials */}
                        <div className="admin-card-actions-grid">
                          <button
                            type="button"
                            className={`btn-card-action ${isActive ? "btn-card-suspend" : "btn-card-activate"}`}
                            onClick={() => toggleAgencyStatus(agy.id)}
                            title={isActive ? "Suspend agency access" : "Activate agency"}
                          >
                            {isActive ? <ShieldAlert size={13} /> : <Check size={13} />}
                            <span>{isActive ? "Suspend" : "Activate"}</span>
                          </button>

                          <button
                            type="button"
                            className="btn-card-action btn-card-neutral"
                            onClick={() => handleOpenCredentials("agency", agy)}
                            title="Manage agency portal login credentials"
                          >
                            <Key size={13} style={{ color: "#ec4899" }} />
                            <span>Credentials</span>
                          </button>
                        </div>

                        {/* Primary Action: Full-width Portal Access CTA */}
                        <button
                          type="button"
                          className="btn-card-launch-agency"
                          onClick={() => {
                            setSelectedAgencyId(agy.id);
                            setActiveRole("agency_portal");
                          }}
                        >
                          <LogIn size={14} />
                          <span>Login as Agency &rarr;</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COMPANY TEAM LOGINS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "users" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 280, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                    <Search
                      size={15}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="text"
                      placeholder="Search recruiter name, email, or role..."
                      className="form-input"
                      style={{ paddingLeft: 36, height: 38 }}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-select"
                    style={{ width: 200, height: 38 }}
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

                <button className="btn btn-primary btn-sm" onClick={() => setIsNewUserModalOpen(true)}>
                  <PlusCircle size={15} />
                  <span>Add Team Member Login</span>
                </button>
              </div>

              {/* Table of Team Logins */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: "26%" }}>User Name & Details</th>
                        <th style={{ width: "20%" }}>Assigned Company Tenant</th>
                        <th style={{ width: "16%" }}>Access Role</th>
                        <th style={{ width: "14%" }}>Department</th>
                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "14%", textAlign: "right" }}>Revoke</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const targetCompany = companies.find((c) => c.id === user.companyId);

                        return (
                          <tr key={user.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                  className="user-avatar-sm"
                                  style={{ background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)" }}
                                >
                                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                  <span style={{ fontWeight: 700, display: "block" }}>{user.name}</span>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.email}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600 }}>{targetCompany?.name || "Global Tenant"}</span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>
                                {targetCompany?.domain}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  user.role === "Company Admin"
                                    ? "badge-source-agency"
                                    : user.role === "Lead Tech Recruiter"
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: COVER PRESETS & BRANDING */}
          {/* ========================================================================= */}
          {activeTab === "branding" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  Platform Curated Cover Banners & Branding Presets
                </h3>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  High-definition architectural and tech cover banners available across all employer career portals and ATS headers.
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
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>{preset.title}</h4>
                        <span className="badge badge-source-direct">{preset.category}</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6, margin: 0 }}>
                        High-resolution asset optimized for ultra-fast CDN delivery with zero layout shift.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW EMPLOYER ATS COMPANY TENANT (WITH LOGIN PASSWORD) */}
      {/* ========================================================================= */}
      {isNewCompanyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewCompanyModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Building2 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Create New Employer ATS Company</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsNewCompanyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCompany}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Company Legal / Brand Name *</label>
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
                  <label className="form-label">Company Mission / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Next-Gen Consumer Internet & Fast Delivery Runtime"
                    className="form-input"
                    value={newCompanyForm.tagline}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Corporate Domain *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. swiggy.in"
                      className="form-input"
                      value={newCompanyForm.domain}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, domain: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Headquarters Location</label>
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
                    <label className="form-label">Employee Count</label>
                    <input
                      type="text"
                      placeholder="e.g. 250+ Engineers"
                      className="form-input"
                      value={newCompanyForm.employeeCount}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, employeeCount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subscription Plan Tier</label>
                    <select
                      className="form-select"
                      value={newCompanyForm.plan}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, plan: e.target.value })}
                    >
                      <option value="Enterprise Scale Tier">Enterprise Scale Tier</option>
                      <option value="Hypergrowth Tier">Hypergrowth Tier</option>
                      <option value="Startup Scaleup Pro">Startup Scaleup Pro</option>
                    </select>
                  </div>
                </div>

                {/* Primary Admin Credentials Section */}
                <div
                  style={{
                    background: "var(--bg-surface-elevated)",
                    padding: "16px 18px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Lock size={15} color="var(--primary)" />
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--primary)" }}>
                      Primary Company Admin Login Credentials
                    </span>
                  </div>

                  <div className="form-row" style={{ margin: 0 }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem" }}>Admin Contact Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rohit Sharma"
                        className="form-input"
                        value={newCompanyForm.primaryAdminName}
                        onChange={(e) => setNewCompanyForm({ ...newCompanyForm, primaryAdminName: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ flex: 1.2, margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem" }}>Admin Login Email *</label>
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

                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem", margin: 0 }}>Admin Login Password *</label>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: "0.7rem", padding: "1px 6px", height: "auto" }}
                        onClick={() => setNewCompanyForm({ ...newCompanyForm, adminPassword: generateRandomPassword() })}
                      >
                        <RefreshCw size={11} />
                        <span>Generate Password</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swiggy#Tech2026!"
                      className="form-input"
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                      value={newCompanyForm.adminPassword}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, adminPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Cover Banner Preset</label>
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
                  <span>Provision Tenant & Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REGISTER NEW PLACEMENT AGENCY (WITH LOGIN PASSWORD) */}
      {/* ========================================================================= */}
      {isNewAgencyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewAgencyModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <UsersRound size={20} color="#db2777" />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Register Placement Agency Partner</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsNewAgencyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgency}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Agency Commercial Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Careernet Tech Talent, Michael Page India"
                    className="form-input"
                    value={newAgencyForm.name}
                    onChange={(e) => setNewAgencyForm({ ...newAgencyForm, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Short Portal Code / Short ID</label>
                    <input
                      type="text"
                      placeholder="e.g. CAREERNET-BLR-01"
                      className="form-input"
                      value={newAgencyForm.portalCode}
                      onChange={(e) => setNewAgencyForm({ ...newAgencyForm, portalCode: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Headquarters / City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru (Indiranagar)"
                      className="form-input"
                      value={newAgencyForm.city}
                      onChange={(e) => setNewAgencyForm({ ...newAgencyForm, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed Systems & Cloud"
                      className="form-input"
                      value={newAgencyForm.specialization}
                      onChange={(e) => setNewAgencyForm({ ...newAgencyForm, specialization: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Commission Tier</label>
                    <select
                      className="form-select"
                      value={newAgencyForm.commissionTier}
                      onChange={(e) => setNewAgencyForm({ ...newAgencyForm, commissionTier: e.target.value })}
                    >
                      <option value="8.33% (1 Month CTC)">8.33% (1 Month CTC)</option>
                      <option value="10.0% (Executive Track)">10.0% (Executive Track)</option>
                      <option value="12.5% (Niche Scaleups)">12.5% (Niche Scaleups)</option>
                      <option value="Flat ₹1,50,000 / Hire">Flat ₹1,50,000 / Hire</option>
                    </select>
                  </div>
                </div>

                {/* Agency Credentials Section */}
                <div
                  style={{
                    background: "var(--bg-surface-elevated)",
                    padding: "16px 18px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Key size={15} color="#db2777" />
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#db2777" }}>
                      Agency Portal Login Credentials
                    </span>
                  </div>

                  <div className="form-row" style={{ margin: 0 }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem" }}>Primary Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Neha Verma"
                        className="form-input"
                        value={newAgencyForm.primaryContact}
                        onChange={(e) => setNewAgencyForm({ ...newAgencyForm, primaryContact: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ flex: 1.2, margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem" }}>Agency Login Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. neha@careernet.in"
                        className="form-input"
                        value={newAgencyForm.email}
                        onChange={(e) => setNewAgencyForm({ ...newAgencyForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ margin: 0 }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem" }}>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98450 11223"
                        className="form-input"
                        value={newAgencyForm.phone}
                        onChange={(e) => setNewAgencyForm({ ...newAgencyForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ flex: 1.2, margin: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <label className="form-label" style={{ fontSize: "0.775rem", margin: 0 }}>Agency Portal Password *</label>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: "0.7rem", padding: "1px 6px", height: "auto" }}
                          onClick={() => setNewAgencyForm({ ...newAgencyForm, portalPassword: generateRandomPassword() })}
                        >
                          <RefreshCw size={11} />
                          <span>Generate Password</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Agency#2026Pass!"
                        className="form-input"
                        style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                        value={newAgencyForm.portalPassword}
                        onChange={(e) => setNewAgencyForm({ ...newAgencyForm, portalPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewAgencyModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: "linear-gradient(135deg, #db2777 0%, #8b5cf6 100%)", border: "none" }}
                >
                  <PlusCircle size={15} />
                  <span>Register Agency & Activate Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW & EDIT LOGIN CREDENTIALS (PASSWORD / EMAIL) */}
      {/* ========================================================================= */}
      {isCredentialsModalOpen && credentialTarget && (
        <div className="modal-overlay" onClick={() => setIsCredentialsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Key size={18} color="var(--primary)" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  Manage Login Credentials: {credentialTarget.data.name}
                </h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsCredentialsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Login Email ID</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={credentialForm.email}
                    onChange={(e) => setCredentialForm({ ...credentialForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="form-label" style={{ margin: 0 }}>Login Access Password</label>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: "0.7rem", padding: "1px 6px", height: "auto" }}
                      onClick={() => setCredentialForm({ ...credentialForm, password: generateRandomPassword() })}
                    >
                      <RefreshCw size={11} />
                      <span>Generate Password</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                    value={credentialForm.password}
                    onChange={(e) => setCredentialForm({ ...credentialForm, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCredentialsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={15} />
                  <span>Update Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ASSIGN TEAM MEMBER USER LOGIN */}
      {/* ========================================================================= */}
      {isNewUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewUserModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Assign Team Member Login</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsNewUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Target Employer ATS Company *</label>
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
                  <label className="form-label">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    className="form-input"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Corporate Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@company.in"
                      className="form-input"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98450 11223"
                      className="form-input"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Access Role</label>
                    <select
                      className="form-select"
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    >
                      <option value="Company Admin">Company Admin (Full Access)</option>
                      <option value="Lead Tech Recruiter">Lead Tech Recruiter</option>
                      <option value="Technical Interviewer">Technical Interviewer</option>
                      <option value="Hiring Manager">Hiring Manager</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Talent Acquisition"
                      className="form-input"
                      value={newUserForm.department}
                      onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="form-label" style={{ margin: 0 }}>Initial Login Password</label>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: "0.7rem", padding: "1px 6px", height: "auto" }}
                      onClick={() => setNewUserForm({ ...newUserForm, password: generateRandomPassword() })}
                    >
                      <RefreshCw size={11} />
                      <span>Generate Password</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewUserModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Users size={15} />
                  <span>Assign Login Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CUSTOMIZE COMPANY BRANDING & LOGO */}
      {/* ========================================================================= */}
      {isBrandingModalOpen && selectedCompanyForBranding && (
        <div className="modal-overlay" onClick={() => setIsBrandingModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Palette size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  Customize Branding: {selectedCompanyForBranding.name}
                </h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsBrandingModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBranding}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Brand Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={brandingForm.name}
                    onChange={(e) => setBrandingForm({ ...brandingForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandingForm.tagline}
                    onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SVG / Image Logo URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="data:image/svg+xml... or https://..."
                    value={brandingForm.logoUrl}
                    onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Primary Brand Color</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="color"
                        style={{ width: 42, height: 38, padding: 0, border: "none", borderRadius: 6, cursor: "pointer" }}
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
                    <label className="form-label">Accent Color</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="color"
                        style={{ width: 42, height: 38, padding: 0, border: "none", borderRadius: 6, cursor: "pointer" }}
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

                <div className="form-group">
                  <label className="form-label">Cover Banner Preset</label>
                  <select
                    className="form-select"
                    value={brandingForm.coverImage}
                    onChange={(e) => setBrandingForm({ ...brandingForm, coverImage: e.target.value })}
                  >
                    {coverPresets.map((p) => (
                      <option key={p.id} value={p.url}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsBrandingModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={15} />
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
