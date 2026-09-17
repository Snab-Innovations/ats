import React, { useState, useMemo } from "react";
import { useAts } from "../context/AtsContext";
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
  GraduationCap
} from "lucide-react";

export const PublicCareerPage = ({ isEmbedded = false }) => {
  const {
    company,
    jobs,
    addCandidate,
    setActiveRole,
    coverPresets
  } = useAts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [drawerJob, setDrawerJob] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
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
    answers: {}
  });

  // Scoped active company jobs
  const companyJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (j.companyId) {
        return j.companyId === company.id && j.status === "active";
      }
      if (company.id === "comp-zepto-102") {
        return j.id.includes("zepto") && j.status === "active";
      }
      if (company.id === "comp-razor-103") {
        return j.id.includes("razor") && j.status === "active";
      }
      if (company.id === "comp-bharat-101") {
        return j.id.startsWith("job-") && !j.id.includes("zepto") && !j.id.includes("razor") && j.status === "active";
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

  const effectiveCover = company.coverImage || coverPresets[0]?.url;

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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                {company.name}
              </span>
              <span style={{ color: "var(--border-medium)" }}>/</span>
              <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                Careers Portal
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {company.domain && (
              <a
                href={company.domain.startsWith("http") ? company.domain : `https://${company.domain}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: 500
                }}
              >
                <Globe size={14} />
                <span>{company.domain}</span>
                <ExternalLink size={12} />
              </a>
            )}

            <button
              className="btn btn-secondary btn-sm"
              onClick={scrollToRoles}
              style={{ fontSize: "0.8rem", padding: "6px 14px", fontWeight: 600 }}
            >
              <Briefcase size={14} />
              <span>View {companyJobs.length} Openings</span>
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveRole("company_admin")}
              title="Return to Employer ATS Workspace"
              style={{ fontSize: "0.75rem", padding: "5px 10px", color: "var(--text-muted)" }}
            >
              &larr; Switch to ATS Admin
            </button>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* THE ULTIMATE DESIGNER FULL-WIDTH HERO COVER BANNER                        */}
      {/* ========================================================================= */}
      <section
        style={{
          width: "100%",
          position: "relative",
          minHeight: 460,
          backgroundImage: `linear-gradient(180deg, rgba(14, 12, 10, 0.35) 0%, rgba(14, 12, 10, 0.65) 55%, rgba(14, 12, 10, 0.95) 100%), url(${effectiveCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px 80px",
          color: "#ffffff"
        }}
      >
        {/* Top Badges Floating in Hero */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, width: "100%", maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: "var(--radius-full)",
                background: "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(10px)",
                color: "#1c1917",
                fontSize: "0.75rem",
                fontWeight: 700
              }}
            >
              <ShieldCheck size={14} color="var(--primary)" />
              <span>Verified Employer</span>
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(10px)",
                color: "#f5f5f4",
                fontSize: "0.75rem",
                fontWeight: 500,
                border: "1px solid rgba(255, 255, 255, 0.15)"
              }}
            >
              <MapPin size={12} />
              <span>{company.headquarters || "Bengaluru • Pan-India"}</span>
            </span>
          </div>

          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Direct ATS Recruitment Pipeline Active
          </span>
        </div>

        {/* Central Designer Content */}
        <div style={{ width: "100%", maxWidth: 1400, margin: "24px auto 0" }}>
          <div style={{ maxWidth: 860 }}>
            <span
              style={{
                display: "inline-block",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: 10
              }}
            >
              Work That Matters &bull; {company.name}
            </span>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                margin: "0 0 16px"
              }}
            >
              Build the Next Generation of Tech
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 1.8vw, 1.35rem)",
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.9)",
                margin: "0 0 28px",
                fontWeight: 400
              }}
            >
              {company.tagline || "High-velocity technology platform and engineering engine"}. We are hiring world-class engineers, product builders, and technical operators.
            </p>

            {/* Quick Hero Key Stats */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                flexWrap: "wrap",
                paddingTop: 8
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
                  {companyJobs.length}
                </span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Active Mandates
                </span>
              </div>

              <div style={{ width: 1, height: 28, background: "rgba(255, 255, 255, 0.2)" }} />

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
                  ₹25L - ₹65L
                </span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  CTC Range + ESOPs
                </span>
              </div>

              <div style={{ width: 1, height: 28, background: "rgba(255, 255, 255, 0.2)" }} />

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
                  100% Direct
                </span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Fast-Track Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty bottom space to dock overlapping card */}
        <div style={{ height: 10 }} />
      </section>

      {/* ========================================================================= */}
      {/* FLOATING COMPANY PROFILE BAR (Full Container Width 1400px)                 */}
      {/* ========================================================================= */}
      <div style={{ width: "100%", maxWidth: 1400, margin: "-48px auto 0", padding: "0 32px", position: "relative", zIndex: 10 }}>
        <div
          className="card"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-xl)",
            padding: "24px 32px",
            boxShadow: "0 14px 34px rgba(28, 25, 23, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {/* Company Big Logo */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "var(--radius-lg)",
                background: "#ffffff",
                padding: 4,
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                border: "3px solid var(--bg-surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0
              }}
            >
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "calc(var(--radius-lg) - 4px)",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "calc(var(--radius-lg) - 4px)",
                    background: company.brandColor || "#4f46e5",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "1.75rem"
                  }}
                >
                  {company.logoInitials || "CO"}
                </div>
              )}
            </div>

            {/* Company Info from Settings */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {company.name}
                </h2>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 9px",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(5, 150, 105, 0.1)",
                    color: "#059669",
                    fontSize: "0.72rem",
                    fontWeight: 700
                  }}
                >
                  Actively Recruiting
                </span>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: "4px 0 8px" }}>
                {company.tagline || "Enterprise infrastructure & product engineering"}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: "0.825rem", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={14} color="var(--text-muted)" />
                  <span>{company.headquarters || "Bengaluru • Pan-India"}</span>
                </span>

                {company.domain && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Globe size={14} color="var(--text-muted)" />
                    <span>{company.domain}</span>
                  </span>
                )}

                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--primary)", fontWeight: 600 }}>
                  <Briefcase size={14} />
                  <span>{companyJobs.length} Open Roles</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            className="btn btn-primary"
            onClick={scrollToRoles}
            style={{ padding: "12px 26px", fontSize: "0.925rem", fontWeight: 700, borderRadius: "var(--radius-md)" }}
          >
            <span>Explore All {companyJobs.length} Open Positions</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPANY STORY, SCALE & CULTURE SHOWCASE (4 Designer Cards)                */}
      {/* ========================================================================= */}
      <section style={{ width: "100%", maxWidth: 1400, margin: "48px auto 0", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {/* Card 1: About the Mission */}
          <div
            className="card"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="kpi-icon-wrap">
                <Building size={16} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                About {company.name}
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Headquartered in {company.headquarters || "Bengaluru"}, {company.name} is scaling {company.tagline.toLowerCase() || "mission-critical software"}. We operate with deep ownership, small agile pods, and zero bureaucratic friction.
            </p>
            <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>HQ Hub: <strong>{company.headquarters?.split("(")[0]?.trim() || "Bengaluru"}</strong></span>
              <span>Domain: <strong>{company.domain || "Tech"}</strong></span>
            </div>
          </div>

          {/* Card 2: Engineering Rigor */}
          <div
            className="card"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="kpi-icon-wrap">
                <Terminal size={16} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                Engineering Rigor
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Engineers deploy production code multiple times a day. We value clean architecture, test automation, and building scalable systems with low cognitive overhead.
            </p>
            <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Go", "Node", "React", "Kafka", "PostgreSQL", "Cloudflare"].map((tech) => (
                <span key={tech} className="career-tag-chip" style={{ fontSize: "0.7rem", padding: "2px 7px" }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Compensation & ESOPs */}
          <div
            className="card"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="kpi-icon-wrap">
                <IndianRupee size={16} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                Transparent Rewards
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Top 5% market compensation in INR base with meaningful equity grants. We reward speed of execution and real business impact over corporate politics.
            </p>
            <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>Notice Buyout: <strong>Supported</strong></span>
              <span>Reviews: <strong>Bi-annual</strong></span>
            </div>
          </div>

          {/* Card 4: Health & Equipment */}
          <div
            className="card"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="kpi-icon-wrap">
                <HeartHandshake size={16} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                Family Health & Rigs
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Comprehensive health insurance covering parents and spouse with zero copay. Plus top-of-the-line Apple M3/M4 Max developer machines and home workstation budget.
            </p>
            <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>Insurance: <strong>100% Paid</strong></span>
              <span>Gear: <strong>MacBook Pro</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXPANSIVE JOB BROWSER (FULL-WIDTH 2-COLUMN LAYOUT)                        */}
      {/* ========================================================================= */}
      <section
        id="open-roles-section"
        style={{
          width: "100%",
          maxWidth: 1400,
          margin: "56px auto 0",
          padding: "0 32px 80px",
          scrollMarginTop: 80
        }}
      >
        {/* Section Heading */}
        <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Explore Open Opportunities
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 4 }}>
              Showing {filteredJobs.length} of {companyJobs.length} requisitions across {departments.filter(d => d !== "all").length} departments
            </p>
          </div>

          {/* Quick Search */}
          <div style={{ position: "relative", width: 340 }}>
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
                height: 42,
                fontSize: "0.85rem",
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

        {/* 2-Column Layout */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          {/* LEFT SIDEBAR: FILTERS & TALENT CALLOUT */}
          <aside
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
          <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
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
                  <div style={{ flex: 2, minWidth: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
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
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(job.skills || ["System Design", "Backend", "PostgreSQL", "Kafka"]).slice(0, 5).map((skill, sIdx) => (
                        <span key={sIdx} className="career-tag-chip" style={{ fontSize: "0.75rem", padding: "3px 9px" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right CTC & Action Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, flexShrink: 0 }}>
                    <div
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

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setDrawerJob(job)}
                        style={{ padding: "9px 16px", fontWeight: 600 }}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
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
        style={{
          width: "100%",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          padding: "36px 48px",
          color: "var(--text-muted)",
          fontSize: "0.825rem"
        }}
      >
        <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
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

            <div style={{ padding: "28px", overflowY: "auto", flex: 1 }}>
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
                className="btn btn-primary"
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
          <div className="modal-content" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
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

                  {/* Resume upload indicator */}
                  <div className="form-group">
                    <label className="form-label">Resume / CV (PDF)</label>
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px dashed var(--border-medium)",
                        background: "var(--bg-surface-elevated)",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        cursor: "pointer"
                      }}
                    >
                      <UploadCloud size={20} color="var(--primary)" />
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <strong>{applicantForm.resumeFileName}</strong> (Attached)
                      </span>
                    </div>
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
