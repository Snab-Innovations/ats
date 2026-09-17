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
  MapPin
} from "lucide-react";

export const AgencyManager = () => {
  const {
    agencies,
    addAgency,
    jobs,
    candidates,
    setActiveRole,
    setSelectedAgencyId
  } = useAts();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    primaryContact: "",
    email: "",
    phone: "+91 ",
    city: "Bengaluru",
    portalCode: `AGY-IN-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const syndicatedJobsCount = jobs.filter((j) => j.syndicateToAgencies).length;
  const agencyCandidatesCount = candidates.filter((c) => c.sourceType === "agency").length;

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

  return (
    <div className="admin-main">
      <header className="page-header">
        <div className="page-title-group">
          <h1>Indian Recruitment Agency & Headhunter Network</h1>
          <p>
            Oversee authorized recruitment consultancies (Naukri Elite, ABC, SutraHR), candidate pipelines, and INR placement bounties
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <UserPlus size={16} />
            <span>Onboard New Consultancy</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* KPI Banner */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Authorized Consultancies</span>
              <div className="kpi-icon-wrap">
                <UsersRound size={16} />
              </div>
            </div>
            <div className="kpi-value">{agencies.length}</div>
            <div className="kpi-footer">
              <span>Active recruiter logins</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Syndicated Requisitions</span>
              <div className="kpi-icon-wrap">
                <Share2 size={16} />
              </div>
            </div>
            <div className="kpi-value">{syndicatedJobsCount}</div>
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
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem" }}>Certified External Recruitment Consultancies</h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                Partners log into their specialized portal to review mandates, submit candidate CTCs, and track bounties
              </p>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Consultancy & Account Lead</th>
                <th>Hub City</th>
                <th>Portal Access Code</th>
                <th>Submissions</th>
                <th>Hired Placements</th>
                <th>Bounties Earned</th>
                <th>Recruiter Rating</th>
                <th style={{ textAlign: "right" }}>Partner Action</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agy) => (
                <tr key={agy.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: "0.925rem", color: "var(--text-primary)" }}>
                      {agy.name}
                    </div>
                    <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      {agy.primaryContact} &bull; {agy.email}
                    </div>
                  </td>

                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <MapPin size={12} />
                      {agy.city || "Bengaluru"}
                    </span>
                  </td>

                  <td>
                    <code
                      style={{
                        background: "var(--bg-app)",
                        border: "1px solid var(--border-subtle)",
                        padding: "3px 7px",
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

                  <td>
                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                      {agy.candidatesSubmitted}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                      {agy.placementsHired}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                      {agy.totalBountiesEarned}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", fontSize: "0.825rem", fontWeight: 500 }}>
                      <Star size={13} fill="#d97706" color="#d97706" />
                      <span>{agy.rating || 4.9}</span>
                    </div>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedAgencyId(agy.id);
                        setActiveRole("agency_portal");
                      }}
                      title="Log into agency portal as this partner"
                    >
                      <ExternalLink size={13} />
                      <span>Open Recruiter View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                  <h2 style={{ fontSize: "1.2rem" }}>Onboard Recruitment Consultancy</h2>
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
                  <div className="form-group">
                    <label className="form-label">Consultancy / Agency Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. SutraHR Tech Recruiters"
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
