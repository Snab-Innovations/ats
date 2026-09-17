import React from "react";
import { useAts } from "../context/AtsContext";
import {
  Briefcase,
  Users,
  CalendarCheck,
  TrendingUp,
  Share2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  IndianRupee,
  Zap,
  PhoneCall
} from "lucide-react";

export const AdminDashboard = () => {
  const {
    company,
    jobs,
    candidates,
    interviews,
    agencies,
    setAdminTab,
    setSelectedCandidateId,
    setActiveRole
  } = useAts();

  // Metrics calculations
  const activeJobs = jobs.filter((j) => j.status === "active");
  const syndicatedJobs = jobs.filter((j) => j.syndicateToAgencies);
  const activeCandidates = candidates.filter((c) => c.stage !== "rejected");
  const hiredCount = candidates.filter((c) => c.stage === "hired").length;
  const upcomingInterviews = interviews.filter((i) => i.status === "Confirmed");

  // Immediate joiners count (Crucial Indian hiring metric!)
  const immediateJoinersCount = candidates.filter(
    (c) => c.noticePeriod?.toLowerCase().includes("immediate") || c.noticeType === "immediate"
  ).length;

  // Source Attribution breakdown
  const directCount = candidates.filter((c) => c.sourceType === "direct").length;
  const agencyCount = candidates.filter((c) => c.sourceType === "agency").length;
  const referralCount = candidates.filter((c) => c.sourceType === "referral").length;
  const totalCount = candidates.length || 1;

  const directPercent = Math.round((directCount / totalCount) * 100);
  const agencyPercent = Math.round((agencyCount / totalCount) * 100);
  const referralPercent = Math.round((referralCount / totalCount) * 100);

  const stages = [
    { key: "applied", label: "Applied", color: "var(--status-applied)" },
    { key: "screening", label: "Screening", color: "var(--status-screening)" },
    { key: "assessment", label: "Tech Assessment", color: "var(--status-assessment)" },
    { key: "interview", label: "Interviews", color: "var(--status-interview)" },
    { key: "offer", label: "Offer Released", color: "var(--status-offer)" },
    { key: "hired", label: "Joined / Hired", color: "var(--status-hired)" }
  ];

  return (
    <div className="admin-main">
      <header className="page-header">
        <div className="page-title-group">
          <h1>{company.name} Talent Operations</h1>
          <p>
            {company.headquarters} &bull; Pipeline Velocity, Notice Period Tracking & Agency Syndication Analytics
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setActiveRole("public_careers")}
          >
            <ExternalLink size={15} />
            <span>Preview Career Site</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setAdminTab("pipeline")}
          >
            <TrendingUp size={15} />
            <span>Open ATS Pipeline</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* KPI Stat Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Active Requisitions</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)" }}>
                <Briefcase size={18} />
              </div>
            </div>
            <div className="kpi-value">{activeJobs.length}</div>
            <div className="kpi-footer">
              <span className="badge badge-syndicated" style={{ fontSize: "0.72rem" }}>
                {syndicatedJobs.length} Syndicated to Consultancies
              </span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Active Candidates</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7" }}>
                <Users size={18} />
              </div>
            </div>
            <div className="kpi-value">{activeCandidates.length}</div>
            <div className="kpi-footer">
              <span className="kpi-trend-up">
                <ArrowUpRight size={14} /> +28% this month
              </span>
              <span>across Pan-India</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Immediate Joiners</span>
              <div className="kpi-icon-wrap" style={{ background: "#ecfdf5", color: "#059669" }}>
                <Zap size={18} />
              </div>
            </div>
            <div className="kpi-value" style={{ color: "#059669" }}>{immediateJoinersCount}</div>
            <div className="kpi-footer">
              <span className="badge badge-notice-immediate" style={{ fontSize: "0.7rem" }}>
                Relieved / &lt;15 Days Notice
              </span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Agency Sourced Profiles</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(219, 39, 119, 0.1)", color: "#db2777" }}>
                <Share2 size={18} />
              </div>
            </div>
            <div className="kpi-value">{agencyCount}</div>
            <div className="kpi-footer">
              <span>{agencies.length} verified Indian consultancies</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Offers & Placements</span>
              <div className="kpi-icon-wrap" style={{ background: "rgba(5, 150, 105, 0.1)", color: "#059669" }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="kpi-value">{hiredCount}</div>
            <div className="kpi-footer">
              <span style={{ color: "#059669", fontWeight: 700 }}>₹4.5 Lakhs in Bounties</span>
            </div>
          </div>
        </div>

        {/* Analytics Grid: Source Attribution vs Pipeline Funnel */}
        <div className="analytics-grid">
          {/* Source Attribution Breakdown */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: "1.05rem" }}>Candidate Sourcing Attribution</h3>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  Tracking direct website applicants vs recruitment consultancies (Naukri Elite, ABC, SutraHR) & referrals
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setAdminTab("agencies")}>
                Agency Network &rarr;
              </button>
            </div>

            <div className="source-bar-item">
              <div className="source-bar-info">
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-source-direct">Direct Career Site</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    Organic applicant flow via website/iframe
                  </span>
                </span>
                <span style={{ fontWeight: 700 }}>
                  {directCount} candidates ({directPercent}%)
                </span>
              </div>
              <div className="source-bar-progress">
                <div
                  className="source-bar-fill"
                  style={{ width: `${directPercent}%`, background: "#0284c7" }}
                ></div>
              </div>
            </div>

            <div className="source-bar-item">
              <div className="source-bar-info">
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-source-agency">Recruitment Consultancies</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    Naukri Elite, ABC Consultants, SutraHR
                  </span>
                </span>
                <span style={{ fontWeight: 700 }}>
                  {agencyCount} candidates ({agencyPercent}%)
                </span>
              </div>
              <div className="source-bar-progress">
                <div
                  className="source-bar-fill"
                  style={{ width: `${agencyPercent}%`, background: "#db2777" }}
                ></div>
              </div>
            </div>

            <div className="source-bar-item">
              <div className="source-bar-info">
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-source-referral">Internal Tech Referrals</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    Ex-colleagues from Swiggy, Razorpay, Flipkart
                  </span>
                </span>
                <span style={{ fontWeight: 700 }}>
                  {referralCount} candidates ({referralPercent}%)
                </span>
              </div>
              <div className="source-bar-progress">
                <div
                  className="source-bar-fill"
                  style={{ width: `${referralPercent}%`, background: "#059669" }}
                ></div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                background: "rgba(79, 70, 229, 0.06)",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: "0.825rem",
                color: "var(--text-primary)"
              }}
            >
              <Sparkles size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Hiring Velocity Tip:</strong> Agency candidates with <strong>Serving Notice Period</strong> have a <strong>3.2x faster joining rate</strong> compared to 90-day notice candidates.
              </div>
            </div>
          </div>

          {/* Hiring Funnel Stage Distribution */}
          <div className="card">
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: "1.05rem" }}>Pipeline Velocity</h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                Active candidates by evaluation milestone
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {stages.map((st) => {
                const count = candidates.filter((c) => c.stage === st.key).length;
                return (
                  <div
                    key={st.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 13px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)"
                    }}
                    onClick={() => setAdminTab("pipeline")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: st.color
                        }}
                      ></span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        {st.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.825rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)"
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Priority Candidates & Active Syndicated Bounties */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
          {/* Candidates Requiring Immediate Review */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: "1.05rem" }}>High-Priority Candidates in Process</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setAdminTab("pipeline")}>
                View All {candidates.length} &rarr;
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {candidates.slice(0, 4).map((cand) => (
                <div
                  key={cand.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedCandidateId(cand.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="user-avatar-sm">
                      {cand.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        {cand.name}
                      </div>
                      <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)" }}>
                        {cand.role} &bull; {cand.currentCompany}
                      </div>
                      <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: 2 }}>
                        CTC: <strong>{cand.currentCtc} &rarr; {cand.expectedCtc}</strong> &bull; Notice: <span style={{ color: "#059669", fontWeight: 600 }}>{cand.noticePeriod}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      className={`badge ${
                        cand.sourceType === "agency"
                          ? "badge-source-agency"
                          : cand.sourceType === "referral"
                          ? "badge-source-referral"
                          : "badge-source-direct"
                      }`}
                    >
                      {cand.source}
                    </span>
                    <span className="match-pill">{cand.matchScore}%</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidateId(cand.id);
                      }}
                    >
                      Scorecard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Consultancy Syndication Box */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: "1.05rem" }}>Live Placement Bounties</h3>
              <span className="badge badge-syndicated">{syndicatedJobs.length} Live in India</span>
            </div>

            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginBottom: 14 }}>
              These roles are actively dispatched to external consultancies (Naukri Elite, ABC, SutraHR) with automated candidate injection:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {syndicatedJobs.map((j) => (
                <div
                  key={j.id}
                  style={{
                    padding: "11px 13px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(124, 58, 237, 0.05)",
                    border: "1px solid rgba(124, 58, 237, 0.2)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                      {j.title}
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7c3aed" }}>
                      {j.agencyBounty}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                    {j.location} &bull; Comp: <strong>{j.salary}</strong>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", marginTop: 14, justifyContent: "center" }}
              onClick={() => setActiveRole("agency_portal")}
            >
              <Share2 size={14} />
              <span>Switch to Agency Recruiter View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
