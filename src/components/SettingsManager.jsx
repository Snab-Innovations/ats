import React, { useState, useRef } from "react";
import { useAts } from "../context/AtsContext";
import {
  Building,
  Globe,
  Save,
  Check,
  Copy,
  Palette,
  Users,
  PlusCircle,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  UploadCloud,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Link2,
  RefreshCw,
  X,
  AlertTriangle
} from "lucide-react";

export const SettingsManager = () => {
  const {
    company,
    updateCompanyBranding,
    coverPresets,
    companyUsers,
    addCompanyUser,
    removeCompanyUser,
    setActiveRole
  } = useAts();

  const [activeSettingsTab, setActiveSettingsTab] = useState("branding"); // 'branding' | 'team' | 'domain'
  const [saved, setSaved] = useState(false);
  const [copiedDns, setCopiedDns] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState(null);
  const [isCheckingDns, setIsCheckingDns] = useState(false);
  const [dnsVerified, setDnsVerified] = useState(true);

  // File upload refs
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Drag state
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState("");

  // Brand Form State
  const [brandForm, setBrandForm] = useState({
    name: company.name || "",
    tagline: company.tagline || "",
    domain: company.domain || "",
    headquarters: company.headquarters || "",
    logoInitials: company.logoInitials || "CO",
    logoUrl: company.logoUrl || "",
    coverImage: company.coverImage || coverPresets[0]?.url,
    brandColor: company.brandColor || "#4f46e5",
    accentColor: company.accentColor || "#0284c7"
  });

  // Team Member Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    role: "Lead Tech Recruiter",
    title: "Technical Talent Partner",
    department: "Talent Acquisition"
  });

  // White-Label & Domain Form State
  const [settingsForm, setSettingsForm] = useState({
    customDomain: `careers.${company.domain}`,
    rootRedirectUrl: `https://${company.domain}`,
    removeBrandingBadge: true,
    enforceHttps: true,
    customFaviconUrl: "",
    fallbackExpiredUrl: `https://${company.domain}/careers`
  });

  const assignedUsers = companyUsers.filter((u) => u.companyId === company.id);

  const showFeedback = (msg) => {
    setUploadFeedback(msg);
    setTimeout(() => setUploadFeedback(""), 3000);
  };

  const handleSaveBrand = (e) => {
    if (e) e.preventDefault();
    updateCompanyBranding(company.id, brandForm);
    setSaved(true);
    showFeedback("Brand settings saved across all portal pages!");
    setTimeout(() => setSaved(false), 2200);
  };

  // Logo file upload handler
  const processLogoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setBrandForm((prev) => ({ ...prev, logoUrl: dataUrl }));
      updateCompanyBranding(company.id, { logoUrl: dataUrl });
      showFeedback("Company logo uploaded and updated live!");
    };
    reader.readAsDataURL(file);
  };

  // Cover image file upload handler
  const processCoverFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Banner image size should be less than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setBrandForm((prev) => ({ ...prev, coverImage: dataUrl }));
      updateCompanyBranding(company.id, { coverImage: dataUrl });
      showFeedback("Hero cover banner uploaded and applied live!");
    };
    reader.readAsDataURL(file);
  };

  const handleAddTeamMember = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    addCompanyUser({ ...newUser, companyId: company.id });
    setIsAddUserModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      phone: "+91 ",
      role: "Lead Tech Recruiter",
      title: "Technical Talent Partner",
      department: "Talent Acquisition"
    });
    showFeedback("Team member login invite sent successfully!");
  };

  const handleCopyDns = () => {
    navigator.clipboard.writeText(`CNAME\t${settingsForm.customDomain}\tcname.experthire.io\t300`);
    setCopiedDns(true);
    setTimeout(() => setCopiedDns(false), 2000);
  };

  const handleVerifyDns = () => {
    setIsCheckingDns(true);
    setTimeout(() => {
      setIsCheckingDns(false);
      setDnsVerified(true);
      showFeedback("DNS check complete: CNAME record propagated & SSL active!");
    }, 1100);
  };

  return (
    <div className="admin-main">
      <header className="page-header" style={{ padding: "20px 32px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
        <div className="page-title-group">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1>Platform Settings: {company.name}</h1>
            <span className="badge badge-source-referral" style={{ fontSize: "0.75rem" }}>
              Active Employer
            </span>
            {uploadFeedback && (
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--primary)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <CheckCircle2 size={14} />
                {uploadFeedback}
              </span>
            )}
          </div>
          <p style={{ marginTop: 4 }}>
            Manage custom branding assets, upload logo & cover banners, invite team members, and configure white-label custom domain CNAME.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveRole("public_careers")}
          >
            <Eye size={14} />
            <span>Preview Career Site</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSaveBrand}>
            {saved ? <Check size={15} /> : <Save size={15} />}
            <span>{saved ? "Saved All Settings!" : "Save Brand Settings"}</span>
          </button>
        </div>
      </header>

      {/* Full-width container */}
      <div className="page-content" style={{ width: "100%", maxWidth: "100%" }}>
        {/* Settings Tab Navigation */}
        <div
          className="modal-tabs-container"
          style={{
            marginBottom: 24,
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0",
            borderBottom: "none"
          }}
        >
          <button
            type="button"
            className={`modal-tab-btn ${activeSettingsTab === "branding" ? "active" : ""}`}
            onClick={() => setActiveSettingsTab("branding")}
          >
            <Palette size={16} />
            <span>Brand Identity & Cover Page</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeSettingsTab === "team" ? "active" : ""}`}
            onClick={() => setActiveSettingsTab("team")}
          >
            <Users size={16} />
            <span>Team User Logins ({assignedUsers.length})</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeSettingsTab === "domain" ? "active" : ""}`}
            onClick={() => setActiveSettingsTab("domain")}
          >
            <Globe size={16} />
            <span>White-Label & Domain</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: Brand Identity, Logo & Cover Banner Uploads                        */}
        {/* ========================================================================= */}
        {activeSettingsTab === "branding" && (
          <form onSubmit={handleSaveBrand} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Live Interactive Hero Banner Preview */}
            <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
              <div
                style={{
                  height: 160,
                  backgroundImage: `linear-gradient(180deg, rgba(20, 16, 12, 0.2) 0%, rgba(20, 16, 12, 0.78) 100%), url(${brandForm.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <span className="badge" style={{ background: "rgba(255, 255, 255, 0.92)", color: "#1c1917", fontWeight: 700 }}>
                    Live Career Portal Hero Preview
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ background: "rgba(255, 255, 255, 0.92)", color: "var(--text-primary)", fontWeight: 600 }}
                  onClick={() => setActiveRole("public_careers")}
                >
                  <ExternalLink size={13} />
                  <span>Open Full Career Site</span>
                </button>
              </div>

              <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 18, background: "var(--bg-surface)" }}>
                {brandForm.logoUrl ? (
                  <img
                    src={brandForm.logoUrl}
                    alt="Logo Preview"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "var(--radius-md)",
                      objectFit: "cover",
                      boxShadow: "var(--shadow-sm)",
                      border: "3px solid var(--bg-surface)",
                      marginTop: -28,
                      background: "#fff"
                    }}
                  />
                ) : (
                  <div
                    className="company-logo-avatar"
                    style={{
                      width: 56,
                      height: 56,
                      fontSize: "1.2rem",
                      background: brandForm.brandColor,
                      boxShadow: "var(--shadow-sm)",
                      border: "3px solid var(--bg-surface)",
                      marginTop: -28
                    }}
                  >
                    {brandForm.logoInitials || "CO"}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{brandForm.name}</h3>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    {brandForm.tagline}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload size={13} />
                    <span>Change Logo</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <ImageIcon size={13} />
                    <span>Change Cover</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Column Grid: Logo & Cover Banner Uploads */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 24 }}>
              {/* Card 1: Company Logo Upload */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="kpi-icon-wrap">
                      <ImageIcon size={16} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Company Logo</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        Displayed on ATS navigation, applicant emails, and career pages
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) processLogoFile(e.target.files[0]);
                  }}
                />

                {/* Logo Drag & Drop Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingLogo(true);
                  }}
                  onDragLeave={() => setIsDraggingLogo(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingLogo(false);
                    if (e.dataTransfer.files?.[0]) processLogoFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => logoInputRef.current?.click()}
                  style={{
                    border: isDraggingLogo ? "2px dashed var(--primary)" : "1px dashed var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    padding: "24px 18px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: isDraggingLogo ? "rgba(79, 70, 229, 0.04)" : "var(--bg-app)",
                    transition: "all 0.15s ease",
                    marginBottom: 16
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary)"
                      }}
                    >
                      <UploadCloud size={22} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    Click to upload logo or drag and drop
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                    PNG, SVG, JPG or WebP (square aspect ratio recommended, max 5MB)
                  </div>
                </div>

                {/* Logo Details & Fallback Initials */}
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Fallback Monogram Initials</label>
                    <input
                      type="text"
                      maxLength={3}
                      className="form-input"
                      value={brandForm.logoInitials}
                      onChange={(e) => setBrandForm({ ...brandForm, logoInitials: e.target.value.toUpperCase() })}
                      placeholder="e.g. BS"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Or External Logo Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      className="form-input"
                      value={brandForm.logoUrl}
                      onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                    />
                  </div>
                </div>

                {brandForm.logoUrl && (
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
                      <CheckCircle2 size={13} color="var(--primary)" /> Custom logo active
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: "#dc2626", fontSize: "0.78rem" }}
                      onClick={() => {
                        setBrandForm((prev) => ({ ...prev, logoUrl: "" }));
                        updateCompanyBranding(company.id, { logoUrl: "" });
                        showFeedback("Logo reset to fallback monogram initials.");
                      }}
                    >
                      Reset to Monogram
                    </button>
                  </div>
                )}
              </div>

              {/* Card 2: Hero Cover Page Banner Upload */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="kpi-icon-wrap">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Cover Page Banner</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        Top hero graphic on public job listings and embedded career iframes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hidden Cover File Input */}
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) processCoverFile(e.target.files[0]);
                  }}
                />

                {/* Banner Drag & Drop Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingCover(true);
                  }}
                  onDragLeave={() => setIsDraggingCover(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingCover(false);
                    if (e.dataTransfer.files?.[0]) processCoverFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    border: isDraggingCover ? "2px dashed var(--primary)" : "1px dashed var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    padding: "24px 18px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: isDraggingCover ? "rgba(79, 70, 229, 0.04)" : "var(--bg-app)",
                    transition: "all 0.15s ease",
                    marginBottom: 16
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary)"
                      }}
                    >
                      <UploadCloud size={22} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    Click to upload banner photo or drag and drop
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                    PNG, JPG or WebP (recommended 1600×600px widescreen, max 10MB)
                  </div>
                </div>

                {/* Curated Presets Quick Picker */}
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label" style={{ fontSize: "0.78rem" }}>
                    Or Choose Curated Architectural Preset
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 6 }}>
                    {coverPresets.map((preset) => {
                      const isSelected = brandForm.coverImage === preset.url;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setBrandForm({ ...brandForm, coverImage: preset.url });
                            updateCompanyBranding(company.id, { coverImage: preset.url });
                          }}
                          style={{
                            borderRadius: "var(--radius-sm)",
                            overflow: "hidden",
                            border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            background: "var(--bg-surface-elevated)"
                          }}
                          title={preset.title}
                        >
                          <div
                            style={{
                              height: 42,
                              backgroundImage: `url(${preset.url})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center"
                            }}
                          />
                          <div style={{ padding: "4px 6px", fontSize: "0.68rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {preset.title.split(" ")[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Custom Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                    value={brandForm.coverImage}
                    onChange={(e) => setBrandForm({ ...brandForm, coverImage: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* General Brand Details & Color Palette */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 24 }}>
              {/* Company Info */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div className="kpi-icon-wrap">
                    <Building size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Company Identity</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      Basic organizational profile reflected across all job postings and emails
                    </p>
                  </div>
                </div>

                <div className="form-row" style={{ marginBottom: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Company Brand Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Corporate Website</label>
                    <input
                      type="text"
                      className="form-input"
                      value={brandForm.domain}
                      onChange={(e) => setBrandForm({ ...brandForm, domain: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Company Tagline / Value Proposition</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandForm.tagline}
                    onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Headquarters / Primary Office Hub</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandForm.headquarters}
                    onChange={(e) => setBrandForm({ ...brandForm, headquarters: e.target.value })}
                  />
                </div>
              </div>

              {/* Brand Palette */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div className="kpi-icon-wrap">
                    <Palette size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Brand Palette & Theme</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      Harmonizes buttons, highlight chips, and link accents across your ATS
                    </p>
                  </div>
                </div>

                <div className="form-row" style={{ marginBottom: 18 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Primary Brand Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        type="color"
                        style={{ width: 42, height: 36, border: "none", cursor: "pointer", borderRadius: 6 }}
                        value={brandForm.brandColor}
                        onChange={(e) => setBrandForm({ ...brandForm, brandColor: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={brandForm.brandColor}
                        onChange={(e) => setBrandForm({ ...brandForm, brandColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Accent Highlight Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        type="color"
                        style={{ width: 42, height: 36, border: "none", cursor: "pointer", borderRadius: 6 }}
                        value={brandForm.accentColor}
                        onChange={(e) => setBrandForm({ ...brandForm, accentColor: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={brandForm.accentColor}
                        onChange={(e) => setBrandForm({ ...brandForm, accentColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ padding: "14px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-app)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Quick Color Swatches
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { name: "Indigo", primary: "#4f46e5", accent: "#0284c7" },
                      { name: "Emerald", primary: "#059669", accent: "#0d9488" },
                      { name: "Royal", primary: "#2563eb", accent: "#7c3aed" },
                      { name: "Crimson", primary: "#e11d48", accent: "#f59e0b" },
                      { name: "Slate", primary: "#334155", accent: "#0284c7" }
                    ].map((swatch) => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() =>
                          setBrandForm({
                            ...brandForm,
                            brandColor: swatch.primary,
                            accentColor: swatch.accent
                          })
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "5px 10px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          cursor: "pointer"
                        }}
                      >
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: swatch.primary }} />
                        {swatch.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary" style={{ padding: "10px 24px" }}>
                {saved ? <Check size={16} /> : <Save size={16} />}
                <span>{saved ? "Saved All Settings!" : "Save Brand Settings"}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: Team User Logins                                                   */}
        {/* ========================================================================= */}
        {activeSettingsTab === "team" && (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Authorized Team User Logins</h3>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  Team members with access to post requisitions, conduct interviews, and evaluate candidate scorecards
                </p>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddUserModalOpen(true)}
              >
                <PlusCircle size={15} />
                <span>Invite Team Member</span>
              </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden", width: "100%" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Work Email</th>
                    <th>Role & Permissions</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "var(--radius-full)",
                              background: "var(--bg-surface-elevated)",
                              color: "var(--text-primary)",
                              border: "1px solid var(--border-subtle)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              fontSize: "0.8rem"
                            }}
                          >
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <strong style={{ color: "var(--text-primary)", display: "block", fontSize: "0.875rem", fontWeight: 600 }}>{user.name}</strong>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.title}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>{user.email}</td>
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
                      <td style={{ fontSize: "0.85rem" }}>{user.department}</td>
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
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-icon"
                          style={{ color: "#dc2626" }}
                          onClick={() => setUserToRevoke(user)}
                          title="Revoke User Login"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: White-Label & Custom Domain (FULL WIDTH OCCUPY)                    */}
        {/* ========================================================================= */}
        {activeSettingsTab === "domain" && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Live Domain Status Banner */}
            <div
              className="card"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "20px 24px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-app)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)"
                  }}
                >
                  <Globe size={22} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                      https://{settingsForm.customDomain}
                    </h3>
                    <span
                      className="badge badge-active"
                      style={{ background: "rgba(5, 150, 105, 0.12)", color: "#059669" }}
                    >
                      <CheckCircle2 size={12} />
                      {dnsVerified ? "Verified & Live" : "Propagation Pending"}
                    </span>
                    <span
                      className="badge"
                      style={{ background: "var(--bg-surface-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
                    >
                      <Lock size={11} /> TLS 1.3 Active
                    </span>
                  </div>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    Career portal is running fully white-labeled on your corporate domain with anycast edge routing.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleVerifyDns}
                  disabled={isCheckingDns}
                >
                  <RefreshCw size={13} className={isCheckingDns ? "animate-spin" : ""} />
                  <span>{isCheckingDns ? "Testing DNS..." : "Verify DNS"}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveRole("public_careers")}
                >
                  <ExternalLink size={13} />
                  <span>Open Career Portal</span>
                </button>
              </div>
            </div>

            {/* Grid: Domain Configuration & Enterprise DNS Table */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 24 }}>
              {/* Card 1: Domain Setup Form */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div className="kpi-icon-wrap">
                    <Link2 size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Primary Career Subdomain</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      Point this custom CNAME to route job seekers to your branded ATS site
                    </p>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Custom Subdomain / Hostname</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>https://</span>
                    <input
                      type="text"
                      className="form-input"
                      value={settingsForm.customDomain}
                      onChange={(e) => setSettingsForm({ ...settingsForm, customDomain: e.target.value })}
                      placeholder="careers.yourcompany.com"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Root Corporate Website Redirect</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settingsForm.rootRedirectUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, rootRedirectUrl: e.target.value })}
                    placeholder="https://yourcompany.com"
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 3, display: "block" }}>
                    Redirects candidate navigation back to your primary corporate home page
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Fallback URL on Expired / Inactive Requisitions</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settingsForm.fallbackExpiredUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, fallbackExpiredUrl: e.target.value })}
                    placeholder="https://yourcompany.com/careers"
                  />
                </div>
              </div>

              {/* Card 2: White-Label Branding Controls */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div className="kpi-icon-wrap">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>White-Label Customizations</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      Control vendor attribution badges and custom domain security
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={settingsForm.removeBrandingBadge}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, removeBrandingBadge: e.target.checked })
                      }
                      style={{ marginTop: 2, width: 17, height: 17, accentColor: "var(--primary)" }}
                    />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        Remove "Powered by ExpertHire" Footer Badge
                      </div>
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                        100% pure white-label. No third-party ATS logos or references shown to applicants.
                      </div>
                    </div>
                  </label>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enforceHttps}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, enforceHttps: e.target.checked })
                      }
                      style={{ marginTop: 2, width: 17, height: 17, accentColor: "var(--primary)" }}
                    />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        Auto-Provision Free SSL Certificate (TLS 1.3)
                      </div>
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                        Automatic Let's Encrypt renewal with HTTP to HTTPS forced redirection.
                      </div>
                    </div>
                  </label>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Custom Subdomain Favicon URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={settingsForm.customFaviconUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, customFaviconUrl: e.target.value })}
                      placeholder="https://yourcompany.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise DNS Records Table (Full Width) */}
            <div className="card" style={{ padding: 0, overflow: "hidden", width: "100%" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg-surface)"
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>DNS Routing Configuration</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Add this CNAME record into your DNS provider (Cloudflare, GoDaddy, Route 53, Namecheap, Hostinger)
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCopyDns}
                >
                  {copiedDns ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedDns ? "Copied Record" : "Copy DNS CNAME"}</span>
                </button>
              </div>

              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name / Host</th>
                    <th>Points To / Value</th>
                    <th>TTL</th>
                    <th>Proxy Status</th>
                    <th style={{ textAlign: "right" }}>Validation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code
                        style={{
                          background: "var(--bg-app)",
                          border: "1px solid var(--border-subtle)",
                          padding: "2px 7px",
                          borderRadius: 4,
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--primary)"
                        }}
                      >
                        CNAME
                      </code>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        careers
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        cname.experthire.io
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                        300s (Auto)
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: "var(--bg-app)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                      >
                        DNS Only
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        className="badge badge-active"
                        style={{ background: "rgba(5, 150, 105, 0.12)", color: "#059669" }}
                      >
                        <CheckCircle2 size={12} /> Validated
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  padding: "12px 20px",
                  background: "var(--bg-app)",
                  borderTop: "1px solid var(--border-subtle)",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>
                  <strong>Tip:</strong> If using Cloudflare, make sure the cloud proxy icon is set to <em>DNS Only (Grey Cloud)</em> during initial SSL handshake.
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleVerifyDns}
                  style={{ fontSize: "0.75rem" }}
                >
                  <RefreshCw size={12} /> Re-verify Propagation
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "10px 24px" }}
                onClick={() => {
                  showFeedback("Domain routing & white-label settings updated!");
                }}
              >
                <Save size={16} />
                <span>Save Domain Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Team Member for this company */}
      {isAddUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Invite Team Member to {company.name}</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsAddUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Member Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvi Shah"
                    className="form-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Corporate Email (Login)</label>
                    <input
                      type="email"
                      required
                      placeholder={`e.g. tanvi@${company.domain}`}
                      className="form-input"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98000 00000"
                      className="form-input"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role in Organization</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="Company Admin">Company Admin</option>
                      <option value="Lead Tech Recruiter">Lead Tech Recruiter</option>
                      <option value="Hiring Manager">Hiring Manager</option>
                      <option value="Technical Interviewer">Technical Interviewer</option>
                      <option value="HR Coordinator">HR Coordinator</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Core Engineering"
                      className="form-input"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddUserModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <PlusCircle size={15} />
                  <span>Send Login Invite</span>
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
                Are you sure you want to revoke access for <strong>{userToRevoke.name}</strong>?
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                This user will immediately be disabled and will not be able to log in to <strong>{company.name}</strong> with <strong>{userToRevoke.email}</strong>.
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
                  showFeedback(`Revoked access for ${userName}`);
                }}
              >
                <Trash2 size={14} />
                <span>Revoke Access</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
