import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAts } from "../context/AtsContext";
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
  FileText,
  Send,
  Upload,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  User,
  Mail,
  Phone,
  IndianRupee,
  Check,
  FileCheck,
  Globe,
  SlidersHorizontal,
  BookmarkPlus
} from "lucide-react";

export const ExpertHirePlatform = () => {
  const navigate = useNavigate();
  const {
    jobs = [],
    companies = [],
    company: activeCompany,
    addCandidate,
    currentUser,
    uploadResumeFile
  } = useAts();

  // Active jobs from ALL companies
  const allActiveJobs = useMemo(() => {
    return jobs.filter((j) => j.status === "active");
  }, [jobs]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedWorkType, setSelectedWorkType] = useState("all");
  const [selectedExp, setSelectedExp] = useState("all");

  // Modals & Drawers
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [appliedCandidateName, setAppliedCandidateName] = useState("");
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Direct Application Form State (starts empty for candidate input)
  const emptyApplyForm = {
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    currentCompany: "",
    currentCtc: "",
    expectedCtc: "",
    noticePeriod: "Immediate Joiner (Serving Notice)",
    education: "",
    linkedinUrl: "",
    githubUrl: "",
    resumeFileName: "",
    resumeUrl: "",
    answers: {},
    pitchNotes: ""
  };

  const [applyForm, setApplyForm] = useState(emptyApplyForm);

  // Extract unique departments & locations across all active jobs
  const departments = useMemo(() => {
    return ["all", ...new Set(allActiveJobs.map((j) => j.department).filter(Boolean))];
  }, [allActiveJobs]);

  const locations = useMemo(() => {
    const locSet = new Set();
    allActiveJobs.forEach((j) => {
      if (j.location) {
        const city = j.location.split("(")[0].trim();
        locSet.add(city);
      }
    });
    return ["all", ...Array.from(locSet)];
  }, [allActiveJobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return allActiveJobs.filter((job) => {
      const jobComp = companies.find((c) => c.id === job.companyId) || activeCompany;
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        (jobComp?.name && jobComp.name.toLowerCase().includes(q)) ||
        (job.department && job.department.toLowerCase().includes(q)) ||
        (job.location && job.location.toLowerCase().includes(q)) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(q))) ||
        (job.description && job.description.toLowerCase().includes(q));

      const matchesCompany =
        selectedCompanyId === "all" ||
        (job.companyId ? job.companyId === selectedCompanyId : activeCompany?.id === selectedCompanyId);

      const matchesDepartment =
        selectedDepartment === "all" || job.department === selectedDepartment;

      const matchesLocation =
        selectedLocation === "all" ||
        (job.location && job.location.toLowerCase().includes(selectedLocation.toLowerCase()));

      const matchesWorkType =
        selectedWorkType === "all" || job.workType === selectedWorkType;

      const matchesExp =
        selectedExp === "all" ||
        (job.experienceLevel && job.experienceLevel.toLowerCase().includes(selectedExp.toLowerCase()));

      return (
        matchesSearch &&
        matchesCompany &&
        matchesDepartment &&
        matchesLocation &&
        matchesWorkType &&
        matchesExp
      );
    });
  }, [
    allActiveJobs,
    companies,
    activeCompany,
    searchQuery,
    selectedCompanyId,
    selectedDepartment,
    selectedLocation,
    selectedWorkType,
    selectedExp
  ]);

  // Open apply modal for a specific job (clean empty form for applicant)
  const handleOpenApply = (job) => {
    setSelectedJobForApply(job);
    setAppliedSuccess(false);
    setApplyForm({
      name: "",
      email: "",
      phone: "",
      location: "",
      experience: "",
      currentCompany: "",
      currentCtc: "",
      expectedCtc: "",
      noticePeriod: "Immediate Joiner (Serving Notice)",
      education: "",
      linkedinUrl: "",
      githubUrl: "",
      resumeFileName: "",
      answers: {},
      pitchNotes: ""
    });
  };

  // Optional helper to populate sample candidate data on demand
  const handleFillDemoData = () => {
    setApplyForm({
      name: "Siddharth Mathur",
      email: "siddharth.mathur@gmail.com",
      phone: "+91 98201 44821",
      location: "Bengaluru, Karnataka",
      experience: "6 years",
      currentCompany: "Swiggy - Senior Backend Engineer",
      currentCtc: "₹28 LPA",
      expectedCtc: "₹42 LPA",
      noticePeriod: "Immediate Joiner (Serving Notice)",
      education: "B.Tech CSE - IIT Roorkee",
      linkedinUrl: "https://linkedin.com/in/siddharth-mathur",
      githubUrl: "https://github.com/siddharthm",
      resumeFileName: "Siddharth_Mathur_Resume.pdf",
      answers: {
        0: "Serving notice, available in 15 days. Current fixed 28 LPA, expecting 42 LPA.",
        1: "Experience with autoscaling via HPA and KEDA under sudden burst traffic."
      },
      pitchNotes: "Led distributed transaction ordering services handling 35,000+ peak RPS with sub-15ms p99 latency. Immediate joiner ready for fast rounds."
    });
  };

  // Submit candidate application directly to the job's employer ATS
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!applyForm.name.trim() || !applyForm.email.trim() || !selectedJobForApply) return;

    const targetComp =
      companies.find((c) => c.id === selectedJobForApply.companyId) || activeCompany;

    const screeningAnswers = (selectedJobForApply.screeningQuestions || []).map(
      (q, idx) => ({
        question: q,
        answer: applyForm.answers[idx] || "Direct platform verification completed."
      })
    );

    addCandidate({
      name: applyForm.name.trim(),
      email: applyForm.email.trim(),
      phone: applyForm.phone.trim() || "+91 98201 44821",
      location: applyForm.location,
      jobId: selectedJobForApply.id,
      companyId: selectedJobForApply.companyId || targetComp.id,
      role: selectedJobForApply.title,
      source: "ExpertHire Platform",
      sourceType: "experthire_platform",
      experience: applyForm.experience,
      currentCompany: applyForm.currentCompany || "Confidential Tech Scaleup",
      currentCtc: applyForm.currentCtc,
      expectedCtc: applyForm.expectedCtc,
      noticePeriod: applyForm.noticePeriod,
      education: applyForm.education,
      resumeUrl:
        applyForm.resumeUrl ||
        `https://experthire.io/resumes/${applyForm.name.replace(/\s+/g, "_")}_CV.pdf`,
      resumeSource: applyForm.resumeUrl?.includes("cloudinary.com")
        ? "cloudinary_storage"
        : "platform_upload",
      resumeFileName:
        applyForm.resumeFileName || `${applyForm.name.replace(/\s+/g, "_")}_Resume.pdf`,
      resumeFileSize: applyForm.resumeFileSize || "185 KB",
      resumeSummary: `${applyForm.name} applied directly via the ExpertHire National Job Board for ${selectedJobForApply.title}. Experienced software professional with ${applyForm.experience} from ${applyForm.education}. Currently at ${applyForm.currentCompany || "Product Firm"}.`,
      tags: [
        "ExpertHire Platform",
        "Direct Candidate",
        targetComp.name?.split(" ")[0] || "Client",
        applyForm.noticePeriod?.includes("Immediate") ? "Immediate Joiner" : "Notice Verified",
        "Verified Tech Talent"
      ],
      screeningAnswers,
      notes: [
        {
          author: "ExpertHire Platform Engine",
          text: `Direct candidate application received from ExpertHire Platform for ${selectedJobForApply.title} at ${targetComp.name}. Attribution automatically credited to ExpertHire Platform with zero agency fees.`,
          date: new Date().toISOString().split("T")[0]
        }
      ]
    });

    setAppliedCandidateName(applyForm.name);
    setAppliedSuccess(true);
  };

  return (
    <div className="experthire-platform-wrapper" style={{ background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-primary)" }}>
      {/* Top Navbar */}
      <header
        className="experthire-header"
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          backdropFilter: "blur(12px)"
        }}
      >
        <div
          className="experthire-header-inner"
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          {/* Logo & Platform Tagline */}
          <div className="experthire-brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/logo-exhier.png"
              alt="ExpertHier"
              style={{
                width: 52,
                height: 52,
                objectFit: "contain",
                background: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
                mixBlendMode: "multiply",
                flexShrink: 0
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  ExpertHier
                </span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)",
                    color: "#4f46e5",
                    border: "1px solid rgba(79, 70, 229, 0.25)"
                  }}
                >
                  Direct Candidate Platform
                </span>
              </div>
              <div className="experthire-tagline" style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>
                Unified tech requisitions across all verified employer scaleups
              </div>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/")}
              style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600 }}
            >
              &larr; Home
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => navigate("/career-site/snab")}
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              SNAB Jobs
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/login")}
              style={{ fontSize: "0.82rem", fontWeight: 700, background: "#4f46e5" }}
            >
              Workspace Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Integrated Search */}
      <section
        className="experthire-hero-section"
        style={{
          background: "linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-main) 100%)",
          padding: "44px 24px 32px",
          borderBottom: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div
            className="experthire-hero-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(79, 70, 229, 0.08)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
              color: "var(--primary)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: 16
            }}
          >
            <Sparkles size={14} />
            <span>Direct Employer Applications &bull; Fast Review</span>
          </div>

          <h1
            className="experthire-hero-title"
            style={{
              fontSize: "clamp(1.6rem, 5.5vw, 2.35rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: "0 0 14px",
              color: "var(--text-primary)"
            }}
          >
            High-Impact Tech Roles Across{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Leading Companies
            </span>
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              maxWidth: 620,
              margin: "0 auto 24px",
              lineHeight: 1.6
            }}
          >
            Find active technical roles and apply directly to hiring teams with zero middleman delays.
          </p>

          {/* Unified Multi-Filter Search Bar */}
          <div
            className="experthire-search-grid"
            style={{
              background: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "14px 18px",
              boxShadow: "0 14px 38px rgba(0, 0, 0, 0.08)",
              border: "1px solid var(--border-medium)",
              display: "grid",
              gap: 12,
              alignItems: "center"
            }}
          >
            {/* Keyword Search */}
            <div style={{ position: "relative" }}>
              <Search
                size={17}
                color="var(--text-muted)"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Search role, skills, Kafka, Go, React, Distributed..."
                className="form-input"
                style={{ paddingLeft: 38, height: 42, fontSize: "0.85rem", borderRadius: "10px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Company Select */}
            <div>
              <select
                className="form-select"
                style={{ height: 42, fontSize: "0.85rem", borderRadius: "10px" }}
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="all">All Companies ({companies.length})</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Select */}
            <div>
              <select
                className="form-select"
                style={{ height: 42, fontSize: "0.85rem", borderRadius: "10px" }}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments
                  .filter((d) => d !== "all")
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>
            </div>

            {/* Work Type / Mode Select */}
            <div>
              <select
                className="form-select"
                style={{ height: 42, fontSize: "0.85rem", borderRadius: "10px" }}
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
              >
                <option value="all">Any Work Mode</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Clear button if active */}
            <div>
              {(searchQuery ||
                selectedCompanyId !== "all" ||
                selectedDepartment !== "all" ||
                selectedLocation !== "all" ||
                selectedWorkType !== "all") && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ height: 42, padding: "0 14px", borderRadius: "10px" }}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCompanyId("all");
                    setSelectedDepartment("all");
                    setSelectedLocation("all");
                    setSelectedWorkType("all");
                    setSelectedExp("all");
                  }}
                  title="Reset all search filters"
                >
                  <X size={15} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Skill Tags */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 18,
              flexWrap: "wrap",
              fontSize: "0.775rem",
              color: "var(--text-muted)"
            }}
          >
            <span style={{ fontWeight: 600 }}>Trending Skills:</span>
            {["Kubernetes", "Go", "Distributed Systems", "Kafka", "React", "Zero-Downtime", "PCI-DSS", "AWS EKS"].map(
              (skill) => (
                <button
                  key={skill}
                  onClick={() => setSearchQuery(skill)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.725rem",
                    background: searchQuery === skill ? "var(--primary)" : "var(--bg-surface)",
                    color: searchQuery === skill ? "#fff" : "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {skill}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Employers Banner */}
      <section
        className="experthire-featured-section"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "20px 24px 10px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            flexWrap: "wrap",
            gap: 8
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Featured Employer Scaleups on ExpertHire
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Click an employer to filter roles
          </span>
        </div>

        <div className="experthire-featured-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 14 }}>
          {companies.map((c) => {
            const companyJobs = allActiveJobs.filter(
              (j) => (j.companyId ? j.companyId === c.id : activeCompany?.id === c.id)
            );
            const isSelected = selectedCompanyId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCompanyId(isSelected ? "all" : c.id)}
                style={{
                  background: isSelected ? "rgba(79, 70, 229, 0.06)" : "var(--bg-surface)",
                  border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border-subtle)"}`,
                  borderRadius: "14px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isSelected ? "0 6px 20px rgba(79, 70, 229, 0.16)" : "none"
                }}
              >
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      objectFit: "contain",
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      padding: 3
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: c.brandColor || "var(--primary)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {c.logoInitials || "CO"}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <h4 style={{ fontSize: "0.925rem", fontWeight: 800, margin: 0, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.name}
                    </h4>
                    <ShieldCheck size={14} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {c.headquarters?.split("&")[0]?.trim() || "India"} &bull; {companyJobs.length} Open Roles
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: "var(--radius-full)",
                    background: isSelected ? "var(--primary)" : "var(--bg-surface-elevated)",
                    color: isSelected ? "#fff" : "var(--text-secondary)"
                  }}
                >
                  {companyJobs.length}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Jobs Feed */}
      <main
        className="experthire-main-feed"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "24px 24px 64px"
        }}
      >
        {/* Results Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              {selectedCompanyId !== "all"
                ? `${companies.find((c) => c.id === selectedCompanyId)?.name || "Employer"} Positions`
                : "Active Tech Requisitions Across All Companies"}
            </h2>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
              Showing <strong>{filteredJobs.length}</strong> active position{filteredJobs.length === 1 ? "" : "s"} &bull; Direct application
            </div>
          </div>

          {/* Experience level pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)" }}>Level:</span>
            {["all", "Lead", "Staff", "Principal"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedExp(lvl)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: selectedExp === lvl ? 700 : 500,
                  background: selectedExp === lvl ? "var(--primary)" : "var(--bg-surface)",
                  color: selectedExp === lvl ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${selectedExp === lvl ? "var(--primary)" : "var(--border-subtle)"}`,
                  cursor: "pointer"
                }}
              >
                {lvl === "all" ? "All Levels" : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        {allActiveJobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "70px 24px",
              background: "var(--bg-surface)",
              borderRadius: "16px",
              border: "1px dashed var(--border-subtle)"
            }}
          >
            <Briefcase size={46} color="var(--text-muted)" style={{ margin: "0 auto 14px", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 8px" }}>No Active Openings Published Yet</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 20px", lineHeight: 1.5 }}>
              Verified employer scaleups will publish real-time technical requisitions here. Check back soon or visit our employer dashboard to publish roles.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
              background: "var(--bg-surface)",
              borderRadius: "16px",
              border: "1px dashed var(--border-subtle)"
            }}
          >
            <Briefcase size={44} color="var(--text-muted)" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 6px" }}>No Roles Matched Your Filters</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto 20px" }}>
              Try loosening your search terms or reset filters to see all available roles across our employer network.
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCompanyId("all");
                setSelectedDepartment("all");
                setSelectedLocation("all");
                setSelectedWorkType("all");
                setSelectedExp("all");
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="experthire-jobs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 20 }}>
            {filteredJobs.map((job) => {
              const jobCompany =
                companies.find((c) => c.id === job.companyId) || activeCompany;

              return (
                <div
                  key={job.id}
                  className="bounty-card-glow"
                  style={{
                    background: "var(--bg-surface)",
                    borderRadius: "16px",
                    padding: "22px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1px solid var(--border-subtle)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                >
                  <div>
                    {/* Company Row Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 14,
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {jobCompany?.logoUrl ? (
                          <img
                            src={jobCompany.logoUrl}
                            alt={jobCompany.name}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "8px",
                              objectFit: "contain",
                              background: "var(--bg-surface-elevated)",
                              border: "1px solid var(--border-subtle)",
                              padding: 3
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "8px",
                              background: jobCompany?.brandColor || "var(--primary)",
                              color: "#fff",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {jobCompany?.logoInitials || "CO"}
                          </div>
                        )}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--text-primary)" }}>
                              {jobCompany?.name}
                            </span>
                            <ShieldCheck size={13} color="var(--primary)" />
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            {jobCompany?.headquarters?.split("&")[0]?.trim() || "India"} &bull; Verified Client ATS
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "#059669",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
                        Direct Apply
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        margin: "0 0 8px",
                        color: "var(--text-primary)",
                        lineHeight: 1.3
                      }}
                    >
                      {job.title}
                    </h3>

                    {/* Key Attributes Meta */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: "0.78rem",
                        color: "var(--text-secondary)",
                        flexWrap: "wrap",
                        marginBottom: 14
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Building2 size={12} color="var(--text-muted)" />
                        <span>{job.department}</span>
                      </span>
                      <span>&bull;</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} color="var(--text-muted)" />
                        <span>{job.location}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="badge badge-worktype" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                        {job.workType}
                      </span>
                      <span>&bull;</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <GraduationCap size={12} color="var(--primary)" />
                        <span>{job.education || "B.Tech / B.E."}</span>
                      </span>
                    </div>

                    {/* Compensation & Notice Box */}
                    <div
                      style={{
                        background: "var(--bg-surface-elevated)",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        marginBottom: 14,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>
                          Annual Compensation:
                        </span>
                        <span style={{ fontWeight: 800, fontSize: "0.925rem", color: "var(--primary)" }}>
                          ₹ {job.salary}
                        </span>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>
                          Notice Preference:
                        </span>
                        <span style={{ fontWeight: 700, fontSize: "0.775rem", color: "#059669" }}>
                          {job.noticePeriodPreference || "30 Days Max"}
                        </span>
                      </div>
                    </div>

                    {/* Description Excerpt */}
                    <p
                      style={{
                        fontSize: "0.825rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        margin: "0 0 14px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {job.description}
                    </p>

                    {/* Skills Pills */}
                    {job.skills && job.skills.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                        {job.skills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "6px",
                              background: "rgba(79, 70, 229, 0.06)",
                              color: "var(--primary)",
                              border: "1px solid rgba(79, 70, 229, 0.18)"
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", alignSelf: "center" }}>
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "8px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
                      onClick={() => setSelectedJobForDetail(job)}
                    >
                      View Specs
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        flex: 1,
                        padding: "8px 14px",
                        fontSize: "0.825rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(79, 70, 229, 0.3)"
                      }}
                      onClick={() => handleOpenApply(job)}
                    >
                      <span>Apply with ExpertHire 1-Click</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ULTRA-MODERN DIRECT APPLICATION MODAL */}
      {selectedJobForApply && (() => {
        const targetComp =
          companies.find((c) => c.id === selectedJobForApply.companyId) || activeCompany;

        return (
          <div
            className="modal-overlay"
            style={{
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              zIndex: 1000,
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setSelectedJobForApply(null)}
          >
            <div
              className="modal-content"
              style={{
                maxWidth: 760,
                width: "100%",
                maxHeight: "92vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: "20px",
                boxShadow: "0 28px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--border-subtle)",
                background: "var(--bg-surface)",
                overflow: "hidden"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header (Fixed at top) */}
              <div
                style={{
                  padding: "20px 28px 16px",
                  background: "linear-gradient(180deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)",
                  borderBottom: "1px solid var(--border-subtle)",
                  flexShrink: 0
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {targetComp?.logoUrl ? (
                      <img
                        src={targetComp.logoUrl}
                        alt={targetComp.name}
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: "12px",
                          objectFit: "contain",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          padding: 3,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: "12px",
                          background: targetComp?.brandColor || "var(--primary)",
                          color: "#fff",
                          fontSize: "1rem",
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          flexShrink: 0
                        }}
                      >
                        {targetComp?.logoInitials || "CO"}
                      </div>
                    )}

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary)" }}>
                          {targetComp?.name}
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>&bull;</span>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {targetComp?.headquarters?.split("&")[0]?.trim() || "India HQ"}
                        </span>
                        <ShieldCheck size={14} color="#059669" />
                      </div>

                      <h2
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 900,
                          margin: "2px 0 0",
                          color: "var(--text-primary)",
                          lineHeight: 1.25
                        }}
                      >
                        {selectedJobForApply.title}
                      </h2>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!appliedSuccess && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: "0.75rem",
                          padding: "5px 12px",
                          borderRadius: "8px",
                          border: "1px dashed var(--border-medium)",
                          color: "var(--text-secondary)",
                          fontWeight: 600
                        }}
                        onClick={handleFillDemoData}
                        title="Click to automatically fill sample candidate data for quick testing"
                      >
                        Fill Sample Data
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-icon"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-subtle)"
                      }}
                      onClick={() => setSelectedJobForApply(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Requisition Specs Chips Row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "#059669",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5
                    }}
                  >
                    <IndianRupee size={12} />
                    <span>₹ {selectedJobForApply.salary}</span>
                  </span>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--bg-surface)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5
                    }}
                  >
                    <MapPin size={12} color="var(--text-muted)" />
                    <span>{selectedJobForApply.location}</span>
                  </span>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--bg-surface)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5
                    }}
                  >
                    <Briefcase size={12} color="var(--text-muted)" />
                    <span>{selectedJobForApply.workType} &bull; {selectedJobForApply.department}</span>
                  </span>

                  <span
                    style={{
                      fontSize: "0.725rem",
                      fontWeight: 800,
                      padding: "3px 11px",
                      borderRadius: "var(--radius-full)",
                      background: "linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)",
                      color: "#4f46e5",
                      border: "1px solid rgba(79, 70, 229, 0.3)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      marginLeft: "auto"
                    }}
                  >
                    <Zap size={12} fill="#4f46e5" />
                    <span>Direct Application</span>
                  </span>
                </div>
              </div>

              {appliedSuccess ? (
                <div style={{ padding: "48px 28px", textAlign: "center" }}>
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
                      border: "2px solid #a7f3d0"
                    }}
                  >
                    <Check size={38} strokeWidth={2.5} />
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: 8, color: "var(--text-primary)" }}>
                    Application Dispatched Directly!
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 20px", lineHeight: 1.5 }}>
                    <strong>{appliedCandidateName}</strong>, your application has been delivered directly into the employer's ATS pipeline at{" "}
                    <strong>{targetComp?.name}</strong>.
                  </p>

                  <div
                    style={{
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "14px",
                      padding: "16px 20px",
                      maxWidth: 460,
                      margin: "0 auto 26px",
                      fontSize: "0.825rem",
                      textAlign: "left",
                      border: "1px solid var(--border-subtle)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "var(--text-muted)" }}>Target Role:</span>
                      <span style={{ fontWeight: 700 }}>{selectedJobForApply.title}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "var(--text-muted)" }}>Source Attribution:</span>
                      <span className="badge badge-source-experthire" style={{ fontSize: "0.75rem", padding: "2px 8px" }}>
                        ExpertHire Platform
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "var(--text-muted)" }}>Client ATS:</span>
                      <span style={{ fontWeight: 700 }}>{targetComp?.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
                      <span style={{ color: "var(--text-muted)" }}>Application Ref ID:</span>
                      <span style={{ fontFamily: "monospace", fontWeight: 800, color: "var(--primary)" }}>
                        EH-DIR-{Math.floor(100000 + Math.random() * 900000)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "9px 18px", borderRadius: "10px" }}
                      onClick={() => setSelectedJobForApply(null)}
                    >
                      Browse More Openings
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        padding: "9px 20px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                        border: "none",
                        boxShadow: "0 2px 10px rgba(79, 70, 229, 0.3)"
                      }}
                      onClick={() => {
                        setSelectedJobForApply(null);
                        setActiveRole("company_admin");
                      }}
                    >
                      <span>View in Employer ATS Pipeline &rarr;</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitApplication}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden"
                  }}
                >
                  <div
                    className="modal-body modal-custom-scroll"
                    style={{
                      padding: "20px 28px",
                      flex: 1,
                      minHeight: 0,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 18
                    }}
                  >
                    {/* SECTION 1: PERSONAL & CONTACT */}
                    <div
                      style={{
                        background: "var(--bg-surface-elevated)",
                        borderRadius: "14px",
                        padding: "16px 18px",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: "rgba(79, 70, 229, 0.12)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <User size={14} />
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          Personal & Contact Information
                        </span>
                      </div>

                      <div className="form-row" style={{ marginBottom: 12 }}>
                        <div className="form-group" style={{ flex: 1.5, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Full Legal Name *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. Siddharth Mathur"
                            value={applyForm.name}
                            onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1.5, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Email Address *</label>
                          <input
                            type="email"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. siddharth@gmail.com"
                            value={applyForm.email}
                            onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row" style={{ margin: 0 }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Mobile Number (+91) *</label>
                          <input
                            type="tel"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. +91 98201 44821"
                            value={applyForm.phone}
                            onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Current Location *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. Bengaluru, Karnataka"
                            value={applyForm.location}
                            onChange={(e) => setApplyForm({ ...applyForm, location: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PROFESSIONAL & COMPENSATION */}
                    <div
                      style={{
                        background: "var(--bg-surface-elevated)",
                        borderRadius: "14px",
                        padding: "16px 18px",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Briefcase size={14} />
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          Current Engagement & Compensation
                        </span>
                      </div>

                      <div className="form-row" style={{ marginBottom: 12 }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Total Experience *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. 6 years"
                            value={applyForm.experience}
                            onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1.5, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Current Company & Designation *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. Senior Software Engineer"
                            value={applyForm.currentCompany}
                            onChange={(e) => setApplyForm({ ...applyForm, currentCompany: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row" style={{ marginBottom: 12 }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Notice Period *</label>
                          <select
                            className="form-select"
                            style={{ borderRadius: "8px", fontWeight: 600, color: "var(--text-primary)" }}
                            value={applyForm.noticePeriod}
                            onChange={(e) => setApplyForm({ ...applyForm, noticePeriod: e.target.value })}
                          >
                            <option value="Immediate Joiner (Serving Notice)">Immediate Joiner (Serving Notice)</option>
                            <option value="15 Days Notice">15 Days Notice</option>
                            <option value="30 Days Notice">30 Days Notice</option>
                            <option value="60 Days Notice">60 Days Notice</option>
                            <option value="90 Days Notice">90 Days Notice</option>
                          </select>
                        </div>

                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Highest Qualification *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. B.Tech CSE - IIT Roorkee"
                            value={applyForm.education}
                            onChange={(e) => setApplyForm({ ...applyForm, education: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row" style={{ margin: 0 }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Current Annual Fixed CTC *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. ₹28 LPA"
                            value={applyForm.currentCtc}
                            onChange={(e) => setApplyForm({ ...applyForm, currentCtc: e.target.value })}
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>Expected Annual CTC *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ borderRadius: "8px", fontWeight: 700, color: "var(--primary)" }}
                            placeholder="e.g. ₹42 LPA"
                            value={applyForm.expectedCtc}
                            onChange={(e) => setApplyForm({ ...applyForm, expectedCtc: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: PROFILES & PORTFOLIO */}
                    <div
                      style={{
                        background: "var(--bg-surface-elevated)",
                        borderRadius: "14px",
                        padding: "16px 18px",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: "rgba(2, 132, 199, 0.12)",
                            color: "#0284c7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Globe size={14} />
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          Tech Profiles & Resume Attachment
                        </span>
                      </div>

                      <div className="form-row" style={{ marginBottom: 12 }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>LinkedIn Profile URL</label>
                          <input
                            type="url"
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. https://linkedin.com/in/username"
                            value={applyForm.linkedinUrl}
                            onChange={(e) => setApplyForm({ ...applyForm, linkedinUrl: e.target.value })}
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.775rem" }}>GitHub / Tech Portfolio</label>
                          <input
                            type="url"
                            className="form-input"
                            style={{ borderRadius: "8px" }}
                            placeholder="e.g. https://github.com/username"
                            value={applyForm.githubUrl}
                            onChange={(e) => setApplyForm({ ...applyForm, githubUrl: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Resume Upload / Card */}
                      {applyForm.resumeFileName ? (
                        <div
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid #10b981",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <FileCheck size={20} color="#059669" />
                            <div>
                              <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                {applyForm.resumeFileName}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                                <span>Attached Document</span>
                                {applyForm.resumeUrl?.includes("cloudinary.com") && (
                                  <span style={{ color: "#2563eb", fontWeight: 600 }}>
                                    &bull; Cloudinary Hosted (resumes)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {applyForm.resumeUrl ? (
                              <a
                                href={applyForm.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "0.725rem",
                                  fontWeight: 700,
                                  color: "#2563eb",
                                  background: "rgba(37, 99, 235, 0.08)",
                                  padding: "3px 8px",
                                  borderRadius: "var(--radius-full)",
                                  textDecoration: "none"
                                }}
                              >
                                View File
                              </a>
                            ) : (
                              <span
                                style={{
                                  fontSize: "0.725rem",
                                  fontWeight: 700,
                                  color: "#059669",
                                  background: "#ecfdf5",
                                  padding: "3px 8px",
                                  borderRadius: "var(--radius-full)"
                                }}
                              >
                                Ready
                              </span>
                            )}
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: "0.725rem", padding: "3px 8px", color: "var(--text-muted)" }}
                              onClick={() => setApplyForm({ ...applyForm, resumeFileName: "", resumeUrl: "" })}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          style={{
                            background: "var(--bg-surface)",
                            border: "2px dashed var(--border-medium)",
                            borderRadius: "10px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            cursor: isUploadingResume ? "not-allowed" : "pointer",
                            transition: "all 0.15s ease",
                            opacity: isUploadingResume ? 0.7 : 1
                          }}
                        >
                          {isUploadingResume ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                              <span
                                style={{
                                  width: 22,
                                  height: 22,
                                  border: "2px solid rgba(79, 70, 229, 0.3)",
                                  borderTopColor: "var(--primary)",
                                  borderRadius: "50%",
                                  animation: "spin 0.8s linear infinite",
                                  display: "inline-block"
                                }}
                              />
                              <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--primary)" }}>
                                Uploading resume to Cloudinary (ljelkpy4)...
                              </span>
                            </div>
                          ) : (
                            <>
                              <Upload size={22} color="var(--primary)" />
                              <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                Upload Resume (PDF or DOCX up to 10MB)
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                Click to browse & upload directly to Cloudinary (preset: resumes)
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            disabled={isUploadingResume}
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setApplyForm((prev) => ({
                                  ...prev,
                                  resumeFileName: file.name,
                                  resumeFileSize: `${(file.size / 1024).toFixed(0)} KB`
                                }));
                                setIsUploadingResume(true);
                                try {
                                  const res = await uploadResumeFile(file);
                                  if (res?.success && res?.url) {
                                    setApplyForm((prev) => ({
                                      ...prev,
                                      resumeUrl: res.url,
                                      resumeFileName: file.name
                                    }));
                                  }
                                } catch (uErr) {
                                  console.warn("Cloudinary upload failed:", uErr);
                                } finally {
                                  setIsUploadingResume(false);
                                }
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* SECTION 4: SCREENING QUESTIONS */}
                    {selectedJobForApply.screeningQuestions && selectedJobForApply.screeningQuestions.length > 0 && (
                      <div
                        style={{
                          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(6, 182, 212, 0.04) 100%)",
                          borderRadius: "14px",
                          padding: "16px 18px",
                          border: "1px solid rgba(79, 70, 229, 0.2)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: "rgba(79, 70, 229, 0.15)",
                              color: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Zap size={14} fill="currentColor" />
                          </span>
                          <div>
                            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary)" }}>
                              Employer Screening Questions
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>
                              Questions configured directly by the hiring leads
                            </span>
                          </div>
                        </div>

                        {selectedJobForApply.screeningQuestions.map((q, idx) => (
                          <div key={idx} style={{ marginBottom: 12 }}>
                            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                              {idx + 1}. {q}
                            </span>
                            <input
                              type="text"
                              required
                              className="form-input"
                              style={{ borderRadius: "8px", background: "var(--bg-surface)" }}
                              placeholder={idx === 0 ? "e.g. 15 days notice, current fixed 28 LPA, expecting 42 LPA" : "e.g. Share your relevant technical experience..."}
                              value={applyForm.answers[idx] || ""}
                              onChange={(e) =>
                                setApplyForm({
                                  ...applyForm,
                                  answers: { ...applyForm.answers, [idx]: e.target.value }
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pitch to Hiring Team */}
                    <div>
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>
                        Executive Pitch to the Hiring Lead (Optional)
                      </label>
                      <textarea
                        rows={2}
                        className="form-input"
                        style={{ borderRadius: "10px", fontSize: "0.825rem", lineHeight: 1.45 }}
                        placeholder="Highlight past systems scale, architectural achievements, or why you are excited for this role..."
                        value={applyForm.pitchNotes}
                        onChange={(e) => setApplyForm({ ...applyForm, pitchNotes: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Modal Footer (Always Visible Sticky Footer with Apply Button) */}
                  <div
                    className="modal-footer"
                    style={{
                      padding: "16px 28px",
                      background: "var(--bg-surface)",
                      borderTop: "1px solid var(--border-medium)",
                      boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexShrink: 0,
                      zIndex: 10
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      <ShieldCheck size={16} color="#059669" />
                      <span>Direct ATS delivery &bull; Zero agency fees &bull; 100% Free</span>
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ borderRadius: "10px", padding: "10px 18px", fontWeight: 600 }}
                        onClick={() => setSelectedJobForApply(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                          padding: "11px 26px",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                          border: "none",
                          boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                          fontWeight: 800,
                          fontSize: "0.875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer"
                        }}
                      >
                        <Send size={15} />
                        <span>Apply Directly to {targetComp?.name || "Company"} &rarr;</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })()}

      {/* ULTRA-MODERN JOB DETAILS SPEC DRAWER / MODAL */}
      {selectedJobForDetail && (
        <div
          className="modal-overlay"
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            zIndex: 100
          }}
          onClick={() => setSelectedJobForDetail(null)}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: 760,
              borderRadius: "20px",
              boxShadow: "0 28px 80px rgba(0, 0, 0, 0.35), 0 0 0 1px var(--border-subtle)",
              background: "var(--bg-surface)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const jobComp =
                companies.find((c) => c.id === selectedJobForDetail.companyId) || activeCompany;

              return (
                <>
                  <div
                    style={{
                      padding: "24px 28px 18px",
                      background: "linear-gradient(180deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)",
                      borderBottom: "1px solid var(--border-subtle)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {jobComp?.logoUrl ? (
                          <img
                            src={jobComp.logoUrl}
                            alt={jobComp.name}
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: "12px",
                              objectFit: "contain",
                              background: "var(--bg-surface)",
                              border: "1px solid var(--border-subtle)",
                              padding: 3,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: "12px",
                              background: jobComp?.brandColor || "var(--primary)",
                              color: "#fff",
                              fontSize: "1rem",
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                              flexShrink: 0
                            }}
                          >
                            {jobComp?.logoInitials || "CO"}
                          </div>
                        )}

                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary)" }}>
                              {jobComp?.name}
                            </span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>&bull;</span>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {jobComp?.headquarters?.split("&")[0]?.trim() || "India HQ"}
                            </span>
                            <ShieldCheck size={14} color="#059669" />
                          </div>

                          <h2
                            style={{
                              fontSize: "1.35rem",
                              fontWeight: 900,
                              margin: "2px 0 0",
                              color: "var(--text-primary)",
                              lineHeight: 1.25
                            }}
                          >
                            {selectedJobForDetail.title}
                          </h2>
                        </div>
                      </div>

                      <button
                        className="btn btn-ghost btn-icon"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border-subtle)"
                        }}
                        onClick={() => setSelectedJobForDetail(null)}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Meta Strip */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "#059669",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5
                        }}
                      >
                        <IndianRupee size={12} />
                        <span>₹ {selectedJobForDetail.salary}</span>
                      </span>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-surface-elevated)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-subtle)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5
                        }}
                      >
                        <MapPin size={12} color="var(--text-muted)" />
                        <span>{selectedJobForDetail.location}</span>
                      </span>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-surface-elevated)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-subtle)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5
                        }}
                      >
                        <Briefcase size={12} color="var(--text-muted)" />
                        <span>{selectedJobForDetail.workType} &bull; {selectedJobForDetail.department}</span>
                      </span>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-surface-elevated)",
                          color: "var(--primary)",
                          border: "1px solid var(--border-subtle)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5
                        }}
                      >
                        <GraduationCap size={12} />
                        <span>{selectedJobForDetail.education || "B.Tech"}</span>
                      </span>
                    </div>
                  </div>

                  <div
                    className="modal-body modal-custom-scroll"
                    style={{
                      padding: "24px 28px",
                      maxHeight: "66vh",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 20
                    }}
                  >
                    {/* Role Overview */}
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "0 0 8px", color: "var(--text-primary)" }}>
                        Position Overview
                      </h4>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                        {selectedJobForDetail.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    {selectedJobForDetail.requirements && selectedJobForDetail.requirements.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>
                          Key Requirements & Technical Scope
                        </h4>
                        <ul style={{ paddingLeft: 20, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                          {selectedJobForDetail.requirements.map((req, i) => (
                            <li key={i} style={{ marginBottom: 6 }}>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits */}
                    {selectedJobForDetail.benefits && selectedJobForDetail.benefits.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>
                          Perks & Wealth Grants
                        </h4>
                        <ul style={{ paddingLeft: 20, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                          {selectedJobForDetail.benefits.map((b, i) => (
                            <li key={i} style={{ marginBottom: 6 }}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills */}
                    {selectedJobForDetail.skills && selectedJobForDetail.skills.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>
                          Primary Tech Stack & Tools
                        </h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {selectedJobForDetail.skills.map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                padding: "4px 10px",
                                borderRadius: "6px",
                                background: "rgba(79, 70, 229, 0.08)",
                                color: "var(--primary)",
                                border: "1px solid rgba(79, 70, 229, 0.2)"
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="modal-footer"
                    style={{
                      padding: "18px 28px",
                      background: "var(--bg-surface)",
                      borderTop: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      style={{ borderRadius: "10px", padding: "10px 18px" }}
                      onClick={() => setSelectedJobForDetail(null)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{
                        padding: "10px 24px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                        border: "none",
                        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                        fontWeight: 800,
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}
                      onClick={() => {
                        const job = selectedJobForDetail;
                        setSelectedJobForDetail(null);
                        handleOpenApply(job);
                      }}
                    >
                      <span>Apply with ExpertHire 1-Click &rarr;</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Platform Footer */}
      <footer
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)",
          padding: "36px 24px",
          marginTop: 40
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/logo-exhier.png"
              alt="ExpertHier"
              style={{
                width: 40,
                height: 40,
                objectFit: "contain",
                background: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
                mixBlendMode: "multiply",
                flexShrink: 0
              }}
            />
            <div>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                ExpertHier Platform
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
                National Tech Talent Engine &bull; Multi-Tenant ATS Integration
              </span>
            </div>
          </div>

          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} ExpertHire Technologies Pvt. Ltd. Bengaluru &bull; Powered by ExpertHire ATS Engine
          </div>
        </div>
      </footer>
    </div>
  );
};
