import React, { useState, useEffect } from "react";
import { useAts } from "../context/AtsContext";
import {
  X,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  Check
} from "lucide-react";

export const StageTransitionModal = () => {
  const {
    stageTransitionPrompt,
    closeStageTransitionPrompt,
    changeStage,
    stageAlert,
    setStageAlert,
    company
  } = useAts();

  const [sendEmail, setSendEmail] = useState(true);
  const [subject, setSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const candidate = stageTransitionPrompt?.candidate;
  const newStage = stageTransitionPrompt?.newStage;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (stageTransitionPrompt) {
      const prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, [stageTransitionPrompt]);

  // Pre-fill stage transition email template when prompt opens
  useEffect(() => {
    if (!candidate || !newStage) return;

    setSendEmail(true);
    const compName = company?.name || "SNAB";
    const stageName = newStage.charAt(0).toUpperCase() + newStage.slice(1);
    setSubject(`Update regarding your application for ${candidate.role} at ${compName}`);

    let template = "";
    switch (newStage) {
      case "screening":
        template = `Hi ${candidate.name},\n\nThank you for applying for the ${candidate.role} position at ${compName}. We reviewed your profile and were impressed by your background.\n\nWe would like to advance you to our initial Screening Round. Our recruitment team will follow up shortly with a scheduling link to set up a convenient time.\n\nBest regards,\nTalent Acquisition Team\n${compName}`;
        break;
      case "assessment":
        template = `Hi ${candidate.name},\n\nGreat news! Your profile has progressed to the Technical Assessment stage for the ${candidate.role} role at ${compName}.\n\nWe have attached the instructions for your technical evaluation. Please review the details and let us know if you have any questions.\n\nBest regards,\nEngineering Team\n${compName}`;
        break;
      case "interview":
        template = `Hi ${candidate.name},\n\nWe are delighted to invite you to the Technical Interview stage for the ${candidate.role} position at ${compName}.\n\nOur engineering panel is looking forward to discussing your systems architecture background and past projects. We will share your interview coordinates shortly.\n\nBest regards,\nEngineering Leadership, ${compName}`;
        break;
      case "offer":
        template = `Dear ${candidate.name},\n\nWe are thrilled to let you know that you have successfully cleared all evaluation rounds for the ${candidate.role} role at ${compName}!\n\nOur executive team has approved your formal offer package. A comprehensive offer letter with compensation breakdown and ESOP grant details has been prepared.\n\nWarm congratulations,\nPeople & Talent Operations\n${compName}`;
        break;
      case "hired":
        template = `Welcome to ${compName}, ${candidate.name}!\n\nYour onboarding as ${candidate.role} is officially confirmed. Our HR operations team will be sending over your welcome kit, system credentials, and orientation schedule.\n\nWe are excited to build next-generation software with you!\n\nBest regards,\nTeam ${compName}`;
        break;
      case "rejected":
        template = `Dear ${candidate.name},\n\nThank you for taking the time to interview with ${compName} for the ${candidate.role} opportunity. While our panel was very impressed with your achievements, we have decided to proceed with another applicant whose profile aligns more closely with our immediate requirements.\n\nWe will retain your resume in our talent network for future high-impact roles. We wish you every success in your ongoing career search.\n\nBest regards,\nTalent Advisory Pod\n${compName}`;
        break;
      default:
        template = `Hi ${candidate.name},\n\nYour application status for the ${candidate.role} role has been updated to ${stageName}. We will keep you updated on subsequent milestones.\n\nBest regards,\n${compName} Hiring Team`;
        break;
    }

    setCustomMessage(template);
  }, [candidate, newStage]);

  if (!stageTransitionPrompt && !stageAlert) return null;

  // Handler: User clicks "Send Email & Update Stage"
  const handleConfirmWithEmail = () => {
    if (!candidate || !newStage) return;

    const note = `[Email Sent to ${candidate.email} - ${newStage.toUpperCase()}]: "${customMessage.slice(0, 140)}..."`;
    changeStage(candidate.id, newStage, note);

    // Show Alert with the sent custom message
    setStageAlert({
      isOpen: true,
      type: "email_sent",
      title: "Email Notification Sent & Stage Updated",
      recipient: candidate.email,
      candidateName: candidate.name,
      newStage: newStage,
      subject: subject,
      customMsg: customMessage
    });

    closeStageTransitionPrompt();
  };

  // Handler: User clicks "Update Stage Only (No Email)"
  const handleConfirmWithoutEmail = () => {
    if (!candidate || !newStage) return;

    const note = `Stage updated to ${newStage.toUpperCase()} (No notification email sent)`;
    changeStage(candidate.id, newStage, note);

    // Show Alert indicating stage was updated without email
    setStageAlert({
      isOpen: true,
      type: "stage_only",
      title: "Stage Updated (No Email Sent)",
      recipient: candidate.email,
      candidateName: candidate.name,
      newStage: newStage,
      subject: null,
      customMsg: null
    });

    closeStageTransitionPrompt();
  };

  return (
    <>
      {/* 1. STAGE TRANSITION CONFIRMATION & EMAIL COMPOSER MODAL */}
      {stageTransitionPrompt && candidate && (
        <div
          className="stage-modal-overlay"
          onClick={closeStageTransitionPrompt}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="stage-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
              maxWidth: 580,
              width: "92vw",
              overflow: "hidden",
              animation: "fadeInScale 0.18s ease-out"
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                background: "var(--bg-surface-elevated)",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "rgba(79, 70, 229, 0.12)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Mail size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>
                    Confirm Stage Change & Notification
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                    Update candidate stage and optionally send custom email
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ width: 28, height: 28, padding: 0, borderRadius: "50%" }}
                onClick={closeStageTransitionPrompt}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Candidate Info & Stage Pipeline Stepper Indicator */}
              <div
                style={{
                  background: "var(--bg-surface-elevated)",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 10
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", display: "block" }}>
                    {candidate.name}
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {candidate.role} &bull; <strong style={{ color: "var(--text-secondary)" }}>{candidate.email}</strong>
                  </span>
                </div>

                {/* Transition Flow Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                      textTransform: "capitalize"
                    }}
                  >
                    {candidate.stage}
                  </span>

                  <ArrowRight size={13} color="var(--primary)" />

                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: newStage === "rejected" ? "rgba(220, 38, 38, 0.12)" : "rgba(16, 185, 129, 0.12)",
                      border: `1px solid ${newStage === "rejected" ? "rgba(220, 38, 38, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
                      color: newStage === "rejected" ? "#dc2626" : "#059669",
                      textTransform: "capitalize"
                    }}
                  >
                    {newStage}
                  </span>
                </div>
              </div>

              {/* Email Toggle Option */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: sendEmail ? "rgba(79, 70, 229, 0.06)" : "var(--bg-surface-elevated)",
                  border: `1px solid ${sendEmail ? "rgba(79, 70, 229, 0.25)" : "var(--border-subtle)"}`,
                  cursor: "pointer"
                }}
                onClick={() => setSendEmail(!sendEmail)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    id="stage-send-email-checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--primary)" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <label
                      htmlFor="stage-send-email-checkbox"
                      style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)", cursor: "pointer" }}
                    >
                      Send notification email to candidate
                    </label>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      Dispatches status email to <strong style={{ color: "var(--primary)" }}>{candidate.email}</strong>
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 4,
                    background: sendEmail ? "rgba(16, 185, 129, 0.12)" : "rgba(148, 163, 184, 0.15)",
                    color: sendEmail ? "#059669" : "var(--text-muted)"
                  }}
                >
                  {sendEmail ? "Mail Enabled" : "No Email"}
                </span>
              </div>

              {/* Custom Subject & Message Composer (Active when sendEmail is true) */}
              {sendEmail ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                      Email Subject
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      style={{ fontSize: "0.825rem", height: 36, width: "100%" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                        Custom Message Body
                      </label>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        Editable template for {newStage} stage
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      className="form-input"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      style={{
                        fontSize: "0.8rem",
                        fontFamily: "var(--font-sans)",
                        lineHeight: 1.5,
                        padding: "10px 12px",
                        width: "100%",
                        resize: "vertical"
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: 8,
                    background: "rgba(180, 83, 9, 0.06)",
                    border: "1px solid rgba(180, 83, 9, 0.2)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10
                  }}
                >
                  <AlertCircle size={16} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    <strong>Quiet update selected:</strong> The candidate will be moved to stage <strong>{newStage}</strong> without triggering any outbound email notification.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div
              style={{
                padding: "14px 20px",
                background: "var(--bg-surface-elevated)",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap"
              }}
            >
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={closeStageTransitionPrompt}
              >
                Cancel
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Secondary Option: Update Stage Without Email */}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleConfirmWithoutEmail}
                  style={{ fontSize: "0.78rem", padding: "6px 12px" }}
                  title="Update stage without sending any email"
                >
                  <span>Update Stage (No Email)</span>
                </button>

                {/* Primary Option: Send Email & Update Stage */}
                {sendEmail && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleConfirmWithEmail}
                    style={{ fontSize: "0.78rem", padding: "6px 14px", gap: 6 }}
                  >
                    <Send size={13} />
                    <span>Send Email & Update Stage</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROMINENT CONFIRMATION ALERT / TOAST WITH CUSTOM MESSAGE DISPLAY */}
      {stageAlert && (
        <div
          className="stage-alert-overlay"
          onClick={() => setStageAlert(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(3px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            animation: "fadeIn 0.15s ease-out"
          }}
        >
          <div
            className="stage-alert-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
              maxWidth: 520,
              width: "100%",
              overflow: "hidden",
              animation: "fadeInScale 0.18s ease-out"
            }}
          >
            {/* Alert Header */}
            <div
              style={{
                padding: "16px 20px",
                background:
                  stageAlert.type === "email_sent"
                    ? "rgba(16, 185, 129, 0.08)"
                    : "rgba(79, 70, 229, 0.08)",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      stageAlert.type === "email_sent" ? "#10b981" : "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {stageAlert.type === "email_sent" ? <Check size={18} /> : <CheckCircle size={18} />}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>
                    {stageAlert.title}
                  </h4>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                    Candidate: <strong>{stageAlert.candidateName}</strong> &bull; Stage: <strong style={{ textTransform: "capitalize", color: "var(--primary)" }}>{stageAlert.newStage}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ width: 28, height: 28, padding: 0, borderRadius: "50%" }}
                onClick={() => setStageAlert(null)}
              >
                <X size={15} />
              </button>
            </div>

            {/* Alert Body */}
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {stageAlert.type === "email_sent" ? (
                <>
                  <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                    Email has been dispatched to <strong>{stageAlert.recipient}</strong> with the following custom message:
                  </div>

                  {stageAlert.subject && (
                    <div style={{ fontSize: "0.78rem", background: "var(--bg-surface-elevated)", padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-subtle)" }}>
                      <strong style={{ color: "var(--text-muted)" }}>Subject:</strong> {stageAlert.subject}
                    </div>
                  )}

                  {/* The Custom Message Displayed Exactly as Requested! */}
                  <div
                    style={{
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderLeft: "3px solid #10b981",
                      borderRadius: 6,
                      padding: "12px 14px",
                      fontSize: "0.8rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                      maxHeight: 220,
                      overflowY: "auto"
                    }}
                  >
                    {stageAlert.customMsg}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  The candidate's stage was updated to <strong>{stageAlert.newStage.toUpperCase()}</strong>.
                  <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    No outbound email was sent to {stageAlert.recipient}.
                  </div>
                </div>
              )}
            </div>

            {/* Alert Footer */}
            <div
              style={{
                padding: "12px 20px",
                background: "var(--bg-surface-elevated)",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setStageAlert(null)}
                style={{ padding: "5px 16px", fontSize: "0.78rem" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
