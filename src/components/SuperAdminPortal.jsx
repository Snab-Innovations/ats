import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAts } from "../context/AtsContext";
import { getCompanySlug } from "../utils/companySlug";
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
  RefreshCw,
  Database,
  Server,
  HardDrive,
  Terminal,
  CheckCheck,
  Cloud,
  AlertTriangle,
  Upload,
  Image
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
    coverPresets,
    // Cloud Database & Storage (Supabase + Cloudflare R2)
    dbConfig,
    isDbConnected,
    dbStatus,
    isSyncing,
    connectSupabase,
    disconnectSupabase,
    syncFromSupabase,
    uploadImageToCloudinary
  } = useAts();

  const { tab } = useParams();
  const navigate = useNavigate();

  const getTabFromParam = (p) => {
    if (!p) return "overview";
    if (p === "tenants" || p === "companies") return "companies";
    if (p === "database" || p === "storage" || p === "postgres" || p === "db") return "database";
    if (p === "agencies") return "agencies";
    if (p === "users" || p === "logins") return "users";
    if (p === "branding" || p === "theme") return "branding";
    return p;
  };

  const [activeTab, setActiveTabState] = useState(() => getTabFromParam(tab));

  useEffect(() => {
    if (tab) {
      const normalized = getTabFromParam(tab);
      if (normalized !== activeTab) {
        setActiveTabState(normalized);
      }
    } else if (activeTab !== "overview") {
      setActiveTabState("overview");
    }
  }, [tab]);

  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    const slug = newTab === "overview" ? "" : newTab;
    navigate(slug ? `/super-admin/${slug}` : "/super-admin");
  };
  const [companySearch, setCompanySearch] = useState("");
  const [companyStatusFilter, setCompanyStatusFilter] = useState("all");
  const [agencySearch, setAgencySearch] = useState("");
  const [agencyStatusFilter, setAgencyStatusFilter] = useState("all");
  const [userCompanyFilter, setUserCompanyFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  // Cloud Database Form States
  const [dbInputUrl, setDbInputUrl] = useState(dbConfig?.url || "");
  const [dbInputKey, setDbInputKey] = useState(dbConfig?.anonKey || "");
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbFeedback, setDbFeedback] = useState(null);
  const [isSchemaCopied, setIsSchemaCopied] = useState(false);

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
  const [credentialForm, setCredentialForm] = useState({ email: "", portalCode: "", password: "" });

  // Revoke User Confirmation Modal State
  const [userToRevoke, setUserToRevoke] = useState(null);
  const [revokeFeedback, setRevokeFeedback] = useState(null);

  // Delete Confirmation Modal States (Tenants & Agencies)
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [agencyToDelete, setAgencyToDelete] = useState(null);
  const [deleteFeedback, setDeleteFeedback] = useState(null);

  const handleConfirmDeleteCompany = () => {
    if (!companyToDelete) return;
    const name = companyToDelete.name;
    removeCompanyTenant(companyToDelete.id);
    setCompanyToDelete(null);
    setDeleteFeedback(`Employer ATS Tenant "${name}" and all associated jobs and candidates have been deleted.`);
    setTimeout(() => setDeleteFeedback(null), 5000);
  };

  const handleConfirmDeleteAgency = () => {
    if (!agencyToDelete) return;
    const name = agencyToDelete.name;
    removeAgency(agencyToDelete.id);
    setAgencyToDelete(null);
    setDeleteFeedback(`Placement Agency "${name}" has been permanently removed.`);
    setTimeout(() => setDeleteFeedback(null), 5000);
  };

  // Generate strong random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // New Company Form State
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    domain: "",
    primaryAdmin: "",
    primaryAdminName: "",
    adminPassword: "Company#2026!",
    headquarters: "Bengaluru, India",
    plan: "Enterprise Scale Tier",
    employeeCount: "50-250 Builders",
    tagline: "",
    brandColor: "#4f46e5",
    accentColor: "#0284c7",
    logoUrl: "",
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
    tier: "Elite Partner",
    logoUrl: "",
    coverImage: ""
  });

  // Uploading states for direct Cloudinary upload
  const [isUploadingCompanyLogo, setIsUploadingCompanyLogo] = useState(false);
  const [isUploadingCompanyCover, setIsUploadingCompanyCover] = useState(false);
  const [isUploadingAgencyLogo, setIsUploadingAgencyLogo] = useState(false);
  const [isUploadingAgencyCover, setIsUploadingAgencyCover] = useState(false);
  const [isUploadingBrandingLogo, setIsUploadingBrandingLogo] = useState(false);
  const [isUploadingBrandingCover, setIsUploadingBrandingCover] = useState(false);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    companyId: companies[0]?.id || "comp-mu5rn6mu",
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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Credentials Modal
  const handleOpenCredentials = (type, item) => {
    setCredentialTarget({ type, data: item });
    setCredentialForm({
      email: type === "company" ? item.primaryAdmin || "" : item.email || "",
      portalCode: type === "agency" ? item.portalCode || "" : "",
      password: type === "company" ? item.adminPassword || "Company#2026!" : item.portalPassword || "Agency#2026!"
    });
    setIsCredentialsModalOpen(true);
  };

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    if (!credentialTarget) return;

    if (credentialTarget.type === "company") {
      updateCompanyCredentials(credentialTarget.data.id, {
        primaryAdmin: credentialForm.email.trim(),
        adminPassword: credentialForm.password.trim()
      });
    } else {
      updateAgency(credentialTarget.data.id, {
        email: credentialForm.email.trim(),
        portalCode: credentialForm.portalCode ? credentialForm.portalCode.trim().toUpperCase() : credentialTarget.data.portalCode,
        portalPassword: credentialForm.password.trim()
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

  const handleCompanyLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCompanyLogo(true);
    try {
      const res = await uploadImageToCloudinary(file);
      if (res?.success && res.url) {
        setNewCompanyForm((prev) => ({ ...prev, logoUrl: res.url }));
      }
    } finally {
      setIsUploadingCompanyLogo(false);
      e.target.value = "";
    }
  };

  const handleCompanyCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCompanyCover(true);
    try {
      const res = await uploadImageToCloudinary(file);
      if (res?.success && res.url) {
        setNewCompanyForm((prev) => ({ ...prev, coverImage: res.url }));
      }
    } finally {
      setIsUploadingCompanyCover(false);
      e.target.value = "";
    }
  };

  const handleAgencyLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAgencyLogo(true);
    try {
      const res = await uploadImageToCloudinary(file);
      if (res?.success && res.url) {
        setNewAgencyForm((prev) => ({ ...prev, logoUrl: res.url }));
      }
    } finally {
      setIsUploadingAgencyLogo(false);
      e.target.value = "";
    }
  };

  const handleAgencyCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAgencyCover(true);
    try {
      const res = await uploadImageToCloudinary(file);
      if (res?.success && res.url) {
        setNewAgencyForm((prev) => ({ ...prev, coverImage: res.url }));
      }
    } finally {
      setIsUploadingAgencyCover(false);
      e.target.value = "";
    }
  };

  const handleBrandingLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBrandingLogo(true);
    try {
      const res = await uploadImageToCloudinary(file);
      if (res?.success && res.url) {
        setBrandingForm((prev) => ({ ...prev, logoUrl: res.url }));
      }
    } finally {
      setIsUploadingBrandingLogo(false);
      e.target.value = "";
    }
  };

  const handleBrandingCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBrandingCover(true);
    try {
      const res = await uploadImageToCloudinary(file);
      if (res?.success && res.url) {
        setBrandingForm((prev) => ({ ...prev, coverImage: res.url }));
      }
    } finally {
      setIsUploadingBrandingCover(false);
      e.target.value = "";
    }
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
      logoUrl: "",
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
      tier: "Elite Partner",
      logoUrl: "",
      coverImage: ""
    });
    setActiveTab("agencies");
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;
    addCompanyUser(newUserForm);
    setIsNewUserModalOpen(false);
    setNewUserForm({
      companyId: companies[0]?.id || "comp-mu5rn6mu",
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

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "overview":
        return {
          title: "Platform Overview",
          subtitle: "Global multi-tenant metrics, enterprise organizations, and candidate pipeline throughput",
          actions: (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsNewAgencyModalOpen(true)}
              >
                <UsersRound size={14} />
                <span>Register Agency</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ background: "#4f46e5" }}
                onClick={() => setIsNewCompanyModalOpen(true)}
              >
                <PlusCircle size={15} />
                <span>Create Company Tenant</span>
              </button>
            </div>
          )
        };
      case "companies":
        return {
          title: "Employer ATS Tenants",
          subtitle: `${companies.length} corporate workspaces provisioned with independent applicant tracking environments`,
          actions: (
            <button
              className="btn btn-primary btn-sm"
              style={{ background: "#4f46e5" }}
              onClick={() => setIsNewCompanyModalOpen(true)}
            >
              <PlusCircle size={15} />
              <span>Create Company Tenant</span>
            </button>
          )
        };
      case "agencies":
        return {
          title: "Placement Agencies",
          subtitle: `${agencies.length} authorized recruitment consultancies and search partners with direct ATS mandate syndication`,
          actions: (
            <button
              className="btn btn-primary btn-sm"
              style={{ background: "#4f46e5" }}
              onClick={() => setIsNewAgencyModalOpen(true)}
            >
              <PlusCircle size={15} />
              <span>Register Agency</span>
            </button>
          )
        };
      case "users":
        return {
          title: "Company Team Logins",
          subtitle: `${companyUsers.length} authorized corporate hiring managers and recruiters across workspaces`,
          actions: (
            <button
              className="btn btn-primary btn-sm"
              style={{ background: "#4f46e5" }}
              onClick={() => setIsNewUserModalOpen(true)}
            >
              <PlusCircle size={15} />
              <span>Add Team User</span>
            </button>
          )
        };
      case "branding":
        return {
          title: "Cover Presets & Branding",
          subtitle: "Curated aesthetic themes, employer brand headers, and public career portal cover configurations",
          actions: null
        };
      case "database":
        return {
          title: "PostgreSQL & Cloud Infrastructure",
          subtitle: isDbConnected
            ? "Connected to live Supabase PostgreSQL database and Cloudinary storage"
            : "Running in local browser storage mode — connect Supabase for cross-device persistence",
          actions: (
            <span
              style={{
                fontSize: "0.75rem",
                padding: "4px 10px",
                borderRadius: "12px",
                background: isDbConnected ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                color: isDbConnected ? "#059669" : "#d97706",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: isDbConnected ? "#10b981" : "#f59e0b"
                }}
              />
              {isDbConnected ? "Database Live" : "Local Storage Mode"}
            </span>
          )
        };
      default:
        return {
          title: "Platform Administration",
          subtitle: "Multi-tenant engine & workspace management",
          actions: null
        };
    }
  };

  const headerInfo = getHeaderInfo();

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
        {/* Dynamic Context Header */}
        <header
          className="page-header"
          style={{
            padding: "20px 32px",
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
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
              {headerInfo.title}
            </h1>
            <p style={{ marginTop: 3, fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
              {headerInfo.subtitle}
            </p>
          </div>

          {headerInfo.actions && (
            <div className="header-actions">
              {headerInfo.actions}
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <div className="page-content" style={{ padding: "28px 32px 60px" }}>
          {/* TAB 1: PLATFORM OVERVIEW & GLOBAL DASHBOARD */}
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

                <div className="kpi-card" onClick={() => setActiveTab("agencies")} style={{ cursor: "pointer" }}>
                  <div className="kpi-header">
                    <span className="kpi-title">Placement Agencies</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7" }}>
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
                            background: "rgba(79, 70, 229, 0.1)",
                            color: "#4f46e5",
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
                        Connect staffing consultancy, issue unique agency portal code, commission tier, and set agency access.
                      </p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        background: "#4f46e5",
                        fontWeight: 700
                      }}
                      onClick={() => setIsNewAgencyModalOpen(true)}
                    >
                      <PlusCircle size={14} />
                      <span>Register Agency & Activate</span>
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
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  style={{ color: "#ef4444", padding: "4px 6px", height: "auto" }}
                                  onClick={() => setCompanyToDelete(comp)}
                                  title="Delete Employer ATS Tenant"
                                >
                                  <Trash2 size={13} />
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
              {deleteFeedback && (
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    color: "#059669",
                    fontSize: "0.825rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={16} />
                    <span>{deleteFeedback}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "2px 6px", height: "auto", color: "#059669" }}
                    onClick={() => setDeleteFeedback(null)}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

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
                          {/* Secondary Actions: Brand, Credentials, Suspend & Delete */}
                          <div className="admin-card-actions-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
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

                            <button
                              type="button"
                              className="btn-card-action"
                              style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.25)" }}
                              onClick={() => setCompanyToDelete(comp)}
                              title="Delete Employer ATS Tenant"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
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

                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              marginTop: 6,
                              fontSize: "0.75rem",
                              gap: 6,
                              color: "var(--text-secondary)",
                              border: "1px solid var(--border-subtle)",
                              borderRadius: "var(--radius-sm)"
                            }}
                            onClick={() => {
                              switchCompany(comp.id);
                              navigate(`/career-site/${getCompanySlug(comp)}`);
                            }}
                            title={`Open ${comp.name} Public Career Site (/career-site/${getCompanySlug(comp)})`}
                          >
                            <Globe size={13} color="var(--primary)" />
                            <span>View Career Site (/{getCompanySlug(comp)}-careers)</span>
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
              {deleteFeedback && (
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    color: "#059669",
                    fontSize: "0.825rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={16} />
                    <span>{deleteFeedback}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "2px 6px", height: "auto", color: "#059669" }}
                    onClick={() => setDeleteFeedback(null)}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

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
                      background: "#4f46e5"
                    }}
                    onClick={() => setIsNewAgencyModalOpen(true)}
                  >
                    <PlusCircle size={15} />
                    <span>Register New Agency</span>
                  </button>
                </div>
              </div>

              {/* Grid of Agency Partner Cards */}
              {filteredAgencies.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 24px",
                    background: "var(--bg-surface)",
                    borderRadius: "14px",
                    border: "1px dashed var(--border-medium)"
                  }}
                >
                  <UsersRound size={42} style={{ color: "var(--text-muted)", margin: "0 auto 12px", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 6px" }}>No Placement Agencies Registered</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 16px" }}>
                    Registered recruitment agencies will appear here with dedicated portal access and fee management.
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: "#4f46e5", fontWeight: 700 }}
                    onClick={() => setIsNewAgencyModalOpen(true)}
                  >
                    <PlusCircle size={15} />
                    <span>Register Agency</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                  {filteredAgencies.map((agy) => {
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
                                borderRadius: "10px",
                                background: "rgba(79, 70, 229, 0.08)",
                                border: "1px solid rgba(79, 70, 229, 0.2)",
                                color: "#4f46e5",
                                fontWeight: 800,
                                fontSize: "0.95rem",
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

                        {/* Partner Portal Access Box */}
                        <div
                          style={{
                            background: "var(--bg-surface-elevated)",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            fontSize: "0.775rem",
                            marginBottom: 14,
                            border: "1px solid var(--border-subtle)"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 5 }}>
                              <ShieldCheck size={13} color="#4f46e5" />
                              <span>Partner Portal Access</span>
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 600 }}>Active License</span>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ color: "var(--text-muted)" }}>Portal ID:</span>
                            <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{agy.portalCode || agy.id}</span>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-muted)" }}>Authorized Contact:</span>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{agy.email}</span>
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
                        {/* Secondary Actions: Suspend / Activate, Credentials & Delete */}
                        <div className="admin-card-actions-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
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
                            <Key size={13} style={{ color: "var(--text-secondary)" }} />
                            <span>Credentials</span>
                          </button>

                          <button
                            type="button"
                            className="btn-card-action"
                            style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.25)" }}
                            onClick={() => setAgencyToDelete(agy)}
                            title="Delete placement agency partner"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
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
            )}
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

              {/* Feedback Banner */}
              {revokeFeedback && (
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#059669",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16
                  }}
                >
                  <span>{revokeFeedback}</span>
                  <button
                    type="button"
                    onClick={() => setRevokeFeedback(null)}
                    style={{ color: "inherit", cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

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
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-secondary)" }}>
                            <Users size={36} style={{ color: "var(--text-muted)", margin: "0 auto 10px", opacity: 0.5 }} />
                            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>No Team Logins Configured</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                              Click "Add Team Member Login" to provision credentials for a recruiter or hiring manager.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => {
                        const targetCompany = companies.find((c) => c.id === user.companyId);

                        return (
                          <tr key={user.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                  className="user-avatar-sm"
                                  style={{ background: "#4f46e5" }}
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
                                className="badge"
                                style={
                                  user.role === "Company Admin"
                                    ? {
                                        background: "rgba(79, 70, 229, 0.08)",
                                        color: "#4f46e5",
                                        border: "1px solid rgba(79, 70, 229, 0.2)",
                                        borderRadius: 12,
                                        padding: "2px 8px",
                                        fontSize: "0.725rem",
                                        fontWeight: 600
                                      }
                                    : user.role === "Lead Tech Recruiter"
                                    ? {
                                        background: "rgba(2, 132, 199, 0.08)",
                                        color: "#0284c7",
                                        border: "1px solid rgba(2, 132, 199, 0.2)",
                                        borderRadius: 12,
                                        padding: "2px 8px",
                                        fontSize: "0.725rem",
                                        fontWeight: 600
                                      }
                                    : {
                                        background: "rgba(16, 185, 129, 0.08)",
                                        color: "#059669",
                                        border: "1px solid rgba(16, 185, 129, 0.2)",
                                        borderRadius: 12,
                                        padding: "2px 8px",
                                        fontSize: "0.725rem",
                                        fontWeight: 600
                                      }
                                }
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
                                type="button"
                                className="btn btn-ghost btn-sm btn-icon"
                                style={{ color: "#dc2626" }}
                                onClick={() => setUserToRevoke(user)}
                                title="Revoke User Access"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      }))}
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

          {/* ========================================================================= */}
          {/* TAB 6: CLOUD INFRASTRUCTURE (SUPABASE POSTGRESQL + CLOUDFLARE R2) */}
          {/* ========================================================================= */}
          {activeTab === "database" && (
            <div>
              {/* Header Info */}
              <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <Database size={20} color="var(--primary)" />
                    <span>Cloud PostgreSQL & Cloudflare R2 Infrastructure</span>
                  </h3>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: 4, margin: 0 }}>
                    Scalable multi-tenant architecture designed to handle 1,000+ companies, 1,000,000+ candidate records, and zero-egress resume storage.
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={syncFromSupabase}
                    disabled={isSyncing}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <RefreshCw size={13} className={isSyncing ? "spin" : ""} />
                    <span>{isSyncing ? "Syncing PostgreSQL..." : "Sync Live DB"}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className="card"
                style={{
                  background: isDbConnected ? "rgba(16, 185, 129, 0.05)" : "rgba(245, 158, 11, 0.05)",
                  border: isDbConnected ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                  padding: "16px 20px",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: isDbConnected ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                      color: isDbConnected ? "#059669" : "#d97706",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <Server size={20} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>
                        {isDbConnected ? "Live Supabase PostgreSQL Connected" : "Local Storage Engine (Ready to Connect Live DB)"}
                      </h4>
                      <span
                        className={`badge ${isDbConnected ? "badge-active" : "badge-paused"}`}
                        style={{ fontSize: "0.7rem", padding: "2px 8px" }}
                      >
                        {isDbConnected ? "LIVE CLOUD" : "LOCAL FALLBACK"}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)", margin: 0, marginTop: 4 }}>
                      {dbStatus.message}
                    </p>
                  </div>
                </div>

                {dbStatus.lastSynced && (
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    Last Synced: {dbStatus.lastSynced}
                  </div>
                )}
              </div>

              {/* 2-Column Grid: DB Settings & Storage */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20, marginBottom: 24 }}>
                {/* Column 1: Supabase Credentials */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Terminal size={17} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>Supabase PostgreSQL Credentials</h4>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Supabase Dashboard &rarr; Project Settings &rarr; API</span>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsTestingDb(true);
                      setDbFeedback(null);
                      await connectSupabase(dbInputUrl, dbInputKey);
                      setIsTestingDb(false);
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: 14 }}
                  >
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.775rem" }}>
                        Supabase Project URL *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://xyzcompany.supabase.co"
                        className="form-input"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
                        value={dbInputUrl}
                        onChange={(e) => setDbInputUrl(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.775rem" }}>
                        Supabase Anonymous Public API Key *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="form-input"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
                        value={dbInputKey}
                        onChange={(e) => setDbInputKey(e.target.value)}
                      />
                    </div>

                    {dbFeedback && (
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "0.775rem",
                          background: dbFeedback.success ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          color: dbFeedback.success ? "#059669" : "#dc2626",
                          border: dbFeedback.success ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)"
                        }}
                      >
                        {dbFeedback.message}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={isTestingDb}
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          background: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
                          fontWeight: 700
                        }}
                      >
                        <Zap size={14} />
                        <span>{isTestingDb ? "Connecting..." : "Test & Connect Live"}</span>
                      </button>

                      {isDbConnected && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            disconnectSupabase();
                            setDbInputUrl("");
                            setDbInputKey("");
                          }}
                          style={{ fontSize: "0.75rem", color: "#dc2626" }}
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Column 2: Cloud Storage (Cloud Name: ljelkpy4, Preset: resumes) */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <HardDrive size={17} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>Cloud Document & Resume Storage</h4>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Direct CDN upload for candidate PDF / DOCX resumes</span>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                      Active & Live
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <div style={{ background: "var(--bg-surface-elevated)", padding: 12, borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "var(--text-muted)" }}>Cloud Name:</span>
                        <strong style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>ljelkpy4</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "var(--text-muted)" }}>Upload Preset:</span>
                        <strong style={{ fontFamily: "var(--font-mono)", color: "#059669" }}>resumes</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "var(--text-muted)" }}>Delivery Protocol:</span>
                        <strong>Global HTTPS CDN</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Database Sync:</span>
                        <strong style={{ color: "#059669" }}>Auto-linked to candidates table</strong>
                      </div>
                    </div>

                    <div style={{ padding: "10px 12px", background: "rgba(16, 185, 129, 0.06)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <strong style={{ color: "#059669", display: "block", marginBottom: 4 }}>How It Works in Production</strong>
                      <span>
                        When applicants submit resumes on the career site or unified platform, files are uploaded directly to cloud name <strong>ljelkpy4</strong> using preset <strong>resumes</strong>. The permanent secure HTTPS link is stored into your live Supabase database with zero local disk usage.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card: 1-Click PostgreSQL Schema SQL */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <Cloud size={18} color="var(--primary)" />
                      <span>PostgreSQL Multi-Tenant Schema Setup (schema.sql)</span>
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Pre-configured with multi-tenant tables, UUID indexes, storage buckets, and starter tenant data.
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const sqlContent = `-- EXPERTHIRE ATS: POSTGRESQL SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    headquarters VARCHAR(255) DEFAULT 'Bengaluru, India',
    city VARCHAR(100) DEFAULT 'Bengaluru',
    tagline TEXT,
    brand_color VARCHAR(30) DEFAULT '#4f46e5',
    accent_color VARCHAR(30) DEFAULT '#06b6d4',
    logo_url TEXT,
    logo_initials VARCHAR(10) DEFAULT 'CO',
    cover_banner_url TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    plan VARCHAR(100) DEFAULT 'Enterprise Scale Tier',
    primary_admin VARCHAR(255) NOT NULL,
    admin_password TEXT DEFAULT 'Company#2026!',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_users (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Lead Tech Recruiter',
    department VARCHAR(100) DEFAULT 'Engineering',
    status VARCHAR(50) DEFAULT 'Active',
    last_login VARCHAR(100) DEFAULT 'Just Now'
);

CREATE TABLE IF NOT EXISTS agencies (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    portal_code VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) DEFAULT 'Bengaluru',
    tier VARCHAR(100) DEFAULT 'Elite Partner',
    primary_contact VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    specialization VARCHAR(255) DEFAULT 'Distributed Systems & Cloud',
    commission_tier VARCHAR(100) DEFAULT '8.33% [1 Month CTC]',
    status VARCHAR(50) DEFAULT 'active',
    portal_password TEXT DEFAULT 'Agency#2026!',
    candidates_submitted INTEGER DEFAULT 0,
    placements_hired INTEGER DEFAULT 0,
    bounties_claimed NUMERIC(12, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Full-time',
    format VARCHAR(50) DEFAULT 'In-Office',
    experience VARCHAR(50) DEFAULT '3-5 Yrs',
    education VARCHAR(100) DEFAULT 'B.Tech / B.E.',
    ctc_range VARCHAR(100) DEFAULT '₹25 - ₹40 LPA',
    status VARCHAR(50) DEFAULT 'active',
    bounty VARCHAR(100) DEFAULT '₹1.5 Lakhs',
    commission_rate VARCHAR(50) DEFAULT '8.5%',
    agency_dispatched BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    job_id TEXT REFERENCES jobs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    current_company VARCHAR(255),
    experience VARCHAR(50) DEFAULT '0 Yrs',
    current_ctc VARCHAR(50) DEFAULT '₹0 LPA',
    expected_ctc VARCHAR(50) DEFAULT '₹0 LPA',
    notice_period VARCHAR(50) DEFAULT '30 Days',
    education VARCHAR(100),
    college VARCHAR(255),
    skills JSONB DEFAULT '[]'::jsonb,
    stage VARCHAR(50) DEFAULT 'applied',
    source VARCHAR(50) DEFAULT 'direct',
    agency_id TEXT REFERENCES agencies(id) ON DELETE SET NULL,
    resume_url TEXT,
    resume_file_name VARCHAR(255),
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RESUME STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Read Resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Allow Public Resume Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- SEED STARTER TENANTS
INSERT INTO companies (id, name, domain, headquarters, status, plan, primary_admin, admin_password)
VALUES 
('comp-bharat-101', 'BharatScale Cloud', 'bharatscale.in', 'Bengaluru', 'Active', 'Enterprise Scale Tier', 'vikram@bharatscale.in', 'BharatScale#2026!'),
('comp-zepto-102', 'ZeptoLabs India', 'zeptolabs.in', 'Bengaluru', 'Active', 'Hypergrowth Tier', 'hr@zeptolabs.in', 'Zepto#2026!'),
('comp-razor-103', 'Razorpay Infra', 'razorinfra.com', 'Bengaluru', 'Active', 'Enterprise Scale Tier', 'talent@razorinfra.com', 'Razor#2026!')
ON CONFLICT (id) DO NOTHING;`;

                      navigator.clipboard.writeText(sqlContent);
                      setIsSchemaCopied(true);
                      setTimeout(() => setIsSchemaCopied(false), 3000);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: isSchemaCopied ? "#059669" : "var(--primary)"
                    }}
                  >
                    {isSchemaCopied ? <CheckCheck size={14} /> : <Copy size={14} />}
                    <span>{isSchemaCopied ? "Schema SQL Copied!" : "Copy Full schema.sql"}</span>
                  </button>
                </div>

                {/* 3 Steps Guide */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: "12px 14px", background: "var(--bg-surface-elevated)", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.775rem" }}>
                    <strong style={{ color: "var(--primary)", display: "block", marginBottom: 3 }}>Step 1: Open SQL Editor</strong>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Go to your Supabase project dashboard and click on <strong>SQL Editor</strong> in the left menu.
                    </span>
                  </div>
                  <div style={{ padding: "12px 14px", background: "var(--bg-surface-elevated)", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.775rem" }}>
                    <strong style={{ color: "var(--primary)", display: "block", marginBottom: 3 }}>Step 2: Paste & Click Run</strong>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Click <strong>New Query</strong>, paste the copied SQL schema, and hit <strong>Run</strong> (takes 2 seconds).
                    </span>
                  </div>
                  <div style={{ padding: "12px 14px", background: "var(--bg-surface-elevated)", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.775rem" }}>
                    <strong style={{ color: "var(--primary)", display: "block", marginBottom: 3 }}>Step 3: Paste Keys Above</strong>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Copy your Project URL & Anon Key into the form above and click <strong>Test & Connect Live</strong>!
                    </span>
                  </div>
                </div>

                {/* Schema Code Preview */}
                <pre
                  style={{
                    margin: 0,
                    padding: 14,
                    background: "#0f172a",
                    color: "#38bdf8",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.725rem",
                    borderRadius: "8px",
                    overflowX: "auto",
                    maxHeight: 200,
                    lineHeight: 1.5
                  }}
                >
{`-- Quick Schema Excerpt:
CREATE TABLE companies (id TEXT PRIMARY KEY, name VARCHAR(255), domain VARCHAR(255) UNIQUE, ...);
CREATE TABLE jobs (id TEXT PRIMARY KEY, company_id TEXT REFERENCES companies(id), title VARCHAR(255), ...);
CREATE TABLE candidates (id TEXT PRIMARY KEY, company_id TEXT REFERENCES companies(id), name VARCHAR(255), ...);
CREATE TABLE agencies (id TEXT PRIMARY KEY, name VARCHAR(255), portal_code VARCHAR(100) UNIQUE, ...);
-- Full script with indexes, storage bucket & initial seed is copied with 1 click above!`}
                </pre>
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

                {/* Brand Visuals & Media (Cloudinary Upload) */}
                <div
                  style={{
                    background: "var(--bg-surface-elevated)",
                    padding: "16px 18px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Sparkles size={16} color="var(--primary)" />
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--primary)" }}>
                        Brand Visual Assets (Direct Cloudinary Upload)
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "3px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "#059669",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <Cloud size={11} /> Cloudinary CDN
                    </span>
                  </div>

                  {/* Company Logo Upload Section */}
                  <div>
                    <label className="form-label" style={{ fontSize: "0.775rem", marginBottom: 6 }}>
                      Company Brand Logo
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 12,
                          border: "1.5px dashed var(--border-subtle)",
                          background: "var(--bg-surface)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0
                        }}
                      >
                        {newCompanyForm.logoUrl ? (
                          <img
                            src={newCompanyForm.logoUrl}
                            alt="Logo Preview"
                            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                          />
                        ) : (
                          <Building2 size={22} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                        )}
                      </div>

                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <label
                            className="btn btn-secondary btn-sm"
                            style={{
                              cursor: isUploadingCompanyLogo ? "not-allowed" : "pointer",
                              fontSize: "0.75rem",
                              padding: "6px 12px",
                              opacity: isUploadingCompanyLogo ? 0.7 : 1
                            }}
                          >
                            {isUploadingCompanyLogo ? (
                              <>
                                <RefreshCw size={13} className="spin" />
                                <span>Uploading to Cloudinary...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={13} />
                                <span>Upload Logo File</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              disabled={isUploadingCompanyLogo}
                              onChange={handleCompanyLogoUpload}
                            />
                          </label>

                          {newCompanyForm.logoUrl && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: "0.72rem", color: "#ef4444", padding: "4px 8px" }}
                              onClick={() => setNewCompanyForm({ ...newCompanyForm, logoUrl: "" })}
                            >
                              <X size={12} /> Remove
                            </button>
                          )}

                          {newCompanyForm.logoUrl && (
                            <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                              <CheckCircle size={13} /> Cloudinary Saved
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          Upload SVG, PNG, JPG, or WebP. Automatically stored in Cloudinary cloud storage.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Cover Page / Banner Upload Section */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem", margin: 0 }}>
                        Cover Page Banner (Hero Header)
                      </label>
                      <label
                        className="btn btn-ghost btn-sm"
                        style={{
                          cursor: isUploadingCompanyCover ? "not-allowed" : "pointer",
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          color: "var(--primary)",
                          fontWeight: 700
                        }}
                      >
                        {isUploadingCompanyCover ? (
                          <>
                            <RefreshCw size={12} className="spin" />
                            <span>Uploading Banner...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={12} />
                            <span>Upload Custom Banner</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={isUploadingCompanyCover}
                          onChange={handleCompanyCoverUpload}
                        />
                      </label>
                    </div>

                    {/* Live Banner Preview */}
                    {newCompanyForm.coverImage && (
                      <div
                        style={{
                          width: "100%",
                          height: 80,
                          borderRadius: 10,
                          overflow: "hidden",
                          position: "relative",
                          marginBottom: 8,
                          border: "1px solid var(--border-subtle)"
                        }}
                      >
                        <img
                          src={newCompanyForm.coverImage}
                          alt="Banner Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 6,
                            right: 8,
                            background: "rgba(0,0,0,0.65)",
                            backdropFilter: "blur(6px)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.68rem",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <Cloud size={10} /> Active Banner
                        </div>
                      </div>
                    )}

                    {/* Presets dropdown */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select
                        className="form-select"
                        style={{ fontSize: "0.775rem" }}
                        value={newCompanyForm.coverImage}
                        onChange={(e) => setNewCompanyForm({ ...newCompanyForm, coverImage: e.target.value })}
                      >
                        <option value="">-- Or Select from Curated Presets --</option>
                        {coverPresets.map((p) => (
                          <option key={p.id} value={p.url}>
                            {p.title} ({p.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
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
                <UsersRound size={20} color="#4f46e5" />
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
                    <Key size={15} color="#4f46e5" />
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#4f46e5" }}>
                      Agency Portal Login Credentials
                    </span>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "0.775rem" }}>Agency Portal ID / Code (Optional - auto-generated if left blank)</label>
                    <input
                      type="text"
                      placeholder="e.g. CAREERNET-TECH-BLR"
                      className="form-input"
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}
                      value={newAgencyForm.portalCode}
                      onChange={(e) => setNewAgencyForm({ ...newAgencyForm, portalCode: e.target.value.toUpperCase() })}
                    />
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

                {/* Agency Brand & Visual Assets (Direct Cloudinary Upload) */}
                <div
                  style={{
                    background: "var(--bg-surface-elevated)",
                    padding: "16px 18px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Sparkles size={16} color="#4f46e5" />
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#4f46e5" }}>
                        Agency Brand & Visual Assets (Direct Cloudinary Upload)
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "3px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(79, 70, 229, 0.12)",
                        color: "#4f46e5",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <Cloud size={11} /> Cloudinary CDN
                    </span>
                  </div>

                  {/* Agency Logo */}
                  <div>
                    <label className="form-label" style={{ fontSize: "0.775rem", marginBottom: 6 }}>
                      Agency Brand Logo / Emblem
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 12,
                          border: "1.5px dashed var(--border-subtle)",
                          background: "var(--bg-surface)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0
                        }}
                      >
                        {newAgencyForm.logoUrl ? (
                          <img
                            src={newAgencyForm.logoUrl}
                            alt="Agency Logo Preview"
                            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                          />
                        ) : (
                          <UsersRound size={20} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                        )}
                      </div>

                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <label
                            className="btn btn-secondary btn-sm"
                            style={{
                              cursor: isUploadingAgencyLogo ? "not-allowed" : "pointer",
                              fontSize: "0.75rem",
                              padding: "6px 12px",
                              opacity: isUploadingAgencyLogo ? 0.7 : 1
                            }}
                          >
                            {isUploadingAgencyLogo ? (
                              <>
                                <RefreshCw size={13} className="spin" />
                                <span>Uploading to Cloudinary...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={13} />
                                <span>Upload Logo File</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              disabled={isUploadingAgencyLogo}
                              onChange={handleAgencyLogoUpload}
                            />
                          </label>

                          {newAgencyForm.logoUrl && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: "0.72rem", color: "#ef4444", padding: "4px 8px" }}
                              onClick={() => setNewAgencyForm({ ...newAgencyForm, logoUrl: "" })}
                            >
                              <X size={12} /> Remove
                            </button>
                          )}

                          {newAgencyForm.logoUrl && (
                            <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                              <CheckCircle size={13} /> Cloudinary Saved
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          Upload SVG, PNG, JPG, or WebP format.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agency Cover Banner */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="form-label" style={{ fontSize: "0.775rem", margin: 0 }}>
                        Agency Cover Page Banner
                      </label>
                      <label
                        className="btn btn-ghost btn-sm"
                        style={{
                          cursor: isUploadingAgencyCover ? "not-allowed" : "pointer",
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          color: "#4f46e5",
                          fontWeight: 700
                        }}
                      >
                        {isUploadingAgencyCover ? (
                          <>
                            <RefreshCw size={12} className="spin" />
                            <span>Uploading Banner...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={12} />
                            <span>Upload Custom Banner</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={isUploadingAgencyCover}
                          onChange={handleAgencyCoverUpload}
                        />
                      </label>
                    </div>

                    {newAgencyForm.coverImage && (
                      <div
                        style={{
                          width: "100%",
                          height: 72,
                          borderRadius: 10,
                          overflow: "hidden",
                          position: "relative",
                          marginBottom: 8,
                          border: "1px solid var(--border-subtle)"
                        }}
                      >
                        <img
                          src={newAgencyForm.coverImage}
                          alt="Banner Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 4,
                            right: 6,
                            background: "rgba(0,0,0,0.65)",
                            backdropFilter: "blur(6px)",
                            padding: "2px 7px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.65rem",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <Cloud size={10} /> Active Banner
                        </div>
                      </div>
                    )}
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
                  style={{ background: "#4f46e5", border: "none" }}
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
                {credentialTarget.type === "agency" && (
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Agency Portal ID / Code</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.03em" }}
                      value={credentialForm.portalCode || ""}
                      onChange={(e) => setCredentialForm({ ...credentialForm, portalCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. SNAB-PARTNER-01"
                    />
                    <span style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                      Agencies can sign in to their portal using this Portal ID or their Email ID.
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    {credentialTarget.type === "company" ? "Company Admin Login Email" : "Agency Contact Email ID"}
                  </label>
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
      {/* MODAL: CONFIRM REVOKE USER ACCESS */}
      {/* ========================================================================= */}
      {userToRevoke && (
        <div className="modal-overlay" onClick={() => setUserToRevoke(null)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "rgba(220, 38, 38, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dc2626"
                  }}
                >
                  <AlertTriangle size={17} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                  Revoke User Access
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setUserToRevoke(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.5 }}>
                Are you sure you want to revoke login access for <strong>{userToRevoke.name}</strong>?
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                This user will immediately be disabled and will not be able to log in to the workspace with <strong>{userToRevoke.email}</strong>.
              </p>
            </div>

            <div className="modal-footer" style={{ padding: "14px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setUserToRevoke(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: "#dc2626", border: "none" }}
                onClick={() => {
                  const userName = userToRevoke.name;
                  removeCompanyUser(userToRevoke.id);
                  setUserToRevoke(null);
                  setRevokeFeedback(`Access for ${userName} has been successfully revoked.`);
                  setTimeout(() => setRevokeFeedback(null), 4000);
                }}
              >
                <Trash2 size={14} />
                <span>Revoke Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRM DELETE EMPLOYER ATS TENANT */}
      {/* ========================================================================= */}
      {companyToDelete && (
        <div className="modal-overlay" onClick={() => setCompanyToDelete(null)}>
          <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    background: "rgba(220, 38, 38, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dc2626"
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                    Delete Employer ATS Tenant
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Tenant ID: {companyToDelete.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setCompanyToDelete(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: "20px 24px" }}>
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <div
                  className="company-logo-avatar"
                  style={{
                    width: 36,
                    height: 36,
                    fontSize: "0.85rem",
                    background: companyToDelete.brandColor || "#4f46e5"
                  }}
                >
                  {companyToDelete.logoInitials || "CO"}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{companyToDelete.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {companyToDelete.domain} &bull; Admin: {companyToDelete.primaryAdmin}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.5 }}>
                Are you sure you want to permanently delete <strong>{companyToDelete.name}</strong>?
              </p>
              <p style={{ fontSize: "0.8rem", color: "#dc2626", margin: 0, lineHeight: 1.5 }}>
                Warning: All active job requisitions, candidate pipeline records, interview schedules, and team member logins for this tenant will be permanently deleted.
              </p>
            </div>

            <div className="modal-footer" style={{ padding: "14px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCompanyToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: "#dc2626", border: "none" }}
                onClick={handleConfirmDeleteCompany}
              >
                <Trash2 size={14} />
                <span>Delete Tenant Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRM DELETE PLACEMENT AGENCY */}
      {/* ========================================================================= */}
      {agencyToDelete && (
        <div className="modal-overlay" onClick={() => setAgencyToDelete(null)}>
          <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    background: "rgba(220, 38, 38, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dc2626"
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                    Delete Placement Agency
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Portal ID: {agencyToDelete.portalCode || agencyToDelete.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setAgencyToDelete(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: "20px 24px" }}>
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <div
                  className="company-logo-avatar"
                  style={{
                    width: 36,
                    height: 36,
                    fontSize: "0.85rem",
                    background: "rgba(124, 58, 237, 0.1)",
                    color: "#7c3aed"
                  }}
                >
                  {agencyToDelete.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{agencyToDelete.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {agencyToDelete.email} &bull; Contact: {agencyToDelete.primaryContact}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.5 }}>
                Are you sure you want to permanently delete <strong>{agencyToDelete.name}</strong>?
              </p>
              <p style={{ fontSize: "0.8rem", color: "#dc2626", margin: 0, lineHeight: 1.5 }}>
                Warning: The agency portal code ({agencyToDelete.portalCode || agencyToDelete.id}) will be deactivated immediately and their partner account removed from all tenant job syndications.
              </p>
            </div>

            <div className="modal-footer" style={{ padding: "14px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAgencyToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: "#dc2626", border: "none" }}
                onClick={handleConfirmDeleteAgency}
              >
                <Trash2 size={14} />
                <span>Delete Agency Permanently</span>
              </button>
            </div>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="form-label" style={{ margin: 0 }}>SVG / Image Logo (Direct Upload / URL)</label>
                    <label
                      className="btn btn-ghost btn-sm"
                      style={{
                        cursor: isUploadingBrandingLogo ? "not-allowed" : "pointer",
                        fontSize: "0.72rem",
                        padding: "2px 8px",
                        color: "var(--primary)",
                        fontWeight: 700
                      }}
                    >
                      {isUploadingBrandingLogo ? <RefreshCw size={12} className="spin" /> : <Upload size={12} />}
                      <span>{isUploadingBrandingLogo ? "Uploading..." : "Upload to Cloudinary"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        disabled={isUploadingBrandingLogo}
                        onChange={handleBrandingLogoUpload}
                      />
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {brandingForm.logoUrl && (
                      <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-subtle)", flexShrink: 0, padding: 2 }}>
                        <img src={brandingForm.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    )}
                    <input
                      type="text"
                      className="form-input"
                      placeholder="data:image/svg+xml... or https://res.cloudinary.com/..."
                      value={brandingForm.logoUrl}
                      onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                    />
                  </div>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="form-label" style={{ margin: 0 }}>Cover Banner (Upload or Presets)</label>
                    <label
                      className="btn btn-ghost btn-sm"
                      style={{
                        cursor: isUploadingBrandingCover ? "not-allowed" : "pointer",
                        fontSize: "0.72rem",
                        padding: "2px 8px",
                        color: "var(--primary)",
                        fontWeight: 700
                      }}
                    >
                      {isUploadingBrandingCover ? <RefreshCw size={12} className="spin" /> : <Upload size={12} />}
                      <span>{isUploadingBrandingCover ? "Uploading..." : "Upload to Cloudinary"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        disabled={isUploadingBrandingCover}
                        onChange={handleBrandingCoverUpload}
                      />
                    </label>
                  </div>
                  {brandingForm.coverImage && (
                    <div style={{ width: "100%", height: 64, borderRadius: 8, overflow: "hidden", marginBottom: 6, border: "1px solid var(--border-subtle)" }}>
                      <img src={brandingForm.coverImage} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <select
                    className="form-select"
                    value={brandingForm.coverImage}
                    onChange={(e) => setBrandingForm({ ...brandingForm, coverImage: e.target.value })}
                  >
                    <option value="">-- Choose from Curated Presets --</option>
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
