import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import {
  UsersRound,
  UserPlus,
  Share2,
  IndianRupee,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  X,
  PhoneCall,
  MapPin,
  Ban,
  Unlock,
  AlertTriangle,
  Check,
  ShieldAlert,
  Search
} from "lucide-react";

export const AgencyManager = () => {
  const {
    agencies,
    addAgency,
    toggleBlockAgencyForCompany,
    company,
    jobs,
    candidates,
    setActiveRole,
    setSelectedAgencyId
  } = useAts();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [blockingPrompt, setBlockingPrompt] = useState(null); // { agency, isBlocked }
  const [feedbackAlert, setFeedbackAlert] = useState(null); // { title, message, type: 'danger' | 'success' }
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "active" | "blocked"
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    primaryContact: "",
    email: "",
    phone: "+91 ",
    city: "Bengaluru",
    portalCode: `AGY-IN-${Math.floor(1000 + Math.random() * 9000)}`
  });

  // Syndicated jobs from THIS company
  const companySyndicatedJobs = jobs.filter(
    (j) => (j.companyId ? j.companyId === company.id : true) && j.syndicateToAgencies
  ).length;

  const agencyCandidatesCount = candidates.filter((c) => c.sourceType === "agency").length;

  const blockedAgenciesCount = agencies.filter((a) =>
    (a.blockedCompanyIds || []).includes(company.id)
  ).length;

  const activeAgenciesCount = agencies.length - blockedAgenciesCount;

  const filteredAgencies = agencies.filter((agy) => {
    const isBlocked = (agy.blockedCompanyIds || []).includes(company.id);
    if (filterStatus === "active" && isBlocked) return false;
    if (filterStatus === "blocked" && !isBlocked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (agy.name || "").toLowerCase().includes(q);
      const matchContact = (agy.primaryContact || "").toLowerCase().includes(q);
      const matchCity = (agy.city || "").toLowerCase().includes(q);
      const matchCode = (agy.portalCode || "").toLowerCase().includes(q);
      if (!matchName && !matchContact && !matchCity && !matchCode) return false;
    }
    return true;
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addAgency({
      name: formData.name,
      primaryContact: formData.primaryContact || "Recruitment Lead",
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      portalCode: formData.portalCode
    });

    setIsInviteModalOpen(false);
    setFormData({
      name: "",
      primaryContact: "",
      email: "",
      phone: "+91 ",
      city: "Bengaluru",
      portalCode: `AGY-IN-${Math.floor(1000 + Math.random() * 9000)}`
    });
  };

  const handleConfirmToggleBlock = () => {
    if (!blockingPrompt) return;
    const { agency, isBlocked } = blockingPrompt;

    toggleBlockAgencyForCompany(agency.id, company.id);
    setBlockingPrompt(null);

    if (isBlocked) {
      setFeedbackAlert({
        type: "success",
        title: "Agency Unblocked",
        message: `"${agency.name}" has been unblocked. They can now view and submit candidates for ${company.name}'s active mandates.`
      });
    } else {
      setFeedbackAlert({
        type: "danger",
        title: "Agency Blocked",
        message: `"${agency.name}" has been blocked. This agency will no longer receive or view any job mandates from ${company.name}.`
      });
    }
  };

  return (
    <div className="admin-main">
      <header className="page-header">
        <div className="page-title-group">
          <h1>Recruitment Agencies</h1>
          <p>
            Manage authorized recruitment agency partners, mandate syndication, candidate submissions, and placement fees
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsInviteModalOpen(true)}
            title="Add a new recruitment agency partner (Employer Admin Only)"
          >
            <UserPlus size={16} />
            <span>Add Agency Partner</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* Feedback Alert Toast */}
        {feedbackAlert && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 8,
              background:
                feedbackAlert.type === "danger"
                  ? "rgba(220, 38, 38, 0.08)"
                  : "rgba(16, 185, 129, 0.08)",
              border: `1px solid ${
                feedbackAlert.type === "danger"
                  ? "rgba(220, 38, 38, 0.25)"
                  : "rgba(16, 185, 129, 0.25)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              animation: "fadeIn 0.2s ease-out"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {feedbackAlert.type === "danger" ? (
                <ShieldAlert size={18} color="#dc2626" />
              ) : (
                <CheckCircle size={18} color="#10b981" />
              )}
              <div>
                <strong
                  style={{
                    fontSize: "0.85rem",
                    color: feedbackAlert.type === "danger" ? "#dc2626" : "#059669",
                    display: "block"
                  }}
                >
                  {feedbackAlert.title}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {feedbackAlert.message}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ width: 26, height: 26, padding: 0, borderRadius: "50%" }}
              onClick={() => setFeedbackAlert(null)}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* KPI Banner */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Authorized Consultancies</span>
              <div className="kpi-icon-wrap">
                <UsersRound size={16} />
              </div>
            </div>
            <div className="kpi-value">{activeAgenciesCount} / {agencies.length}</div>
            <div className="kpi-footer">
              <span style={{ color: blockedAgenciesCount > 0 ? "#dc2626" : "var(--text-muted)", fontWeight: blockedAgenciesCount > 0 ? 600 : 400 }}>
                {blockedAgenciesCount > 0
                  ? `${blockedAgenciesCount} blocked from ${company.name}`
                  : "All consultancies active"}
              </span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">{company.name} Mandates</span>
              <div className="kpi-icon-wrap">
                <Share2 size={16} />
              </div>
            </div>
            <div className="kpi-value">{companySyndicatedJobs}</div>
            <div className="kpi-footer">
              <span>Bounties: ₹50,000 - ₹1,25,000</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Profiles Ingested</span>
              <div className="kpi-icon-wrap">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="kpi-value">{agencyCandidatesCount}</div>
            <div className="kpi-footer">
              <span>Auto-injected into Kanban</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Total Placement Payouts</span>
              <div className="kpi-icon-wrap">
                <IndianRupee size={16} />
              </div>
            </div>
            <div className="kpi-value">₹4,50,000</div>
            <div className="kpi-footer">
              <span>6 verified joins</span>
            </div>
          </div>
        </div>

        {/* Agencies Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Certified External Recruitment Consultancies
              </h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: "3px 0 0" }}>
                Manage partner consultancies, track portal logins, and block consultancies from receiving mandates for <strong>{company.name}</strong>
              </p>
            </div>

            {/* Filter Tabs & Search Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: 10,
                    color: "var(--text-muted)",
                    pointerEvents: "none"
                  }}
                />
                <input
                  type="text"
                  placeholder="Search agencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "6px 12px 6px 30px",
                    borderRadius: 6,
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-app)",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    width: 170
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 8,
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  background: "var(--bg-app)",
                  borderRadius: 7,
                  padding: 3,
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <button
                  type="button"
                  onClick={() => setFilterStatus("all")}
                  style={{
                    border: "none",
                    background: filterStatus === "all" ? "var(--primary)" : "transparent",
                    color: filterStatus === "all" ? "#fff" : "var(--text-secondary)",
                    padding: "4px 10px",
                    borderRadius: 5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  All ({agencies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("active")}
                  style={{
                    border: "none",
                    background: filterStatus === "active" ? "#059669" : "transparent",
                    color: filterStatus === "active" ? "#fff" : "var(--text-secondary)",
                    padding: "4px 10px",
                    borderRadius: 5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  Active ({activeAgenciesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("blocked")}
                  style={{
                    border: "none",
                    background: filterStatus === "blocked" ? "#dc2626" : "transparent",
                    color: filterStatus === "blocked" ? "#fff" : "var(--text-secondary)",
                    padding: "4px 10px",
                    borderRadius: 5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  Blocked ({blockedAgenciesCount})
                </button>
              </div>
            </div>
          </div>

          {/* Table with responsive horizontal scroll wrapper */}
          <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="custom-table" style={{ width: "100%", minWidth: "1050px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ minWidth: 240, paddingLeft: 20 }}>Agency & Contact</th>
                  <th style={{ minWidth: 130 }}>Hub City</th>
                  <th style={{ minWidth: 150 }}>Portal Access Code</th>
                  <th style={{ minWidth: 160 }}>Mandate Access</th>
                  <th style={{ minWidth: 95, textAlign: "center" }}>Submissions</th>
                  <th style={{ minWidth: 85, textAlign: "center" }}>Placements</th>
                  <th style={{ minWidth: 120 }}>Bounties Earned</th>
                  <th style={{ minWidth: 85 }}>Rating</th>
                  <th style={{ minWidth: 190, textAlign: "right", paddingRight: 20 }}>Partner Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgencies.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "36px 20px", color: "var(--text-muted)" }}>
                      <UsersRound size={28} style={{ opacity: 0.4, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                      <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>No recruitment agencies found</div>
                      <div style={{ fontSize: "0.8rem", marginTop: 2 }}>
                        {searchQuery ? `No matches for "${searchQuery}"` : "Try changing the status filter tab above."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAgencies.map((agy) => {
                    const isBlocked = (agy.blockedCompanyIds || []).includes(company.id);
                    const bountiesDisplay =
                      agy.totalBountiesEarned && agy.totalBountiesEarned !== "₹0"
                        ? agy.totalBountiesEarned
                        : agy.placementsHired
                        ? `₹${(agy.placementsHired * 75000).toLocaleString("en-IN")}`
                        : "₹0";

                    return (
                      <tr
                        key={agy.id}
                        style={{
                          background: isBlocked ? "rgba(220, 38, 38, 0.03)" : "transparent",
                          transition: "background 0.15s ease"
                        }}
                      >
                        <td style={{ paddingLeft: 20 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.925rem", color: "var(--text-primary)" }}>
                            {agy.name}
                          </div>
                          <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginTop: 2 }}>
                            {agy.primaryContact} &bull; {agy.email}
                          </div>
                        </td>

                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            <MapPin size={12} style={{ flexShrink: 0 }} />
                            <span>{agy.city || "Bengaluru"}</span>
                          </span>
                        </td>

                        <td>
                          <code
                            style={{
                              background: "var(--bg-app)",
                              border: "1px solid var(--border-subtle)",
                              padding: "3px 8px",
                              borderRadius: 4,
                              fontSize: "0.75rem",
                              fontFamily: "var(--font-mono)",
                              color: "var(--text-secondary)",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              display: "inline-block"
                            }}
                          >
                            {agy.portalCode}
                          </code>
                        </td>

                        {/* Company Mandate Access Status */}
                        <td>
                          {isBlocked ? (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(220, 38, 38, 0.1)",
                                color: "#dc2626",
                                border: "1px solid rgba(220, 38, 38, 0.3)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 8px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                borderRadius: 6,
                                whiteSpace: "nowrap"
                              }}
                              title={`Blocked from receiving any jobs from ${company.name}`}
                            >
                              <Ban size={11} />
                              <span>Blocked (No Jobs)</span>
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(16, 185, 129, 0.1)",
                                color: "#059669",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 8px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                borderRadius: 6,
                                whiteSpace: "nowrap"
                              }}
                              title={`Active partner receiving mandates from ${company.name}`}
                            >
                              <CheckCircle size={11} />
                              <span>Active Partner</span>
                            </span>
                          )}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {agy.candidatesSubmitted}
                          </span>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {agy.placementsHired}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {bountiesDisplay}
                          </span>
                        </td>

                        <td>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", fontSize: "0.825rem", fontWeight: 500 }}>
                            <Star size={13} fill="#d97706" color="#d97706" />
                            <span>{agy.rating || 4.9}</span>
                          </div>
                        </td>

                        {/* Partner Actions: Block / Unblock & Recruiter View */}
                        <td style={{ textAlign: "right", paddingRight: 20, whiteSpace: "nowrap" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                            {isBlocked ? (
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  fontSize: "0.78rem",
                                  padding: "5px 11px",
                                  gap: 5,
                                  background: "rgba(16, 185, 129, 0.1)",
                                  color: "#059669",
                                  border: "1px solid rgba(16, 185, 129, 0.35)",
                                  fontWeight: 600,
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap"
                                }}
                                onClick={() => setBlockingPrompt({ agency: agy, isBlocked: true })}
                                title={`Unblock ${agy.name} so they can receive jobs from ${company.name}`}
                              >
                                <Unlock size={12} />
                                <span>Unblock</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  fontSize: "0.78rem",
                                  padding: "5px 11px",
                                  gap: 5,
                                  background: "rgba(220, 38, 38, 0.08)",
                                  color: "#dc2626",
                                  border: "1px solid rgba(220, 38, 38, 0.35)",
                                  fontWeight: 600,
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap"
                                }}
                                onClick={() => setBlockingPrompt({ agency: agy, isBlocked: false })}
                                title={`Block ${agy.name} from receiving jobs from ${company.name}`}
                              >
                                <Ban size={12} />
                                <span>Block</span>
                              </button>
                            )}

                            <button
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: "0.78rem",
                                padding: "5px 11px",
                                gap: 5,
                                borderRadius: 6,
                                whiteSpace: "nowrap"
                              }}
                              onClick={() => {
                                setSelectedAgencyId(agy.id);
                                setActiveRole("agency_portal");
                              }}
                              title="Log into agency portal as this partner"
                            >
                              <ExternalLink size={12} />
                              <span>Portal</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Block / Unblock Confirmation Modal */}
        {blockingPrompt && (
          <div
            className="modal-overlay"
            onClick={() => setBlockingPrompt(null)}
            style={{ zIndex: 1090 }}
          >
            <div
              className="modal-content"
              style={{ maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {blockingPrompt.isBlocked ? (
                    <Unlock size={18} color="#059669" />
                  ) : (
                    <Ban size={18} color="#dc2626" />
                  )}
                  <h3 style={{ fontSize: "1.05rem", margin: 0 }}>
                    {blockingPrompt.isBlocked
                      ? `Unblock ${blockingPrompt.agency.name}?`
                      : `Block ${blockingPrompt.agency.name} from ${company.name}?`}
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => setBlockingPrompt(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "18px 20px" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 14px" }}>
                  {blockingPrompt.isBlocked
                    ? `Are you sure you want to unblock ${blockingPrompt.agency.name}? They will immediately regain access to view and submit candidates for ${company.name}'s active job requisitions.`
                    : `Once blocked, ${blockingPrompt.agency.name} will NOT receive, view, or be able to submit candidates for any job requisitions from ${company.name}. Other client companies in ExpertHire will remain unaffected.`}
                </p>

                <div
                  style={{
                    padding: "10px 14px",
                    background: blockingPrompt.isBlocked ? "rgba(16, 185, 129, 0.08)" : "rgba(220, 38, 38, 0.08)",
                    border: `1px solid ${blockingPrompt.isBlocked ? "rgba(16, 185, 129, 0.25)" : "rgba(220, 38, 38, 0.25)"}`,
                    borderRadius: 6,
                    fontSize: "0.8rem",
                    color: "var(--text-primary)"
                  }}
                >
                  <strong>Impact:</strong>{" "}
                  {blockingPrompt.isBlocked
                    ? `Job mandates from ${company.name} will become visible in ${blockingPrompt.agency.name}'s partner portal.`
                    : `All active mandates (${companySyndicatedJobs}) from ${company.name} will be hidden immediately from this agency.`}
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBlockingPrompt(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: blockingPrompt.isBlocked ? "#059669" : "#dc2626",
                    borderColor: blockingPrompt.isBlocked ? "#059669" : "#dc2626",
                    color: "#ffffff",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px"
                  }}
                  onClick={handleConfirmToggleBlock}
                >
                  {blockingPrompt.isBlocked ? (
                    <Unlock size={14} color="#ffffff" />
                  ) : (
                    <Ban size={14} color="#ffffff" />
                  )}
                  <span style={{ color: "#ffffff", fontWeight: 600 }}>
                    {blockingPrompt.isBlocked
                      ? "Confirm Unblock Agency"
                      : "Confirm Block Agency"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite New Agency Modal */}
        {isInviteModalOpen && (
          <div className="modal-overlay" onClick={() => setIsInviteModalOpen(false)}>
            <div
              className="modal-content"
              style={{ maxWidth: 540 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <UserPlus size={18} color="var(--primary)" />
                  <h2 style={{ fontSize: "1.2rem" }}>Add Agency Partner</h2>
                </div>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => setIsInviteModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit}>
                <div className="modal-body">
                  <div
                    style={{
                      padding: "8px 12px",
                      background: "rgba(79, 70, 229, 0.07)",
                      border: "1px solid rgba(79, 70, 229, 0.18)",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      color: "var(--primary)",
                      marginBottom: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 600
                    }}
                  >
                    <ShieldCheck size={14} />
                    <span>Employer Admin Access Only &bull; External agencies cannot invite or onboard other agencies.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agency Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Apex Talent Solutions"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Lead Recruiter / SPOC</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Neha Kapoor"
                        value={formData.primaryContact}
                        onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hub City</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Bengaluru, Mumbai, Pune"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Contact Email *</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="recruiter@partner.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mobile / WhatsApp</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="+91 98201 XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Portal Login Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.portalCode}
                      onChange={(e) => setFormData({ ...formData, portalCode: e.target.value })}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                      The agency uses this code or magic link to log in and submit candidates directly.
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsInviteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle size={15} />
                    <span>Create Partner Seat</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
