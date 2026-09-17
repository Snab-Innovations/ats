import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import {
  Search,
  Filter,
  Users,
  ChevronRight,
  Calendar,
  Sparkles,
  Zap,
  MessageCircle,
  Clock,
  IndianRupee,
  GraduationCap
} from "lucide-react";

export const CandidatePipeline = () => {
  const {
    jobs,
    candidates,
    changeStage,
    setSelectedCandidateId,
    setIsScheduleModalOpen,
    setSchedulingCandidate
  } = useAts();

  const [jobFilter, setJobFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [noticeFilter, setNoticeFilter] = useState("all"); // 'all' | 'immediate' | 'serving'
  const [searchQuery, setSearchQuery] = useState("");

  const stages = [
    { id: "applied", label: "Applied", color: "var(--status-applied)" },
    { id: "screening", label: "Screening", color: "var(--status-screening)" },
    { id: "assessment", label: "Tech Assessment", color: "var(--status-assessment)" },
    { id: "interview", label: "Interviews", color: "var(--status-interview)" },
    { id: "offer", label: "Offer Released", color: "var(--status-offer)" },
    { id: "hired", label: "Joined / Hired", color: "var(--status-hired)" },
    { id: "rejected", label: "Archived", color: "var(--status-rejected)" }
  ];

  // Filtering logic
  const filteredCandidates = candidates.filter((c) => {
    const matchesJob = jobFilter === "all" || c.jobId === jobFilter;
    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "experthire_platform" && (c.sourceType === "experthire_platform" || c.source?.includes("ExpertHire"))) ||
      (sourceFilter === "direct" && c.sourceType === "direct") ||
      (sourceFilter === "agency" && c.sourceType === "agency") ||
      (sourceFilter === "referral" && c.sourceType === "referral");
    
    const matchesNotice =
      noticeFilter === "all" ||
      (noticeFilter === "immediate" && (c.noticeType === "immediate" || c.noticePeriod?.toLowerCase().includes("immediate"))) ||
      (noticeFilter === "serving" && (c.noticeType === "serving" || c.noticePeriod?.toLowerCase().includes("serving") || c.noticePeriod?.includes("15")));

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.education && c.education.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesJob && matchesSource && matchesNotice && matchesSearch;
  });

  const getSourceBadgeClass = (sourceType, source = "") => {
    if (sourceType === "experthire_platform" || source?.includes("ExpertHire")) return "badge-source-experthire";
    if (sourceType === "agency") return "badge-source-agency";
    if (sourceType === "referral") return "badge-source-referral";
    return "badge-source-direct";
  };

  const getNextStage = (currentStage) => {
    const order = ["applied", "screening", "assessment", "interview", "offer", "hired"];
    const idx = order.indexOf(currentStage);
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
  };

  const openWhatsApp = (e, cand) => {
    e.stopPropagation();
    const cleanPhone = cand.phone?.replace(/[^0-9]/g, "") || "919820188492";
    const text = encodeURIComponent(
      `Hi ${cand.name}, this is Sarah from BharatScale Cloud regarding your application for the ${cand.role} role. Are you available for a brief sync?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="admin-main">
      <header className="page-header">
        <div className="page-title-group">
          <h1>India Tech Recruitment Pipeline</h1>
          <p>
            Track candidate lifecycle from referral / agency submission through machine coding, system design, and offer rollout
          </p>
        </div>

        <div className="header-actions">
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Matching Candidates: <strong style={{ color: "var(--text-primary)" }}>{filteredCandidates.length}</strong>
          </div>
        </div>
      </header>

      <div className="page-content">
        {/* Filters Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 320, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Search by name, IIT/BITS, Razorpay, Go..."
                className="form-input"
                style={{ paddingLeft: 38 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Job Filter */}
            <select
              className="form-select"
              style={{ width: 220 }}
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="all">All Job Requisitions</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>

            {/* Sourcing Channel Filter */}
            <select
              className="form-select"
              style={{ width: 180 }}
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="all">All Channels</option>
              <option value="experthire_platform">ExpertHire Platform</option>
              <option value="direct">Direct Career Site</option>
              <option value="agency">Consultancies</option>
              <option value="referral">Internal Referrals</option>
            </select>

            {/* Immediate Joiner Quick Filter Button */}
            <button
              type="button"
              className={`btn btn-sm ${noticeFilter === "immediate" ? "btn-primary" : "btn-secondary"}`}
              style={{
                fontSize: "0.78rem",
                color: noticeFilter === "immediate" ? "#fff" : "#059669",
                borderColor: "#059669"
              }}
              onClick={() => setNoticeFilter(noticeFilter === "immediate" ? "all" : "immediate")}
            >
              <Zap size={13} />
              <span>Immediate Joiners</span>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.775rem", color: "var(--text-muted)" }}>
            <span>Click candidate card for CTC scorecard & offer generator</span>
          </div>
        </div>

        {/* Kanban Board Columns */}
        <div className="kanban-board">
          {stages.map((stage) => {
            const columnCandidates = filteredCandidates.filter((c) => c.stage === stage.id);

            return (
              <div key={stage.id} className="kanban-column">
                <div className="kanban-column-header">
                  <div className="kanban-col-title">
                    <span className="col-dot" style={{ background: stage.color }}></span>
                    <span>{stage.label}</span>
                  </div>
                  <span className="kanban-col-count">{columnCandidates.length}</span>
                </div>

                <div className="kanban-card-list">
                  {columnCandidates.length === 0 ? (
                    <div
                      style={{
                        padding: "32px 16px",
                        textAlign: "center",
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontStyle: "italic"
                      }}
                    >
                      No candidates in {stage.label}
                    </div>
                  ) : (
                    columnCandidates.map((cand) => {
                      const nextStage = getNextStage(cand.stage);
                      const isImmediate = cand.noticeType === "immediate" || cand.noticePeriod?.toLowerCase().includes("immediate");

                      return (
                        <div
                          key={cand.id}
                          className="candidate-card"
                          onClick={() => setSelectedCandidateId(cand.id)}
                        >
                          <div className="candidate-card-top">
                            <div>
                              <div className="candidate-name">{cand.name}</div>
                              <div className="candidate-role">{cand.role}</div>
                            </div>
                            <span className="match-pill">{cand.matchScore}%</span>
                          </div>

                          <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                            {cand.currentCompany} &bull; {cand.location?.split(",")[0]}
                          </div>

                          {/* CTC & Notice Period Details */}
                          <div
                            style={{
                              background: "var(--bg-surface-elevated)",
                              padding: "6px 8px",
                              borderRadius: 6,
                              fontSize: "0.75rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: 2
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--text-muted)" }}>Current &rarr; Expected:</span>
                              <strong style={{ color: "var(--text-primary)" }}>
                                {cand.currentCtc} &rarr; {cand.expectedCtc}
                              </strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "var(--text-muted)" }}>Notice Period:</span>
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: isImmediate ? "#059669" : "#b45309"
                                }}
                              >
                                {cand.noticePeriod?.split("(")[0]}
                              </span>
                            </div>
                          </div>

                          {/* Source & College Tag */}
                          <div className="candidate-card-meta">
                            <span className={`badge ${getSourceBadgeClass(cand.sourceType, cand.source)}`}>
                              {cand.source}
                            </span>
                            {cand.education && (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  color: "var(--text-secondary)",
                                  background: "var(--bg-surface-elevated)",
                                  border: "1px solid var(--border-subtle)",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3
                                }}
                              >
                                <GraduationCap size={11} />
                                {cand.education.split("(")[0]}
                              </span>
                            )}
                          </div>

                          {/* Interview date tag if scheduled */}
                          {cand.interviewScheduled && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(219, 39, 119, 0.08)",
                                border: "1px solid rgba(219, 39, 119, 0.2)",
                                padding: "4px 8px",
                                borderRadius: 6,
                                fontSize: "0.725rem",
                                color: "#db2777",
                                fontWeight: 600
                              }}
                            >
                              <Calendar size={12} />
                              <span>{cand.interviewScheduled.date} ({cand.interviewScheduled.time})</span>
                            </div>
                          )}

                          {/* Footer: WhatsApp quick message & Advance Stage button */}
                          <div className="candidate-card-footer" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ padding: "2px 6px", color: "#16a34a", fontSize: "0.72rem" }}
                              title="Connect on WhatsApp"
                              onClick={(e) => openWhatsApp(e, cand)}
                            >
                              <MessageCircle size={13} />
                              <span>WhatsApp</span>
                            </button>

                            <div style={{ display: "flex", gap: 6 }}>
                              {cand.stage !== "interview" && cand.stage !== "hired" && cand.stage !== "rejected" && (
                                <button
                                  className="btn btn-ghost btn-sm"
                                  style={{ padding: "2px 6px", fontSize: "0.72rem" }}
                                  title="Schedule Round"
                                  onClick={() => {
                                    setSchedulingCandidate(cand);
                                    setIsScheduleModalOpen(true);
                                  }}
                                >
                                  <Calendar size={12} />
                                </button>
                              )}

                              {nextStage && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: "3px 9px", fontSize: "0.72rem" }}
                                  title={`Advance to ${nextStage}`}
                                  onClick={() => changeStage(cand.id, nextStage)}
                                >
                                  <span>Advance</span>
                                  <ChevronRight size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
