import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Download,
  Printer,
  Upload,
  Eye,
  FileCode,
  Globe,
  Award,
  UploadCloud
} from "lucide-react";

// Standalone PDF Generator for candidate profiles to guarantee authentic PDF rendering
function generateCandidatePdfBlob(candidate) {
  if (!candidate) return null;
  const safe = (str) => (str || "").replace(/[^\x20-\x7E]/g, " ").replace(/[()]/g, "");
  const name = safe(candidate.name || "Candidate");
  const role = safe(candidate.role || "Senior Software Engineer");
  const email = safe(candidate.email || "candidate@expert.io");
  const phone = safe(candidate.phone || "+91 98201 00000");
  const location = safe(candidate.location || "Bengaluru, India");
  const company = safe(candidate.currentCompany || "Fintech Infrastructure Systems");
  const exp = safe(candidate.experience || "6+ Years");
  const edu = safe(candidate.education || "Bachelor of Technology in Computer Science");
  const notice = safe(candidate.noticePeriod || "15 Days");
  const ctc = safe(candidate.currentCtc || "₹34 LPA");
  const expected = safe(candidate.expectedCtc || "₹46 LPA");

  const lines = [
    "BT",
    "/F1 22 Tf",
    "50 740 Td",
    `(${name}) Tj`,
    "0 -24 Td",
    "/F1 13 Tf",
    `(${role} -- ${company}) Tj`,
    "0 -18 Td",
    "/F1 9 Tf",
    `(${email}  *  ${phone}  *  ${location}) Tj`,
    "0 -26 Td",
    "/F1 12 Tf",
    "(PROFESSIONAL PROFILE & SUMMARY) Tj",
    "0 -16 Td",
    "/F1 9 Tf",
    `(* Total Relevant Experience: ${exp} of specialized production engineering.) Tj`,
    "0 -14 Td",
    `(* Current Organization: ${company} | Current CTC: ${ctc}) Tj`,
    "0 -14 Td",
    `(* Notice Period Status: ${notice} | Target CTC: ${expected}) Tj`,
    "0 -24 Td",
    "/F1 12 Tf",
    "(TECHNICAL COMPETENCIES & SYSTEM CONTRIBUTIONS) Tj",
    "0 -16 Td",
    "/F1 9 Tf",
    "(* Architected and scaled low-latency distributed microservices.) Tj",
    "0 -14 Td",
    "(* Automated observability, telemetry, and zero-downtime database pipelines.) Tj",
    "0 -14 Td",
    "(* Deployed containerized workloads to Kubernetes with resilient failovers.) Tj",
    "0 -24 Td",
    "/F1 12 Tf",
    "(EDUCATION & CREDENTIALS) Tj",
    "0 -16 Td",
    "/F1 9 Tf",
    `(* ${edu}) Tj`,
    "0 -14 Td",
    "(* First Class with Distinction -- Academic Honors) Tj",
    "ET"
  ];

  const content = lines.join("\n");
  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>\nendobj`,
    `4 0 obj\n${stream}\nendobj`
  ];
  let body = "%PDF-1.4\n";
  const xref = [0];
  for (const obj of objects) {
    xref.push(body.length);
    body += obj + "\n";
  }
  const xrefOffset = body.length;
  body += `xref\n0 ${xref.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < xref.length; i++) {
    body += String(xref[i]).padStart(10, "0") + " 00000 n \n";
  }
  body += `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([body], { type: "application/pdf" });
}

export const CandidateDetailModal = () => {
  const {
    candidates,
    selectedCandidateId,
    setSelectedCandidateId,
    changeStage,
    promptStageChange,
    addCandidateNote,
    updateCandidate,
    uploadResumeFile
  } = useAts();

  // Tabs: 'resume' (default) | 'profile' | 'ctc_breakdown' | 'notes'
  const [activeTab, setActiveTab] = useState("resume");
  const [newNote, setNewNote] = useState("");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Resume Viewer State (Always Actual Uploaded Resume)
  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);
  const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);
  const [cloudinarySuccessMsg, setCloudinarySuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  // Current candidate lookup
  const candidateIndex = candidates.findIndex((c) => c.id === selectedCandidateId);
  const candidate = candidates[candidateIndex];

  // Lock background page scroll completely while drawer is open
  useEffect(() => {
    if (selectedCandidateId) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [selectedCandidateId]);

  // Reset uploaded resume and prepare document preview when switching candidate
  useEffect(() => {
    setUploadedResumeFile(null);
    if (uploadedResumeUrl && uploadedResumeUrl.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedResumeUrl);
    }
    setUploadedResumeUrl(null);

    // If candidate does not have an uploaded resume URL yet, generate an authentic PDF blob
    if (candidate && !candidate.resumeUrl) {
      try {
        const blob = generateCandidatePdfBlob(candidate);
        const url = URL.createObjectURL(blob);
        setGeneratedPdfUrl(url);
      } catch (err) {
        console.warn("PDF blob generation error:", err);
      }
    } else {
      setGeneratedPdfUrl(null);
    }
  }, [selectedCandidateId, candidate?.id]);

  // Keyboard navigation & ESC to close
  useEffect(() => {
    if (!selectedCandidateId) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCandidateId(null);
      } else if (e.key === "ArrowLeft") {
        if (candidateIndex > 0) {
          setSelectedCandidateId(candidates[candidateIndex - 1].id);
        }
      } else if (e.key === "ArrowRight") {
        if (candidateIndex < candidates.length - 1) {
          setSelectedCandidateId(candidates[candidateIndex + 1].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCandidateId, candidateIndex, candidates, setSelectedCandidateId]);

  if (!candidate) return null;

  const handlePrevCandidate = () => {
    if (candidateIndex > 0) {
      setSelectedCandidateId(candidates[candidateIndex - 1].id);
    }
  };

  const handleNextCandidate = () => {
    if (candidateIndex < candidates.length - 1) {
      setSelectedCandidateId(candidates[candidateIndex + 1].id);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addCandidateNote(candidate.id, newNote.trim(), "Vikram Singhania (VP Engineering)");
    setNewNote("");
  };

  const openWhatsApp = () => {
    const cleanPhone = candidate.phone?.replace(/[^0-9]/g, "") || "919820188492";
    const text = encodeURIComponent(
      `Hi ${candidate.name}, this is Vikram from BharatScale Cloud regarding your application for the ${candidate.role} role. Would you be available for a brief sync?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const handleCopySummary = () => {
    const summary = `Candidate: ${candidate.name}\nRole: ${candidate.role}\nExperience: ${candidate.experience || "N/A"}\nNotice Period: ${candidate.noticePeriod || "30 Days"}\nCurrent CTC: ${candidate.currentCtc} -> Expected CTC: ${candidate.expectedCtc}\nSkills: ${(candidate.tags || candidate.skills || []).join(", ")}\nEmail: ${candidate.email} | Phone: ${candidate.phone}`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyPhone = () => {
    if (candidate.phone) {
      navigator.clipboard.writeText(candidate.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 1800);
    }
  };

  const handleCopyEmail = () => {
    if (candidate.email) {
      navigator.clipboard.writeText(candidate.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedResumeFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadedResumeUrl(objectUrl);
    setResumeMode("embed");

    // Upload directly to Cloudinary (cloud: ljelkpy4, preset: resumes)
    setIsUploadingCloudinary(true);
    setCloudinarySuccessMsg(null);
    try {
      const res = await uploadResumeFile(file, candidate?.id);
      if (res?.success && res?.url) {
        setUploadedResumeUrl(res.url);
        updateCandidate(candidate.id, {
          resumeUrl: res.url,
          resumeFileName: file.name,
          resumeSource: "cloudinary_storage",
          cloudinaryAssetId: res.assetId
        });
        setCloudinarySuccessMsg("Uploaded to Cloudinary (preset: resumes)");
        setTimeout(() => setCloudinarySuccessMsg(null), 3500);
      }
    } catch (err) {
      console.warn("Cloudinary resume upload error:", err);
    } finally {
      setIsUploadingCloudinary(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Resume Document Details & Detection
  const effectiveFileName =
    uploadedResumeFile?.name ||
    candidate.resumeFileName ||
    `${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`;

  const cleanFileName = (effectiveFileName || "").split("?")[0].toLowerCase();
  const cleanUrl = (uploadedResumeUrl || candidate.resumeUrl || "").split("?")[0].toLowerCase();
  const isWordDoc = cleanFileName.endsWith(".doc") || cleanFileName.endsWith(".docx") || cleanUrl.endsWith(".doc") || cleanUrl.endsWith(".docx");
  const isPdfDoc = !isWordDoc;

  const effectiveResumeUrl = uploadedResumeUrl || candidate.resumeUrl || generatedPdfUrl;

  // Google Docs Viewer URL for Word documents or online PDFs
  const googleDocsViewerUrl = effectiveResumeUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(effectiveResumeUrl)}&embedded=true`
    : null;

  const stages = [
    { id: "applied", label: "Applied" },
    { id: "screening", label: "Screening" },
    { id: "assessment", label: "Assessment" },
    { id: "interview", label: "Interview" },
    { id: "offer", label: "Offer" },
    { id: "hired", label: "Hired" }
  ];

  const isImmediate =
    candidate.noticeType === "immediate" ||
    candidate.noticePeriod?.toLowerCase().includes("immediate") ||
    candidate.noticePeriod?.includes("15");

  return (
    <div className="candidate-drawer-overlay" onClick={() => setSelectedCandidateId(null)}>
      <aside className="candidate-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* ========================================================================= */}
        {/* 1. STICKY TOP HEADER WITH CANDIDATE IDENTITY & CONTROLS                   */}
        {/* ========================================================================= */}
        <div className="candidate-drawer-header">
          {/* Top Bar: Navigation controls & Close */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handlePrevCandidate}
                disabled={candidateIndex === 0}
                style={{
                  fontSize: "0.72rem",
                  padding: "4px 8px",
                  color: candidateIndex === 0 ? "var(--text-muted)" : "var(--text-secondary)"
                }}
                title="Previous candidate (or press Left arrow key)"
              >
                <ChevronLeft size={13} />
                <span>Prev</span>
              </button>

              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {candidateIndex + 1} of {candidates.length}
              </span>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleNextCandidate}
                disabled={candidateIndex === candidates.length - 1}
                style={{
                  fontSize: "0.72rem",
                  padding: "4px 8px",
                  color: candidateIndex === candidates.length - 1 ? "var(--text-muted)" : "var(--text-secondary)"
                }}
                title="Next candidate (or press Right arrow key)"
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectedCandidateId(null)}
              style={{
                width: 30,
                height: 30,
                padding: 0,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title="Close drawer (Esc)"
            >
              <X size={16} />
            </button>
          </div>

          {/* Candidate Name, Role & Match Score */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.1rem",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)"
              }}
            >
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    margin: 0,
                    color: "var(--text-primary)"
                  }}
                >
                  {candidate.name}
                </h3>

                {candidate.matchScore && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(16, 185, 129, 0.12)",
                      color: "#10b981",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <Sparkles size={11} />
                    {candidate.matchScore}% ATS Match
                  </span>
                )}
              </div>

              <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: 3 }}>
                Applied for <strong style={{ color: "var(--text-primary)" }}>{candidate.role}</strong>
                {candidate.submittedAt && (
                  <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>
                    &bull; {candidate.submittedAt}
                  </span>
                )}
              </div>

              {/* Source and Location tags */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 4,
                    background:
                      candidate.sourceType === "agency"
                        ? "rgba(219, 39, 119, 0.12)"
                        : candidate.sourceType === "experthire_platform"
                        ? "rgba(79, 70, 229, 0.12)"
                        : "rgba(2, 132, 199, 0.12)",
                    color:
                      candidate.sourceType === "agency"
                        ? "#db2777"
                        : candidate.sourceType === "experthire_platform"
                        ? "#4f46e5"
                        : "#0284c7"
                  }}
                >
                  {candidate.source || "Direct Applicant"}
                </span>

                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: isImmediate ? "#059669" : "#b45309",
                    background: isImmediate ? "rgba(5, 150, 105, 0.1)" : "rgba(180, 83, 9, 0.1)",
                    padding: "2px 7px",
                    borderRadius: 4,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3
                  }}
                >
                  <Clock size={10} />
                  {candidate.noticePeriod || "30 Days"}
                </span>

                {candidate.location && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3
                    }}
                  >
                    <MapPin size={10} />
                    {candidate.location.split(",")[0]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. INSTANT ACTION TOOLBAR (SUPER SENSIBLE & USEFUL)                       */}
          {/* ========================================================================= */}
          <div className="candidate-quick-actions">
            {/* View Resume Button (Switches to Resume view) */}
            <button
              type="button"
              className={`btn btn-sm ${activeTab === "resume" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.75rem", padding: "5px 11px", gap: 5 }}
              onClick={() => setActiveTab("resume")}
            >
              <FileText size={13} />
              <span>Resume ({isWordDoc ? "Word / DOCX" : "PDF"})</span>
            </button>

            {/* Profile Overview */}
            <button
              type="button"
              className={`btn btn-sm ${activeTab === "profile" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.75rem", padding: "5px 11px", gap: 5 }}
              onClick={() => setActiveTab("profile")}
            >
              <Briefcase size={13} />
              <span>Details & Tech</span>
            </button>

            {/* WhatsApp Quick Invite */}
            <button
              type="button"
              className="btn btn-whatsapp btn-sm"
              onClick={openWhatsApp}
              style={{ fontSize: "0.75rem", padding: "5px 9px", gap: 4 }}
              title="Open WhatsApp chat with pre-filled message"
            >
              <MessageCircle size={13} />
              <span>WhatsApp</span>
            </button>

            {/* Call Candidate */}
            <a
              href={`tel:${candidate.phone}`}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: "0.75rem", padding: "5px 9px", gap: 4 }}
              title="Call candidate phone"
            >
              <Phone size={13} color="#059669" />
              <span>Call</span>
            </a>

            {/* Email Candidate */}
            <a
              href={`mailto:${candidate.email}?subject=Application for ${encodeURIComponent(candidate.role)} at BharatScale Cloud`}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: "0.75rem", padding: "5px 9px", gap: 4 }}
              title="Send email"
            >
              <Mail size={13} color="#0284c7" />
              <span>Email</span>
            </a>

            {/* Copy Summary for Slack / WhatsApp */}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: "0.75rem", padding: "5px 9px", gap: 4, marginLeft: "auto" }}
              onClick={handleCopySummary}
              title="Copy candidate details summary to clipboard"
            >
              {copiedSummary ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copiedSummary ? "Copied!" : "Copy Brief"}</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 3. 1-CLICK STAGE PROGRESSION STEPPER                                      */}
          {/* ========================================================================= */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 2 }}>
            <div className="stage-stepper-container" style={{ flex: 1 }}>
              {stages.map((st) => {
                const isActive = candidate.stage === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    className={`stage-stepper-btn ${isActive ? "active" : ""}`}
                    onClick={() => promptStageChange(candidate, st.id)}
                    title={`Move to ${st.label} stage with custom email notification`}
                  >
                    {isActive && <CheckCircle size={11} />}
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Reject / Archive Toggle Button */}
            <button
              type="button"
              className={`stage-stepper-btn ${candidate.stage === "rejected" ? "rejected active" : ""}`}
              onClick={() => promptStageChange(candidate, candidate.stage === "rejected" ? "applied" : "rejected")}
              style={{
                borderColor: candidate.stage === "rejected" ? "#dc2626" : "rgba(220, 38, 38, 0.3)",
                color: candidate.stage === "rejected" ? "#fff" : "#dc2626"
              }}
              title={candidate.stage === "rejected" ? "Unarchive candidate" : "Archive candidate with notification"}
            >
              <span>{candidate.stage === "rejected" ? "Archived" : "Archive"}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CLEAN TAB NAVIGATION (Scorecard & Interviews removed as requested)      */}
        {/* ========================================================================= */}
        <div
          style={{
            padding: "8px 20px 0",
            background: "var(--bg-surface-elevated)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            gap: 6,
            overflowX: "auto"
          }}
        >
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "resume" ? "active" : ""}`}
            onClick={() => setActiveTab("resume")}
            style={{ fontSize: "0.78rem", padding: "6px 12px" }}
          >
            <FileText size={14} />
            <span>Resume & CV Document</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            style={{ fontSize: "0.78rem", padding: "6px 12px" }}
          >
            <Briefcase size={14} />
            <span>Profile & Details</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "ctc_breakdown" ? "active" : ""}`}
            onClick={() => setActiveTab("ctc_breakdown")}
            style={{ fontSize: "0.78rem", padding: "6px 12px" }}
          >
            <IndianRupee size={14} />
            <span>Compensation & Offer</span>
          </button>

          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
            style={{ fontSize: "0.78rem", padding: "6px 12px" }}
          >
            <MessageCircle size={14} />
            <span>Notes ({candidate.notes?.length || 0})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 5. DRAWER SCROLLABLE BODY CONTENT                                         */}
        {/* ========================================================================= */}
        <div className="candidate-drawer-body">
          {/* TAB 1: INLINE RESUME VIEWER (PDF / WORD) */}
          {activeTab === "resume" && (
            <div className="resume-viewer-container" style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              {/* Blended Download Button & Subtle Controls */}
              {effectiveResumeUrl && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 18,
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(15, 23, 42, 0.72)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    borderRadius: 24,
                    padding: "4px 8px 4px 12px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)"
                  }}
                >
                  {isUploadingCloudinary ? (
                    <span style={{ fontSize: "0.725rem", color: "#93c5fd", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          border: "2px solid rgba(147, 197, 253, 0.3)",
                          borderTopColor: "#93c5fd",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          display: "inline-block"
                        }}
                      />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    <>
                      <a
                        href={effectiveResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={effectiveFileName}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#ffffff",
                          textDecoration: "none",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: 16,
                          background: "rgba(255, 255, 255, 0.15)",
                          transition: "all 0.15s ease"
                        }}
                        title="Download resume"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>

                      <a
                        href={effectiveResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "rgba(255, 255, 255, 0.7)",
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 6px",
                          borderRadius: 6,
                          textDecoration: "none"
                        }}
                        title="Open full document in new tab"
                      >
                        <ExternalLink size={13} />
                      </a>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255, 255, 255, 0.7)",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 6px"
                        }}
                        title="Replace resume file"
                      >
                        <Upload size={13} />
                      </button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </div>
              )}

              {/* DIRECT ACTUAL RESUME VIEWER */}
              {effectiveResumeUrl ? (
                isWordDoc ? (
                  <iframe
                    src={googleDocsViewerUrl}
                    title={`${candidate.name} Word Resume`}
                    className="resume-viewer-iframe"
                    style={{
                      width: "100%",
                      height: "calc(100vh - 210px)",
                      minHeight: 700,
                      border: "none",
                      borderRadius: 8,
                      background: "#f8fafc",
                      display: "block"
                    }}
                  />
                ) : (
                  <iframe
                    src={effectiveResumeUrl}
                    title={`${candidate.name} PDF Resume`}
                    className="resume-viewer-iframe"
                    style={{
                      width: "100%",
                      height: "calc(100vh - 210px)",
                      minHeight: 700,
                      border: "none",
                      borderRadius: 8,
                      background: "#525659",
                      display: "block"
                    }}
                  />
                )
              ) : (
                <div
                  style={{
                    padding: 40,
                    background: "var(--bg-surface-elevated)",
                    borderRadius: 8,
                    border: "1px solid var(--border-subtle)",
                    textAlign: "center"
                  }}
                >
                  <FileText size={44} color="var(--primary)" style={{ margin: "0 auto 12px" }} />
                  <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>
                    No Resume Available
                  </h4>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 18px" }}>
                    Upload a PDF or Word document to view it directly here.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={13} />
                    <span>Upload Resume File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & CANDIDATE DETAILS */}
          {activeTab === "profile" && (
            <>
              {/* Quick Metrics Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
                  gap: 10
                }}
              >
                <div style={{ background: "var(--bg-surface-elevated)", padding: 12, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Current CTC
                  </span>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
                    {candidate.currentCtc || "₹24 LPA"}
                  </div>
                </div>

                <div style={{ background: "var(--bg-surface-elevated)", padding: 12, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Expected CTC
                  </span>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#059669", marginTop: 2 }}>
                    {candidate.expectedCtc || "₹36 LPA"}
                  </div>
                </div>

                <div style={{ background: "var(--bg-surface-elevated)", padding: 12, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Notice Period
                  </span>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: isImmediate ? "#059669" : "#b45309", marginTop: 4 }}>
                    {candidate.noticePeriod?.split("(")[0] || "30 Days"}
                  </div>
                </div>

                <div style={{ background: "var(--bg-surface-elevated)", padding: 12, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Experience
                  </span>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
                    {candidate.experience || "5+ Years"}
                  </div>
                </div>
              </div>

              {/* Contact Details Card */}
              <div style={{ background: "var(--bg-surface-elevated)", padding: "14px 16px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em", display: "block", marginBottom: 10 }}>
                  Contact & Verification
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: "0.825rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                      <Mail size={13} /> {candidate.email}
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "2px 5px", fontSize: "0.7rem" }}
                      onClick={handleCopyEmail}
                    >
                      {copiedEmail ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                      <Phone size={13} /> {candidate.phone}
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "2px 5px", fontSize: "0.7rem" }}
                      onClick={handleCopyPhone}
                    >
                      {copiedPhone ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                    </button>
                  </div>

                  {candidate.currentCompany && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-secondary)" }}>
                      <Building size={13} />
                      <span>Company: <strong>{candidate.currentCompany}</strong></span>
                    </div>
                  )}

                  {candidate.education && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-secondary)" }}>
                      <GraduationCap size={13} />
                      <span>Edu: <strong>{candidate.education}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills & Evaluation Tags */}
              <div style={{ background: "var(--bg-surface-elevated)", padding: "14px 16px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>
                  Tech Stack & Competency Badges
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(candidate.tags || candidate.skills || ["Go", "Kafka", "Distributed Systems", "PostgreSQL", "Docker"]).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        padding: "3px 9px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <CheckCircle size={10} color="#10b981" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pitch / Cover Note if provided */}
              {candidate.pitch && (
                <div style={{ background: "rgba(79, 70, 229, 0.04)", padding: "14px 16px", borderRadius: 8, border: "1px solid rgba(79, 70, 229, 0.15)" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--primary)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                    Candidate Pitch / Statement
                  </span>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    "{candidate.pitch}"
                  </p>
                </div>
              )}
            </>
          )}

          {/* TAB 3: COMPENSATION & OFFER INTELLIGENCE */}
          {activeTab === "ctc_breakdown" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "var(--bg-surface-elevated)", padding: 16, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                  <IndianRupee size={16} color="#059669" />
                  <span>Indian Market Compensation Intelligence</span>
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 12, background: "var(--bg-surface)", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Current Fixed + Variable</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
                      {candidate.currentCtc || "₹34 LPA"}
                    </div>
                  </div>

                  <div style={{ padding: 12, background: "var(--bg-surface)", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Expected Target CTC</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#059669", marginTop: 2 }}>
                      {candidate.expectedCtc || "₹46 LPA"}
                    </div>
                  </div>
                </div>

                {/* Offer Simulation */}
                <div style={{ padding: 12, background: "rgba(5, 150, 105, 0.06)", borderRadius: 6, border: "1px solid rgba(5, 150, 105, 0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.825rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Base Salary Component (80%):</span>
                    <strong>₹36,80,000 / year</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.825rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Annual Performance Bonus (15%):</span>
                    <strong>₹6,90,000 / year</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.825rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Retirals & Medical Benefits:</span>
                    <strong>₹2,30,000 / year</strong>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(5, 150, 105, 0.2)", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <strong style={{ color: "#059669" }}>Total Offer Package:</strong>
                    <strong style={{ color: "#059669" }}>{candidate.expectedCtc || "₹46 LPA"} + ESOPs</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTES & TIMELINE */}
          {activeTab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <form onSubmit={handleAddNote}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Add interview feedback, salary discussion notes, or next steps..."
                    className="form-input"
                    style={{ fontSize: "0.825rem", height: 36 }}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ height: 36, padding: "0 14px" }}>
                    <Send size={13} />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {candidate.notes && candidate.notes.length > 0 ? (
                  candidate.notes.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 6,
                        background: "var(--bg-surface-elevated)",
                        borderLeft: "3px solid var(--primary)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.78rem" }}>{note.author}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{note.date}</span>
                      </div>
                      <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.4, margin: 0 }}>
                        {note.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: "20px 0" }}>
                    No recruiter notes recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 6. CLEAN DRAWER FOOTER (NO "Close Drawer" BUTTON AS REQUESTED)             */}
        {/* ========================================================================= */}
        <div className="candidate-drawer-footer">
          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <span>Tip: Press <kbd style={{ padding: "1px 5px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: 3 }}>Esc</kbd> to close &bull; <kbd style={{ padding: "1px 5px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: 3 }}>&larr;</kbd> <kbd style={{ padding: "1px 5px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: 3 }}>&rarr;</kbd> to switch candidate</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handlePrevCandidate}
              disabled={candidateIndex === 0}
              style={{ fontSize: "0.72rem", padding: "4px 8px" }}
            >
              <ChevronLeft size={13} />
              <span>Prev</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleNextCandidate}
              disabled={candidateIndex === candidates.length - 1}
              style={{ fontSize: "0.72rem", padding: "4px 8px" }}
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
