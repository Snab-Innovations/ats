import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  MessageCircle,
  IndianRupee,
  GraduationCap,
  Sparkles,
  Send,
  Video,
  FileCheck,
  CheckCircle,
  Clock,
  Briefcase
} from "lucide-react";

export const CandidateDetailModal = () => {
  const {
    candidates,
    selectedCandidateId,
    setSelectedCandidateId,
    changeStage,
    addCandidateNote,
    setIsScheduleModalOpen,
    setSchedulingCandidate
  } = useAts();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'ctc_breakdown' | 'scorecard' | 'interview' | 'notes'
  const [newNote, setNewNote] = useState("");

  const candidate = candidates.find((c) => c.id === selectedCandidateId);
  if (!candidate) return null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addCandidateNote(candidate.id, newNote.trim(), "Vikram Singhania (VP Engineering)");
    setNewNote("");
  };

  const openWhatsApp = () => {
    const cleanPhone = candidate.phone?.replace(/[^0-9]/g, "") || "919820188492";
    const text = encodeURIComponent(
      `Hi ${candidate.name}, this is Vikram from BharatScale Cloud regarding your application for ${candidate.role}. Let's coordinate your next round!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const stages = [
    { id: "applied", label: "Applied" },
    { id: "screening", label: "Screening" },
    { id: "assessment", label: "Tech Assessment" },
    { id: "interview", label: "Interview" },
    { id: "offer", label: "Offer Released" },
    { id: "hired", label: "Joined" },
    { id: "rejected", label: "Archived" }
  ];

  return (
    <div className="modal-overlay" onClick={() => setSelectedCandidateId(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: 940, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div
              className="company-logo-avatar"
              style={{
                width: 50,
                height: 50,
                fontSize: "1.2rem",
                background: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)"
              }}
            >
              {candidate.name.split(" ").map((n) => n[0]).join("")}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: "1.35rem" }}>{candidate.name}</h2>
                <span className="match-pill" style={{ fontSize: "0.8rem", padding: "3px 8px" }}>
                  <Sparkles size={12} style={{ display: "inline", marginRight: 3 }} />
                  {candidate.matchScore}% Match Score
                </span>
              </div>

              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Candidate for <strong style={{ color: "var(--text-primary)" }}>{candidate.role}</strong>
              </div>

              {/* Source Tag & Notice Period */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <span
                  className={`badge ${
                    candidate.sourceType === "agency"
                      ? "badge-source-agency"
                      : candidate.sourceType === "referral"
                      ? "badge-source-referral"
                      : "badge-source-direct"
                  }`}
                  style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                >
                  Source: {candidate.source}
                </span>

                <span
                  className="badge badge-notice-immediate"
                  style={{ fontSize: "0.78rem" }}
                >
                  <Clock size={12} />
                  Notice: {candidate.noticePeriod || "30 Days"}
                </span>

                <span
                  className="badge badge-active"
                  style={{ fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: 5 }}
                >
                  <GraduationCap size={12} />
                  {candidate.education || "B.Tech CSE"}
                </span>

                <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                  Submitted on {candidate.submittedAt}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="btn btn-whatsapp btn-sm"
              onClick={openWhatsApp}
              title="Connect on WhatsApp"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Candidate</span>
            </button>

            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setSelectedCandidateId(null)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stage Progress Bar Selector */}
        <div className="modal-stage-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em", flexShrink: 0 }}>
              Stage:
            </span>

            <div className="stage-pill-list">
              {stages.map((st) => {
                const isCurrent = candidate.stage === st.id;
                const isRejected = st.id === "rejected";

                return (
                  <button
                    key={st.id}
                    className={`stage-step-btn ${isCurrent ? "active" : ""} ${isCurrent && isRejected ? "rejected" : ""}`}
                    onClick={() => changeStage(candidate.id, st.id)}
                  >
                    {isCurrent && <CheckCircle size={12} />}
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {candidate.stage !== "interview" && candidate.stage !== "hired" && (
            <button
              className="btn btn-accent btn-sm"
              style={{ flexShrink: 0, whiteSpace: "nowrap" }}
              onClick={() => {
                setSchedulingCandidate(candidate);
                setIsScheduleModalOpen(true);
              }}
            >
              <Calendar size={13} />
              <span>Schedule Interview Round</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs-container">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <Briefcase size={15} />
            <span>Profile & Resume</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "ctc_breakdown" ? "active" : ""}`}
            onClick={() => setActiveTab("ctc_breakdown")}
          >
            <IndianRupee size={15} />
            <span>CTC & Offer Breakdown</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "scorecard" ? "active" : ""}`}
            onClick={() => setActiveTab("scorecard")}
          >
            <FileCheck size={15} />
            <span>Evaluation Scorecard</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "interview" ? "active" : ""}`}
            onClick={() => setActiveTab("interview")}
          >
            <Calendar size={15} />
            <span>Interview Rounds</span>
            {candidate.interviewScheduled && (
              <span className="modal-tab-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669" }}>
                Scheduled
              </span>
            )}
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <MessageCircle size={15} />
            <span>Hiring Notes</span>
            <span className="modal-tab-badge">
              {candidate.notes?.length || 0}
            </span>
          </button>
        </div>

        {/* Modal Body Tabs */}
        <div className="modal-body" style={{ minHeight: 340 }}>
          {activeTab === "profile" && (
            <div>
              {/* Contact strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  padding: 16,
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-surface-elevated)",
                  marginBottom: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                  <Mail size={15} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{candidate.email}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                  <Phone size={15} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{candidate.phone || "+91 98201 88492"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                  <MapPin size={15} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{candidate.location}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                  <Building size={15} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{candidate.currentCompany}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                  <GraduationCap size={15} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>{candidate.education || "B.Tech CSE"}</span>
                </div>
              </div>

              {/* Indian Screening Questions */}
              {candidate.screeningAnswers && candidate.screeningAnswers.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: "0.95rem", marginBottom: 10, color: "var(--primary)" }}>
                    Candidate Screening Questionnaire
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {candidate.screeningAnswers.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "var(--radius-md)",
                          background: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border-subtle)"
                        }}
                      >
                        <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                          Q: {item.question}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-primary)", marginTop: 4 }}>
                          &ldquo;{item.answer}&rdquo;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume summary */}
              <div>
                <h4 style={{ fontSize: "0.95rem", marginBottom: 10 }}>Executive Candidate Profile</h4>
                <div
                  style={{
                    padding: 16,
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    color: "var(--text-secondary)"
                  }}
                >
                  <p>
                    <strong>{candidate.name}</strong> is a high-caliber engineer with <strong>{candidate.experience}</strong> of proven production experience, currently based out of <strong>{candidate.location}</strong> at <strong>{candidate.currentCompany}</strong>. Strong command over distributed system architectures, high-load microservices, and asynchronous technical leadership.
                  </p>

                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {candidate.tags &&
                      candidate.tags.map((tag, i) => (
                        <span key={i} className="badge badge-source-direct" style={{ fontSize: "0.75rem" }}>
                          #{tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ctc_breakdown" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Compensation & Offer Letter Matrix</h4>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    Indian CTC breakup, notice period buyout feasibility, and ESOP vesting
                  </p>
                </div>
                <span className="badge badge-notice-immediate" style={{ fontSize: "0.8rem", padding: "5px 12px" }}>
                  <Clock size={12} /> Notice Status: {candidate.noticePeriod}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div className="card" style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", padding: 18 }}>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em" }}>
                    Current CTC (Fixed + Variable)
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 6, letterSpacing: "-0.02em" }}>
                    {candidate.currentCtc || "₹24 LPA"}
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    Verified via previous salary slips and Form 16
                  </div>
                </div>

                <div className="card" style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", padding: 18 }}>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em" }}>
                    Expected CTC / Target Offer
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)", marginTop: 6, letterSpacing: "-0.02em" }}>
                    {candidate.expectedCtc || "₹35 LPA"}
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "#059669", fontWeight: 700, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", display: "inline-block" }}></span>
                    Within budget band for this requisition
                  </div>
                </div>
              </div>

              {/* Proposed Offer Breakup Table */}
              <div className="card" style={{ padding: 20, border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h5 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Suggested Offer Breakup (Annual INR)</h5>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Benchmark: 75th Percentile BLR Tech</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", fontSize: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Fixed Base Salary:</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹32,00,000</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Annual Performance Bonus (10%):</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹3,20,000</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Employer PF & Gratuity:</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹1,80,000</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>ESOP Grant (4-year vest with 1-year cliff):</span>
                    <strong style={{ color: "var(--primary)" }}>₹12,00,000 Total Value</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", marginTop: 6, background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)", fontWeight: 800, fontSize: "1rem", border: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-primary)" }}>Total CTC Package:</span>
                    <span style={{ color: "#059669" }}>₹37.0 LPA + ESOPs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scorecard" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ fontSize: "1rem" }}>Technical & Architectural Scorecard</h4>
                <div className="badge badge-active" style={{ fontSize: "0.85rem", padding: "4px 12px" }}>
                  Status: {candidate.scorecard?.recommendation || "Under Review"}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>System Architecture & Low-Latency</span>
                    <span style={{ color: "#0284c7", fontWeight: 700 }}>
                      {candidate.scorecard?.technicalSkills || 5}/5
                    </span>
                  </div>
                  <div className="source-bar-progress">
                    <div
                      className="source-bar-fill"
                      style={{
                        width: `${((candidate.scorecard?.technicalSkills || 5) / 5) * 100}%`,
                        background: "#0284c7"
                      }}
                    ></div>
                  </div>
                </div>

                <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>DSA & Machine Coding</span>
                    <span style={{ color: "#7c3aed", fontWeight: 700 }}>
                      {candidate.scorecard?.systemDesign || 4}/5
                    </span>
                  </div>
                  <div className="source-bar-progress">
                    <div
                      className="source-bar-fill"
                      style={{
                        width: `${((candidate.scorecard?.systemDesign || 4) / 5) * 100}%`,
                        background: "#7c3aed"
                      }}
                    ></div>
                  </div>
                </div>

                <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>Ownership & High-Agency Startup Fit</span>
                    <span style={{ color: "#059669", fontWeight: 700 }}>
                      {candidate.scorecard?.cultureAlignment || 5}/5
                    </span>
                  </div>
                  <div className="source-bar-progress">
                    <div
                      className="source-bar-fill"
                      style={{
                        width: `${((candidate.scorecard?.cultureAlignment || 5) / 5) * 100}%`,
                        background: "#059669"
                      }}
                    ></div>
                  </div>
                </div>

                <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>Async Communication & Collaboration</span>
                    <span style={{ color: "#d97706", fontWeight: 700 }}>
                      {candidate.scorecard?.communication || 4}/5
                    </span>
                  </div>
                  <div className="source-bar-progress">
                    <div
                      className="source-bar-fill"
                      style={{
                        width: `${((candidate.scorecard?.communication || 4) / 5) * 100}%`,
                        background: "#d97706"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div>
              {candidate.interviewScheduled ? (
                <div
                  style={{
                    padding: 20,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(219, 39, 119, 0.06)",
                    border: "1px solid rgba(219, 39, 119, 0.25)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Video size={20} color="#db2777" />
                      <h4 style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}>
                        {candidate.interviewScheduled.round}
                      </h4>
                    </div>
                    <span className="badge badge-active">Confirmed Round</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, fontSize: "0.875rem" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Date & Time: </span>
                      <strong style={{ color: "var(--text-primary)" }}>
                        {candidate.interviewScheduled.date} &bull; {candidate.interviewScheduled.time}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Interviewer: </span>
                      <strong style={{ color: "var(--text-primary)" }}>
                        {candidate.interviewScheduled.interviewer}
                      </strong>
                    </div>
                  </div>

                  <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                    <a
                      href={candidate.interviewScheduled.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ background: "#db2777" }}
                    >
                      <Video size={14} />
                      <span>Join Google Meet Call</span>
                    </a>

                    <button className="btn btn-whatsapp btn-sm" onClick={openWhatsApp}>
                      <MessageCircle size={14} />
                      <span>Send WhatsApp Reminder</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 24px",
                    background: "var(--bg-surface-elevated)",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <Calendar size={36} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                  <h4>No Interview Scheduled Yet</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4, marginBottom: 16 }}>
                    Select a time slot and interviewer to invite {candidate.name}.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSchedulingCandidate(candidate);
                      setIsScheduleModalOpen(true);
                    }}
                  >
                    <Calendar size={15} />
                    <span>Schedule Round Now</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <form onSubmit={handleAddNote} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Add interview feedback, CTC discussion notes, or next steps..."
                    className="form-input"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                    <Send size={15} />
                    <span>Post Note</span>
                  </button>
                </div>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {candidate.notes && candidate.notes.length > 0 ? (
                  candidate.notes.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-surface-elevated)",
                        borderLeft: "3px solid var(--primary)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                          {note.author}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {note.date}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {note.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>
                    No notes recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSelectedCandidateId(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
