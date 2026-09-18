import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAts } from "../context/AtsContext";
import { getCompanySlug, findCompanyBySlug } from "../utils/companySlug";
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Search,
  CheckCircle,
  X,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  ChevronDown,
  Filter,
  Globe,
  Building,
  HeartHandshake,
  Laptop,
  Sparkles,
  ExternalLink,
  Award,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Send,
  Users,
  Terminal,
  Cpu,
  Layers,
  FileText,
  GraduationCap,
  Copy
} from "lucide-react";

export const PublicCareerPage = ({ isEmbedded = false }) => {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    company: contextCompany,
    companies = [],
    jobs,
    addCandidate,
    currentUser,
    switchCompany,
    coverPresets,
    uploadResumeFile
  } = useAts();

  // Dynamically resolve target company from URL slug or path or fallback
  const company = useMemo(() => {
    if (companySlug) {
      const found = findCompanyBySlug(companySlug, companies);
      if (found) return found;
    }
    const path = location.pathname;
    if (path.endsWith("-careers")) {
      const slugCandidate = path.replace(/^\/|-careers$/g, "");
      const found = findCompanyBySlug(slugCandidate, companies);
      if (found) return found;
    }
    if (path.includes("/careers/")) {
      const slugCandidate = path.split("/careers/")[1];
      const found = findCompanyBySlug(slugCandidate, companies);
      if (found) return found;
    }
    return contextCompany || companies[0];
  }, [companySlug, location.pathname, companies, contextCompany]);

  const activeSlug = getCompanySlug(company);

  // Update browser document title with company name
  useEffect(() => {
    if (company?.name) {
      document.title = `${company.name} Careers | Open Positions & Jobs`;
    }
  }, [company?.name]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [drawerJob, setDrawerJob] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationRefId, setApplicationRefId] = useState("");

  // Applicant form with Indian recruitment fields
  const [applicantForm, setApplicantForm] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    location: "Bengaluru",
    education: "B.Tech / B.E. in Computer Science",
    college: "Tier-1 / Reputed University",
    currentCtc: "₹26 LPA",
    expectedCtc: "₹38 LPA",
    noticePeriod: "Immediate Joiner (Serving / Relieved)",
    linkedin: "",
    portfolio: "",
    resumeFileName: "Resume_Candidate.pdf",
    resumeUrl: "",
    answers: {}
  });

  // Scoped active company jobs
  const companyJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (j.companyId) {
        return j.companyId === company.id && j.status === "active";
      }
      return j.status === "active";
    });
  }, [jobs, company]);

  const departments = useMemo(() => {
    return ["all", ...new Set(companyJobs.map((j) => j.department).filter(Boolean))];
  }, [companyJobs]);

  const locations = useMemo(() => {
    return ["all", ...new Set(companyJobs.map((j) => j.location?.split("(")[0]?.trim()).filter(Boolean))];
  }, [companyJobs]);

  const workTypes = useMemo(() => {
    return ["all", ...new Set(companyJobs.map((j) => j.workType).filter(Boolean))];
  }, [companyJobs]);

  const filteredJobs = useMemo(() => {
    return companyJobs.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.description?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.department?.toLowerCase().includes(q) ||
        (job.skills || []).some((s) => s.toLowerCase().includes(q));

      const matchesDept = selectedDept === "all" || job.department === selectedDept;
      const matchesType = selectedType === "all" || job.workType === selectedType;
      const matchesLocation =
        selectedLocation === "all" ||
        job.location?.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesDept && matchesType && matchesLocation;
    });
  }, [companyJobs, searchQuery, selectedDept, selectedType, selectedLocation]);

  const handleOpenApply = (job) => {
    setActiveJob(job);
    setDrawerJob(null);
    setHasApplied(false);
    setApplicantForm({
      name: "",
      email: "",
      phone: "+91 ",
      location: "Bengaluru",
      education: job.education || "B.Tech / B.E. in Computer Science",
      college: "",
      currentCtc: "₹26 LPA",
      expectedCtc: "₹38 LPA",
      noticePeriod: "Immediate Joiner (Serving / Relieved)",
      linkedin: "",
      portfolio: "",
      resumeFileName: "Resume_Aarav.pdf",
      answers: {}
    });
    setIsApplyModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!applicantForm.name.trim() || !activeJob) return;

    const screeningAnswers = (activeJob.screeningQuestions || []).map((q, idx) => ({
      question: q,
      answer: applicantForm.answers[idx] || "Available for immediate technical rounds."
    }));

    const refCode = `REF-IN-${Math.floor(10000 + Math.random() * 90000)}`;
    setApplicationRefId(refCode);

    const fullEducation = applicantForm.college?.trim()
      ? `${applicantForm.education.trim()} • ${applicantForm.college.trim()}`
      : applicantForm.education.trim() || activeJob.education || "B.Tech / B.E. or Equivalent";

    addCandidate({
      name: applicantForm.name.trim(),
      email: applicantForm.email.trim(),
      phone: applicantForm.phone.trim() || "+91 98201 44821",
      location: applicantForm.location || "Bengaluru",
      education: fullEducation,
      jobId: activeJob.id,
      companyId: company.id,
      role: activeJob.title,
      source: "Career Page",
      sourceType: "direct",
      experience: activeJob.experienceLevel || activeJob.experience || "5+ years",
      currentCompany: "Direct Applicant (Website)",
      currentCtc: applicantForm.currentCtc,
      expectedCtc: applicantForm.expectedCtc,
      noticePeriod: applicantForm.noticePeriod,
      resumeUrl:
        applicantForm.resumeUrl ||
        `https://res.cloudinary.com/ljelkpy4/raw/upload/${applicantForm.name.replace(/\s+/g, "_")}_Resume.pdf`,
      resumeSource: applicantForm.resumeUrl?.includes("cloudinary.com")
        ? "cloudinary_storage"
        : "career_site",
      resumeFileName:
        applicantForm.resumeFileName || `${applicantForm.name.replace(/\s+/g, "_")}_Resume.pdf`,
      tags: [
        "Direct Applicant",
        company.name,
        applicantForm.noticePeriod?.includes("Immediate") ? "Immediate Joiner" : "Website Applicant"
      ],
      screeningAnswers,
      notes: [
        {
          author: "Career Portal",
          text: `Application reference: ${refCode}. Direct submission to ${company.name}. Education: ${fullEducation}. Current CTC: ${applicantForm.currentCtc}, Expected: ${applicantForm.expectedCtc}, Notice: ${applicantForm.noticePeriod}.`,
          date: new Date().toISOString().split("T")[0]
        }
      ]
    });

    setHasApplied(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setHasApplied(false);
    }, 2800);
  };

  const isFiltered = searchQuery || selectedDept !== "all" || selectedType !== "all" || selectedLocation !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDept("all");
    setSelectedType("all");
    setSelectedLocation("all");
  };

  const scrollToRoles = () => {
    const el = document.getElementById("open-roles-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const effectiveCover = company?.coverBannerUrl || company?.coverImage || coverPresets[0]?.url;

  return (
    <div
      className="public-portal"
      style={{
        minHeight: isEmbedded ? "auto" : "100vh",
        background: "var(--bg-app)",
        width: "100%",
        overflowX: "hidden"
      }}
    >
      {/* ========================================================================= */}
      {/* TOP BRAND NAVIGATION (Full-Width Sticky Glass Header)                     */}
      {/* ========================================================================= */}
      {!isEmbedded && (
        <header
          className="career-top-nav"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(255, 253, 250, 0.94)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "12px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            transition: "background var(--transition-fast)"
          }}
        >
          <div className="career-nav-brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                style={{ width: 28, height: 28, borderRadius: 7, objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: company.brandColor || "#4f46e5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800
                }}
              >
                {company.logoInitials || "CO"}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="career-nav-company-name" style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
                {company.name}
              </span>
              <span className="career-nav-badge" style={{ 
                fontSize: "0.72rem", 
                fontWeight: 700, 
                textTransform: "uppercase", 
                letterSpacing: "0.06em",
                color: company.brandColor || "var(--primary)",
                background: `${company.brandColor || "var(--primary)"}15`,
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                border: `1px solid ${company.brandColor || "var(--primary)"}30`
              }}>
                Careers
              </span>
            </div>
          </div>

          <div className="career-nav-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="btn btn-ghost btn-sm career-nav-back"
              onClick={() => navigate("/career-site")}
              title="Back to ExpertHier Platform"
              style={{
                fontSize: "0.825rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                whiteSpace: "nowrap"
              }}
            >
              <ArrowLeft size={14} />
              <img
                src="/logo-exhier.png"
                alt="ExpertHier"
                style={{
                  width: 24,
                  height: 24,
                  objectFit: "contain",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  mixBlendMode: "multiply"
                }}
              />
              <span>Back to ExpertHier</span>
            </button>
          </div>
        </header>
      )}


      {/* ========================================================================= */}
      {/* THE ULTIMATE DESIGNER FULL-WIDTH HERO COVER BANNER                        */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* CINEMATIC HERO COVER BANNER                                              */}
      {/* ========================================================================= */}
      <section
        className="career-hero-banner"
        style={{
          width: "100%",
          position: "relative",
          minHeight: 460,
          backgroundImage: `linear-gradient(180deg, rgba(14, 12, 10, 0.4) 0%, rgba(14, 12, 10, 0.72) 60%, rgba(14, 12, 10, 0.95) 100%), url(${effectiveCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px 60px",
          color: "#ffffff"
        }}
      >
        {/* Top Badges Floating in Hero */}
        <div className="career-hero-top-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, width: "100%", maxWidth: 1320, margin: "0 auto" }}>
          <div className="career-hero-top-left" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                color: "#1c1917",
                fontSize: "0.775rem",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
            >
              <ShieldCheck size={14} color="#4f46e5" />
              <span>Verified Employer</span>
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(12px)",
                color: "#f5f5f4",
                fontSize: "0.775rem",
                fontWeight: 500,
                border: "1px solid rgba(255, 255, 255, 0.18)"
              }}
            >
              <MapPin size={13} style={{ color: "#38bdf8" }} />
              <span>{company.headquarters || "Nashik"}</span>
            </span>

            {company.domain && (
              <a
                href={company.domain.startsWith("http") ? company.domain : `https://${company.domain}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  background: "rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(12px)",
                  color: "#f5f5f4",
                  fontSize: "0.775rem",
                  fontWeight: 500,
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  textDecoration: "none"
                }}
              >
                <Globe size={13} style={{ color: "#a855f7" }} />
                <span>{company.domain}</span>
                <ExternalLink size={11} style={{ opacity: 0.7 }} />
              </a>
            )}
          </div>

          <span
            className="career-hero-pipeline-badge"
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.92)",
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(12px)",
              padding: "6px 14px",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.18)"
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981" }} />
            Direct ATS Recruitment Pipeline Active
          </span>
        </div>

        {/* Central Hero Branding & Identity */}
        <div style={{ width: "100%", maxWidth: 1320, margin: "32px auto 0" }}>
          <div style={{ maxWidth: 860 }}>
            {/* Integrated Company Emblem Header */}
            <div className="career-hero-emblem-row" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="career-hero-emblem"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    objectFit: "cover",
                    background: "#ffffff",
                    padding: 3,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    flexShrink: 0
                  }}
                />
              ) : (
                <div
                  className="career-hero-emblem"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: company.brandColor || "#4f46e5",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "1.4rem",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    flexShrink: 0
                  }}
                >
                  {company.logoInitials || "S"}
                </div>
              )}

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span className="career-hero-company-name" style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff" }}>
                    {company.name}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      color: "#34d399",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.02em"
                    }}
                  >
                    Actively Recruiting
                  </span>
                </div>
                <div style={{ fontSize: "0.825rem", color: "rgba(255, 255, 255, 0.75)", marginTop: 2 }}>
                  {company.headquarters || "Nashik"} &bull; {company.domain || "snab.co.in"}
                </div>
              </div>
            </div>

            <h1
              className="career-hero-title"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3.4rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                margin: "0 0 16px"
              }}
            >
              Careers at {company.name}
            </h1>

            <p
              className="career-hero-description"
              style={{
                fontSize: "clamp(0.92rem, 2.5vw, 1.2rem)",
                lineHeight: 1.55,
                color: "rgba(255, 255, 255, 0.88)",
                margin: "0 0 28px",
                fontWeight: 400
              }}
            >
              {company.tagline && company.tagline !== company.name
                ? company.tagline
                : "Headquartered in Nashik, SNAB is scaling snab. We operate with deep ownership, small agile pods, and zero bureaucratic friction."}
            </p>

            {/* Quick Actions in Hero */}
            <div className="career-hero-actions" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <button
                className="btn btn-primary career-hero-btn"
                onClick={scrollToRoles}
                style={{
                  padding: "12px 24px",
                  fontSize: "0.925rem",
                  fontWeight: 700,
                  borderRadius: "10px",
                  background: "#4f46e5",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(79, 70, 229, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer"
                }}
              >
                <Briefcase size={16} />
                <span>Explore Open Positions ({companyJobs.length})</span>
                <ArrowRight size={16} />
              </button>

              <div
                className="career-hero-fasttrack-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  fontSize: "0.825rem",
                  color: "rgba(255, 255, 255, 0.9)"
                }}
              >
                <Zap size={14} style={{ color: "#fbbf24" }} />
                <span>Direct Applications &bull; Fast-Track Review</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 10 }} />
      </section>


      {/* ========================================================================= */}
      {/* EXPANSIVE JOB BROWSER (FULL-WIDTH 2-COLUMN LAYOUT WITH MOBILE PILLS)       */}
      {/* ========================================================================= */}
      <section
        id="open-roles-section"
        className="career-roles-section"
        style={{
          width: "100%",
          maxWidth: 1400,
          margin: "56px auto 0",
          padding: "0 32px 80px",
          scrollMarginTop: 80
        }}
      >
        {/* Section Heading & Search */}
        <div className="career-roles-heading-row" style={{ marginBottom: 28, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div className="career-roles-heading-left">
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: "var(--primary)",
                display: "block",
                marginBottom: 4
              }}
            >
              Active Mandates & Positions
            </span>
            <h2 className="career-roles-title" style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Explore Open Opportunities
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 4 }}>
              Showing {filteredJobs.length} of {companyJobs.length} requisitions across {departments.filter(d => d !== "all").length} departments
            </p>
          </div>

          {/* Quick Search */}
          <div className="career-search-box" style={{ position: "relative", width: 340, maxWidth: "100%" }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Filter by title, stack, keyword..."
              className="form-input"
              style={{
                width: "100%",
                paddingLeft: 40,
                paddingRight: searchQuery ? 36 : 14,
                height: 44,
                fontSize: "0.875rem",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)"
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer"
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Department Pill Bar (Visible only on mobile/tablets) */}
        <div className="career-mobile-dept-pills">
          {departments.map((dept) => {
            const count = dept === "all" ? companyJobs.length : companyJobs.filter((j) => j.department === dept).length;
            const isActive = selectedDept === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`career-dept-pill ${isActive ? "active" : ""}`}
              >
                <span>{dept === "all" ? "All Roles" : dept}</span>
                <span className="career-dept-pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Layout */}
        <div className="career-layout-container" style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          {/* LEFT SIDEBAR: FILTERS & TALENT CALLOUT */}
          <aside
            className="career-desktop-sidebar"
            style={{
              width: 290,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              position: "sticky",
              top: 72
            }}
          >
            {/* Filter Group: Department */}
            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                  Department
                </span>
                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    style={{ fontSize: "0.75rem", color: "var(--primary)", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}
                  >
                    Reset
                  </button>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {departments.map((dept) => {
                  const count = dept === "all" ? companyJobs.length : companyJobs.filter((j) => j.department === dept).length;
                  const isActive = selectedDept === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-md)",
                        background: isActive ? "var(--bg-surface-elevated)" : "transparent",
                        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.825rem",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <span>{dept === "all" ? "All Departments" : dept}</span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "1px 7px",
                          borderRadius: "var(--radius-full)",
                          background: isActive ? "var(--border-subtle)" : "var(--bg-app)",
                          color: "var(--text-secondary)",
                          fontWeight: 600
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Location */}
            {locations.length > 2 && (
              <div className="card" style={{ padding: "18px 20px" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 10 }}>
                  Location Hub
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {locations.map((loc) => {
                    const isActive = selectedLocation === loc;
                    return (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc)}
                        style={{
                          padding: "7px 10px",
                          borderRadius: "var(--radius-sm)",
                          background: isActive ? "var(--bg-surface-elevated)" : "transparent",
                          color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                          fontWeight: isActive ? 700 : 500,
                          fontSize: "0.825rem",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        {loc === "all" ? "All Locations" : loc}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Application Card */}
            <div
              className="card"
              style={{
                padding: "20px",
                background: "var(--bg-surface)",
                border: "1px dashed var(--border-medium)",
                borderRadius: "var(--radius-lg)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--primary)" }}>
                <Sparkles size={16} />
                <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>Don't see your role?</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 14px" }}>
                We are always seeking exceptional engineering leads and systems architects. Send us your profile for priority consideration.
              </p>
              {companyJobs[0] && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenApply(companyJobs[0])}
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem" }}
                >
                  <Send size={13} />
                  <span>General Application</span>
                </button>
              )}
            </div>
          </aside>

          {/* RIGHT COLUMN: JOB LISTINGS */}
          <main className="career-jobs-list" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredJobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "56px 24px",
                  background: "var(--bg-surface)",
                  border: "1px dashed var(--border-medium)",
                  borderRadius: "var(--radius-lg)"
                }}
              >
                <Briefcase size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 6 }}>
                  No open roles matching current filters
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>
                  Try resetting your department or location filters to view all available requisitions at {company.name}.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="career-job-card-elevated"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    flexWrap: "wrap",
                    transition: "all 0.15s ease"
                  }}
                >
                  {/* Left Role Info */}
                  <div className="career-job-card-info" style={{ flex: 2, minWidth: 0, width: "100%" }}>
                    <div className="career-job-card-title-row" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
                        {job.title}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-surface-elevated)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-subtle)"
                        }}
                      >
                        {job.workType}
                      </span>
                    </div>

                    <div
                      className="career-job-card-meta-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        fontSize: "0.825rem",
                        color: "var(--text-secondary)",
                        flexWrap: "wrap",
                        marginBottom: 12
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Briefcase size={14} color="var(--text-muted)" />
                        <span>{job.department}</span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        <span>{job.location}</span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={14} color="var(--text-muted)" />
                        <span>{job.experienceLevel || job.experience || "4-7 years"}</span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <GraduationCap size={14} color="var(--text-muted)" />
                        <span>{job.education || "B.Tech / B.E. or Equivalent"}</span>
                      </span>
                    </div>

                    <p
                      className="career-job-card-description"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        margin: "0 0 14px",
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {job.description}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="career-job-card-skills" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(job.skills || ["System Design", "Backend", "PostgreSQL", "Kafka"]).slice(0, 5).map((skill, sIdx) => (
                        <span key={sIdx} className="career-tag-chip" style={{ fontSize: "0.75rem", padding: "3px 9px" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right CTC & Action Buttons */}
                  <div className="career-job-card-actions" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, flexShrink: 0 }}>
                    <div
                      className="career-job-salary-pill"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "var(--bg-app)",
                        border: "1px solid var(--border-subtle)",
                        padding: "7px 14px",
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        fontSize: "1.05rem"
                      }}
                    >
                      <IndianRupee size={16} />
                      <span>{job.salary}</span>
                    </div>

                    <div className="career-job-btn-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        className="btn btn-secondary btn-sm career-job-btn-detail"
                        onClick={() => setDrawerJob(job)}
                        style={{ padding: "9px 16px", fontWeight: 600 }}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-primary btn-sm career-job-btn-apply"
                        onClick={() => handleOpenApply(job)}
                        style={{ padding: "9px 18px", display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}
                      >
                        <span>Apply</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DESIGNER FULL-WIDTH FOOTER                                               */}
      {/* ========================================================================= */}
      <footer
        className="career-footer"
        style={{
          width: "100%",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          padding: "36px 48px",
          color: "var(--text-muted)",
          fontSize: "0.825rem"
        }}
      >
        <div className="career-footer-inner" style={{ width: "100%", maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                style={{ width: 24, height: 24, borderRadius: 6, objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: company.brandColor || "#4f46e5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 800
                }}
              >
                {company.logoInitials || "CO"}
              </div>
            )}
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{company.name}</span>
            <span>&bull;</span>
            <span>{company.headquarters || "India"}</span>
            {company.domain && (
              <>
                <span>&bull;</span>
                <span>{company.domain}</span>
              </>
            )}
          </div>

          <div>
            &copy; {new Date().getFullYear()} {company.name} &bull; Powered by ExpertHire ATS Engine
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* JOB DETAILS SIDE DRAWER                                                   */}
      {/* ========================================================================= */}
      {drawerJob && (
        <div className="career-drawer-overlay" onClick={() => setDrawerJob(null)}>
          <div className="career-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div
              className="career-drawer-header"
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                background: "var(--bg-surface)"
              }}
            >
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                  {drawerJob.department}
                </span>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "4px 0 6px" }}>{drawerJob.title}</h2>
                <div style={{ display: "flex", gap: 12, fontSize: "0.825rem", color: "var(--text-secondary)", flexWrap: "wrap", alignItems: "center" }}>
                  <span>{drawerJob.location}</span>
                  <span>&bull;</span>
                  <span>{drawerJob.workType}</span>
                  <span>&bull;</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--text-primary)", fontWeight: 600 }}>
                    <GraduationCap size={14} color="var(--primary)" />
                    {drawerJob.education || "B.Tech / B.E. or Equivalent"}
                  </span>
                  <span>&bull;</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>₹ {drawerJob.salary}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setDrawerJob(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="career-drawer-body" style={{ padding: "28px", overflowY: "auto", flex: 1 }}>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 8 }}>About the Role</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {drawerJob.description}
                </p>
              </div>

              {drawerJob.requirements?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 8 }}>Requirements</h4>
                  <ul style={{ paddingLeft: 20, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    {drawerJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 8 }}>Tech Stack & Skills</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(drawerJob.skills || ["System Design", "Backend", "PostgreSQL"]).map((s, idx) => (
                    <span key={idx} className="career-tag-chip" style={{ padding: "6px 12px", fontSize: "0.825rem" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "var(--bg-surface-elevated)",
                  padding: "16px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  marginBottom: 24
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: 6 }}>Direct Company Hiring</div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                  Applications submitted here are directly routed into {company.name}'s talent pipeline. Candidates with immediate availability and relevant experience are fast-tracked for technical rounds.
                </p>
              </div>
            </div>

            <div
              className="career-drawer-footer"
              style={{
                padding: "18px 28px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bg-surface)"
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                CTC: <strong>₹ {drawerJob.salary}</strong>
              </div>
              <button
                className="btn btn-primary career-drawer-apply-btn"
                onClick={() => handleOpenApply(drawerJob)}
                style={{ padding: "10px 24px", display: "flex", alignItems: "center", gap: 8 }}
              >
                <span>Apply for Position</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANDIDATE APPLICATION MODAL                                               */}
      {/* ========================================================================= */}
      {isApplyModalOpen && activeJob && (
        <div className="modal-overlay" onClick={() => setIsApplyModalOpen(false)}>
          <div className="modal-content career-apply-modal-content" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                  Application Form
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "2px 0 0" }}>
                  Apply for {activeJob.title}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {company.name} &bull; {activeJob.location}
                </span>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsApplyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {hasApplied ? (
              <div style={{ padding: "48px 32px", textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(5, 150, 105, 0.12)",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}
                >
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 6 }}>
                  Application Submitted!
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: 400, margin: "0 auto 16px" }}>
                  Your profile has been submitted directly to {company.name}'s talent pipeline.
                </p>
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    background: "var(--bg-surface-elevated)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--primary)"
                  }}
                >
                  Reference: {applicationRefId}
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "68vh", overflowY: "auto" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      className="form-input"
                      value={applicantForm.name}
                      onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="aarav@gmail.com"
                        className="form-input"
                        value={applicantForm.email}
                        onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98200 00000"
                        className="form-input"
                        value={applicantForm.phone}
                        onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Current CTC</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹24 LPA"
                        className="form-input"
                        value={applicantForm.currentCtc}
                        onChange={(e) => setApplicantForm({ ...applicantForm, currentCtc: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Expected CTC</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹35 LPA"
                        className="form-input"
                        value={applicantForm.expectedCtc}
                        onChange={(e) => setApplicantForm({ ...applicantForm, expectedCtc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Highest Degree / Qualification *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B.Tech in CS / MCA / MBA"
                        className="form-input"
                        value={applicantForm.education}
                        onChange={(e) => setApplicantForm({ ...applicantForm, education: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">College / University & Passing Year</label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Bombay / Tier-1 College (2021)"
                        className="form-input"
                        value={applicantForm.college}
                        onChange={(e) => setApplicantForm({ ...applicantForm, college: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notice Period / Availability</label>
                    <select
                      className="form-select"
                      value={applicantForm.noticePeriod}
                      onChange={(e) => setApplicantForm({ ...applicantForm, noticePeriod: e.target.value })}
                    >
                      <option value="Immediate Joiner (Serving / Relieved)">Immediate Joiner (Serving / Relieved)</option>
                      <option value="15 Days Notice">15 Days Notice</option>
                      <option value="30 Days Notice">30 Days Notice</option>
                      <option value="60 Days Notice">60 Days Notice</option>
                      <option value="90 Days Notice">90 Days Notice</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        className="form-input"
                        value={applicantForm.linkedin}
                        onChange={(e) => setApplicantForm({ ...applicantForm, linkedin: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current City</label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru"
                        className="form-input"
                        value={applicantForm.location}
                        onChange={(e) => setApplicantForm({ ...applicantForm, location: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Screening Questions */}
                  {(activeJob.screeningQuestions || []).length > 0 && (
                    <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 12 }}>
                        Role Screening Questions
                      </div>
                      {activeJob.screeningQuestions.map((question, qIdx) => (
                        <div key={qIdx} className="form-group" style={{ marginBottom: 12 }}>
                          <label className="form-label" style={{ fontSize: "0.8rem" }}>
                            {qIdx + 1}. {question}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Your brief answer..."
                            className="form-input"
                            value={applicantForm.answers[qIdx] || ""}
                            onChange={(e) =>
                              setApplicantForm({
                                ...applicantForm,
                                answers: { ...applicantForm.answers, [qIdx]: e.target.value }
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Real Cloudinary Resume Upload */}
                  <div className="form-group">
                    <label className="form-label">Resume / CV (PDF or DOCX)</label>
                    <label
                      style={{
                        padding: "16px",
                        borderRadius: "var(--radius-md)",
                        border: applicantForm.resumeUrl ? "1px solid #10b981" : "2px dashed var(--border-medium)",
                        background: applicantForm.resumeUrl ? "rgba(16, 185, 129, 0.04)" : "var(--bg-surface-elevated)",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: isUploadingResume ? "not-allowed" : "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {isUploadingResume ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              border: "2px solid rgba(79, 70, 229, 0.3)",
                              borderTopColor: "var(--primary)",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                              display: "inline-block"
                            }}
                          />
                          <span style={{ fontSize: "0.825rem", color: "var(--primary)", fontWeight: 600 }}>
                            Uploading resume to Cloudinary (resumes)...
                          </span>
                        </div>
                      ) : applicantForm.resumeUrl ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle size={16} color="#059669" />
                          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>
                            {applicantForm.resumeFileName}
                          </span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              background: "#ecfdf5",
                              color: "#059669",
                              padding: "2px 7px",
                              borderRadius: 4,
                              fontWeight: 700
                            }}
                          >
                            Cloudinary Stored
                          </span>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <UploadCloud size={20} color="var(--primary)" />
                            <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>
                              Upload Your Resume
                            </span>
                          </div>
                          <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                            PDF or Word document &bull; Stored directly into Cloudinary (preset: resumes)
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        disabled={isUploadingResume}
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setApplicantForm((prev) => ({
                              ...prev,
                              resumeFileName: file.name
                            }));
                            setIsUploadingResume(true);
                            try {
                              const res = await uploadResumeFile(file);
                              if (res?.success && res?.url) {
                                setApplicantForm((prev) => ({
                                  ...prev,
                                  resumeUrl: res.url,
                                  resumeFileName: file.name
                                }));
                              }
                            } catch (err) {
                              console.warn("Cloudinary upload failed:", err);
                            } finally {
                              setIsUploadingResume(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsApplyModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <span>Submit Application</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
