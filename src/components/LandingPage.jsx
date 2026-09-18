import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAts } from "../context/AtsContext";
import {
  Search,
  ArrowRight,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Users,
  Check,
  RefreshCw,
  Menu,
  X,
  MapPin,
  Mail,
  Phone,
  Send,
  Building2,
  Calendar,
  MessageSquare,
  CheckCircle2
} from "lucide-react";

export const LandingPage = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    companies = [],
    jobs = [],
    company: activeCompany
  } = useAts();

  // Scroll position & compression state for floating day navbar
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simple, human-friendly rotating phrases (non-AI, plain English)
  const plainPhrases = [
    "Find good people.",
    "Track applicants simply.",
    "Work with your team.",
    "Hire with confidence."
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % plainPhrases.length);
        setFadeState(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [plainPhrases.length]);

  // Real Active Jobs Data
  const allActiveJobs = useMemo(() => {
    return jobs.filter((j) => j.status === "active");
  }, [jobs]);

  // Real search state for job finder
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allActiveJobs.filter((job) => {
      const comp = companies.find((c) => c.id === job.companyId) || activeCompany;
      return (
        job.title.toLowerCase().includes(q) ||
        (comp?.name && comp.name.toLowerCase().includes(q)) ||
        (job.department && job.department.toLowerCase().includes(q)) ||
        (job.location && job.location.toLowerCase().includes(q)) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(q)))
      );
    });
  }, [searchQuery, allActiveJobs, companies, activeCompany]);

  // Interactive Stage Progression Simulator
  const [interactiveStage, setInteractiveStage] = useState("screening");
  const pipelineStages = [
    { key: "applied", label: "1. New Applicant", desc: "Resume received and saved" },
    { key: "screening", label: "2. Resume Review", desc: "Checking skills and experience" },
    { key: "interview", label: "3. Interview", desc: "Talking with the candidate" },
    { key: "offer", label: "4. Job Offer", desc: "Salary discussed and agreed" },
    { key: "hired", label: "5. Hired", desc: "Ready to start work" }
  ];

  const handleAdvanceStage = () => {
    const currentIdx = pipelineStages.findIndex((s) => s.key === interactiveStage);
    const nextIdx = (currentIdx + 1) % pipelineStages.length;
    setInteractiveStage(pipelineStages[nextIdx].key);
  };

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Hiring Talent",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) return;
    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fcfbf9",
        color: "#1c1917",
        fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      {/* ─── Floating Day-Mode Header ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          transition: "all 0.25s ease",
          background: isScrolled ? "rgba(252, 251, 249, 0.96)" : "rgba(252, 251, 249, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: isScrolled ? "1px solid #e7e2d7" : "1px solid rgba(231, 226, 215, 0.6)",
          boxShadow: isScrolled ? "0 4px 16px -2px rgba(28, 25, 23, 0.05)" : "none",
          padding: isScrolled ? "10px 24px" : "16px 24px"
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {/* Logo - Seamless Merge */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            <img
              src="/logo-exhier.png"
              alt="ExpertHier"
              style={{
                height: isScrolled ? 42 : 48,
                width: "auto",
                objectFit: "contain",
                background: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
                mixBlendMode: "multiply",
                transition: "height 0.2s ease"
              }}
            />
          </div>

          {/* Simple Navigation Links */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: 28,
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#57534e"
            }}
            className="desktop-nav"
          >
            <a
              href="#how-it-works"
              style={{ textDecoration: "none", color: "inherit", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
              onMouseLeave={(e) => (e.target.style.color = "#57534e")}
            >
              How It Works
            </a>
            <a
              href="#pipeline-demo"
              style={{ textDecoration: "none", color: "inherit", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
              onMouseLeave={(e) => (e.target.style.color = "#57534e")}
            >
              Applicant Board
            </a>
            <a
              href="#career-portals"
              style={{ textDecoration: "none", color: "inherit", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
              onMouseLeave={(e) => (e.target.style.color = "#57534e")}
            >
              Career Pages
            </a>
            <a
              href="#contact"
              style={{ textDecoration: "none", color: "inherit", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
              onMouseLeave={(e) => (e.target.style.color = "#57534e")}
            >
              Contact Us
            </a>
            <span
              onClick={() => navigate("/career-site")}
              style={{
                cursor: "pointer",
                color: "#4f46e5",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 700
              }}
            >
              <span>Browse Open Jobs</span>
              <ExternalLink size={13} />
            </span>
          </nav>

          {/* Header Right Action */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  if (currentUser.role === "super_admin") navigate("/super-admin");
                  else if (currentUser.role === "agency_portal") navigate("/agency-portal");
                  else navigate("/employer-dashboard");
                }}
                style={{
                  background: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  padding: "9px 18px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer"
                }}
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a
                  href="#contact"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#57534e",
                    padding: "8px 12px",
                    textDecoration: "none"
                  }}
                >
                  Contact
                </a>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    background: "#1c1917",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    padding: "9px 18px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    transition: "background 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#1c1917")}
                >
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              className="btn btn-ghost mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: "6px 8px", display: "none", color: "#1c1917" }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: "16px 0 8px",
              borderTop: "1px solid #e7e2d7",
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: "none", color: "#1c1917", fontWeight: 600 }}
            >
              How It Works
            </a>
            <a
              href="#pipeline-demo"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: "none", color: "#1c1917", fontWeight: 600 }}
            >
              Applicant Board
            </a>
            <a
              href="#career-portals"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: "none", color: "#1c1917", fontWeight: 600 }}
            >
              Career Pages
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: "none", color: "#1c1917", fontWeight: 600 }}
            >
              Contact Us
            </a>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={() => navigate("/career-site")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #d6cdbe",
                  background: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
              >
                Browse Jobs
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  background: "#4f46e5",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem"
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── 1. HERO SECTION (SIMPLE & DIRECT) ─── */}
      <section
        style={{
          padding: "64px 24px 48px",
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        {/* Simple Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 20,
            background: "rgba(79, 70, 229, 0.08)",
            color: "#4f46e5",
            fontSize: "0.8rem",
            fontWeight: 700,
            marginBottom: 20
          }}
        >
          <span>Hiring Made Simple</span>
        </div>

        {/* Clear, Human Headline */}
        <h1
          style={{
            fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: "#1c1917",
            margin: "0 auto 16px",
            maxWidth: 900
          }}
        >
          Hire the right people for your team. <br />
          Without the headache.
        </h1>

        {/* Rotating Subhead */}
        <div
          style={{
            fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
            fontWeight: 600,
            color: "#57534e",
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16
          }}
        >
          <span>A simple tool to</span>
          <span
            style={{
              color: "#4f46e5",
              fontWeight: 800,
              opacity: fadeState ? 1 : 0,
              transform: fadeState ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 0.25s ease, transform 0.25s ease"
            }}
          >
            {plainPhrases[phraseIndex]}
          </span>
        </div>

        {/* Plain English Description */}
        <p
          style={{
            fontSize: "1.05rem",
            color: "#78716c",
            maxWidth: 680,
            margin: "0 auto 36px",
            lineHeight: 1.6
          }}
        >
          ExpertHier helps growing companies post job openings, organize applicants on a simple board,
          and collaborate with hiring agencies in one place. No complicated setup, no clunky software.
        </p>

        {/* Primary Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 44
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "#4f46e5",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.95rem",
              padding: "13px 28px",
              borderRadius: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 10px rgba(79, 70, 229, 0.25)",
              cursor: "pointer"
            }}
          >
            <span>Open Workspace</span>
            <ArrowRight size={16} />
          </button>

          <a
            href="#contact"
            style={{
              background: "#ffffff",
              color: "#1c1917",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "13px 24px",
              borderRadius: 8,
              border: "1px solid #d6cdbe",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <span>Contact Our Team</span>
          </a>

          <button
            type="button"
            onClick={() => navigate("/career-site")}
            style={{
              background: "transparent",
              color: "#57534e",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "12px 18px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer"
            }}
          >
            <Briefcase size={16} style={{ color: "#4f46e5" }} />
            <span>Browse Active Openings</span>
          </button>
        </div>

        {/* Simple Job Search Box */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #d6cdbe",
            padding: 12,
            maxWidth: 680,
            margin: "0 auto",
            boxShadow: "0 8px 24px rgba(28, 25, 23, 0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#f9f8f5",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #e6dfd3"
            }}
          >
            <Search size={17} style={{ color: "#4f46e5" }} />
            <input
              type="text"
              placeholder="Search open jobs (e.g. React, Backend, Product Manager)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "0.9rem",
                color: "#1c1917",
                fontWeight: 500
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ color: "#78716c", cursor: "pointer" }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {searchQuery && (
            <div
              style={{
                marginTop: 10,
                textAlign: "left",
                maxHeight: 200,
                overflowY: "auto",
                background: "#f9f8f5",
                borderRadius: 8,
                padding: 10
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate("/career-site")}
                    style={{
                      padding: "8px 10px",
                      background: "#ffffff",
                      borderRadius: 6,
                      border: "1px solid #e6dfd3",
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.85rem" }}>{job.title}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#57534e" }}>
                        {job.department} &bull; {job.location}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#4f46e5", fontWeight: 700 }}>
                      View &rarr;
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "8px", fontSize: "0.8rem", color: "#78716c" }}>
                  No open jobs found for "{searchQuery}". Click "Browse Active Openings" to view all roles.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── 2. HOW IT WORKS (EASY TO UNDERSTAND) ─── */}
      <section
        id="how-it-works"
        style={{
          padding: "70px 24px",
          maxWidth: 1100,
          margin: "0 auto",
          borderTop: "1px solid #e6dfd3"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span
            style={{
              color: "#4f46e5",
              fontSize: "0.8rem",
              fontWeight: 800,
              textTransform: "uppercase"
            }}
          >
            Simple Process
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              margin: "8px 0 12px"
            }}
          >
            How it works in 4 easy steps
          </h2>
          <p style={{ color: "#57534e", fontSize: "1rem", maxWidth: 600, margin: "0 auto" }}>
            Hiring shouldn't take weeks of training. Here is how simple it is:
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20
          }}
        >
          {[
            {
              step: "Step 1",
              title: "Create your job post",
              desc: "Write what kind of person you need, the required skills, and the salary range."
            },
            {
              step: "Step 2",
              title: "Share your career page",
              desc: "Get an instant, clean webpage with your company logo and active job openings."
            },
            {
              step: "Step 3",
              title: "Track applicants on a board",
              desc: "Move people from 'New Application' to 'Interview' with one click."
            },
            {
              step: "Step 4",
              title: "Make an offer and hire",
              desc: "Agree on terms, keep track of notice periods, and bring them on board."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                border: "1px solid #e6dfd3",
                borderRadius: 10,
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#4f46e5",
                  marginBottom: 8
                }}
              >
                {item.step}
              </span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 6px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#57534e", lineHeight: 1.55, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. INTERACTIVE APPLICANT BOARD DEMO ─── */}
      <section
        id="pipeline-demo"
        style={{
          background: "#ffffff",
          padding: "70px 24px",
          borderTop: "1px solid #e6dfd3",
          borderBottom: "1px solid #e6dfd3"
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 28
            }}
          >
            <div>
              <span
                style={{
                  color: "#4f46e5",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  textTransform: "uppercase"
                }}
              >
                Try It Yourself
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.025em",
                  margin: "6px 0 0"
                }}
              >
                The Simple Applicant Board
              </h2>
            </div>

            <button
              type="button"
              onClick={handleAdvanceStage}
              style={{
                background: "#4f46e5",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 700,
                padding: "9px 18px",
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer"
              }}
            >
              <RefreshCw size={14} />
              <span>Move to Next Step &rarr;</span>
            </button>
          </div>

          <div
            style={{
              background: "#fcfbf9",
              border: "1px solid #d6cdbe",
              borderRadius: 12,
              padding: 20
            }}
          >
            {/* Stages Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 8,
                marginBottom: 20
              }}
            >
              {pipelineStages.map((stage) => {
                const isActive = stage.key === interactiveStage;
                return (
                  <div
                    key={stage.key}
                    onClick={() => setInteractiveStage(stage.key)}
                    style={{
                      padding: "10px",
                      borderRadius: 8,
                      background: isActive ? "#4f46e5" : "#ffffff",
                      color: isActive ? "#ffffff" : "#1c1917",
                      border: isActive ? "1px solid #4f46e5" : "1px solid #e6dfd3",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: 800 }}>{stage.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Current Step Description Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid #e6dfd3",
                padding: "18px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 14
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#4f46e5",
                    textTransform: "uppercase"
                  }}
                >
                  Current Status
                </span>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, margin: "2px 0 4px" }}>
                  {pipelineStages.find((s) => s.key === interactiveStage)?.label}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#57534e" }}>
                  {pipelineStages.find((s) => s.key === interactiveStage)?.desc}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdvanceStage}
                style={{
                  background: "#1c1917",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                Advance Candidate &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. BRANDED CAREER PORTALS (SNAB SPOTLIGHT) ─── */}
      <section
        id="career-portals"
        style={{
          padding: "70px 24px",
          maxWidth: 1100,
          margin: "0 auto"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 40,
            alignItems: "center"
          }}
        >
          <div>
            <span
              style={{
                color: "#0284c7",
                fontSize: "0.8rem",
                fontWeight: 800,
                textTransform: "uppercase"
              }}
            >
              Career Pages
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.025em",
                margin: "8px 0 14px"
              }}
            >
              A clean career page with your company brand.
            </h2>
            <p style={{ color: "#57534e", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 20 }}>
              You don't need a web developer to make a jobs page. ExpertHier gives you a ready-to-share
              link with your logo, location, team benefits, and active openings.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "#1c1917" }}>
                <Check size={16} style={{ color: "#059669" }} />
                <span>Add your logo, banner, and company description</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "#1c1917" }}>
                <Check size={16} style={{ color: "#059669" }} />
                <span>List perks like insurance, gear, and workstation budget</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "#1c1917" }}>
                <Check size={16} style={{ color: "#059669" }} />
                <span>Candidates can apply directly in 60 seconds</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => navigate("/career-site/snab")}
              style={{
                background: "#0284c7",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "10px 20px",
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer"
              }}
            >
              <span>View SNAB Career Page</span>
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Simple SNAB Card Preview */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #d6cdbe",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: "#4f46e5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.1rem"
                }}
              >
                S
              </div>
              <div>
                <strong style={{ fontSize: "1.1rem" }}>SNAB</strong>
                <div style={{ fontSize: "0.78rem", color: "#57534e" }}>
                  Nashik, Maharashtra &bull; snab.co.in
                </div>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#57534e", lineHeight: 1.55, margin: "0 0 14px" }}>
              "Headquartered in Nashik, SNAB operates with deep ownership, small agile pods, and zero bureaucratic friction."
            </p>

            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1c1917", marginBottom: 6 }}>
              Tech Stack:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["Go", "Node", "React", "Kafka", "PostgreSQL", "Cloudflare"].map((tech, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.75rem",
                    background: "#f9f8f5",
                    border: "1px solid #e6dfd3",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 600
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: "rgba(5, 150, 105, 0.08)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
                fontSize: "0.78rem",
                color: "#059669",
                fontWeight: 600
              }}
            >
              ✓ 100% Paid Family Health Insurance &bull; MacBook Pro
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. REAL CONTACT SECTION & CONTACT FORM ─── */}
      <section
        id="contact"
        style={{
          background: "#ffffff",
          padding: "80px 24px",
          borderTop: "1px solid #e6dfd3",
          borderBottom: "1px solid #e6dfd3"
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span
              style={{
                color: "#4f46e5",
                fontSize: "0.8rem",
                fontWeight: 800,
                textTransform: "uppercase"
              }}
            >
              Get In Touch
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "8px 0 12px"
              }}
            >
              We're here to help. Talk with us.
            </h2>
            <p style={{ color: "#57534e", fontSize: "1rem", maxWidth: 580, margin: "0 auto" }}>
              Have questions about hiring, posting jobs, or agency partnerships?
              Reach out directly by phone, email, or send us a message below.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              alignItems: "flex-start"
            }}
          >
            {/* Contact Information Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Address Box */}
              <div
                style={{
                  background: "#fcfbf9",
                  border: "1px solid #e6dfd3",
                  borderRadius: 12,
                  padding: 24
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "rgba(79, 70, 229, 0.1)",
                      color: "#4f46e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <strong style={{ fontSize: "1rem" }}>Office Address</strong>
                </div>

                <div style={{ fontSize: "0.92rem", color: "#57534e", lineHeight: 1.6, marginLeft: 44 }}>
                  <div>Nashik, Maharashtra</div>
                  <div>India 422005</div>
                  <div style={{ marginTop: 8 }}>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Nashik%2C%20Maharashtra"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4f46e5",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <span>Get directions</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Box */}
              <div
                style={{
                  background: "#fcfbf9",
                  border: "1px solid #e6dfd3",
                  borderRadius: 12,
                  padding: 24
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "rgba(2, 132, 199, 0.1)",
                      color: "#0284c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <strong style={{ fontSize: "1rem" }}>Direct Email</strong>
                </div>

                <div style={{ fontSize: "0.92rem", color: "#57534e", lineHeight: 1.6, marginLeft: 44 }}>
                  <div>hello@snab.co.in</div>
                  <div style={{ marginTop: 8 }}>
                    <a
                      href="mailto:hello@snab.co.in"
                      style={{
                        color: "#0284c7",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <span>Send mail</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Numbers Box */}
              <div
                style={{
                  background: "#fcfbf9",
                  border: "1px solid #e6dfd3",
                  borderRadius: 12,
                  padding: 24
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "rgba(5, 150, 105, 0.1)",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <strong style={{ fontSize: "1rem" }}>Phone &amp; WhatsApp</strong>
                </div>

                <div style={{ fontSize: "0.92rem", color: "#57534e", lineHeight: 1.6, marginLeft: 44 }}>
                  <div>
                    <a href="tel:+919175917293" style={{ color: "inherit", textDecoration: "none", fontWeight: 600 }}>
                      +91 91759 17293
                    </a>
                  </div>
                  <div>
                    <a href="tel:+919545556045" style={{ color: "inherit", textDecoration: "none", fontWeight: 600 }}>
                      +91 95455 56045
                    </a>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <a
                      href="tel:+919175917293"
                      style={{
                        color: "#059669",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <span>Schedule a call</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form Column */}
            <div
              style={{
                background: "#fcfbf9",
                border: "1px solid #d6cdbe",
                borderRadius: 14,
                padding: "28px 24px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)"
              }}
            >
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 6px" }}>
                Send us a message
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#57534e", margin: "0 0 20px" }}>
                Fill out the form below. We usually respond within a few hours.
              </p>

              {formSubmitted ? (
                <div
                  style={{
                    background: "rgba(5, 150, 105, 0.08)",
                    border: "1px solid rgba(5, 150, 105, 0.25)",
                    borderRadius: 10,
                    padding: "24px 20px",
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "#059669",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px"
                    }}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 6px", color: "#059669" }}>
                    Message Received!
                  </h4>
                  <p style={{ fontSize: "0.88rem", color: "#57534e", margin: "0 0 16px", lineHeight: 1.5 }}>
                    Thank you, {contactForm.name}. Our team will review your message and reach out to{" "}
                    <b>{contactForm.email}</b> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setContactForm({
                        name: "",
                        email: "",
                        phone: "",
                        interest: "Hiring Talent",
                        message: ""
                      });
                    }}
                    style={{
                      background: "#059669",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 6,
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 5 }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d6cdbe",
                        background: "#ffffff",
                        fontSize: "0.88rem",
                        color: "#1c1917",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 5 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d6cdbe",
                        background: "#ffffff",
                        fontSize: "0.88rem",
                        color: "#1c1917",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 5 }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d6cdbe",
                        background: "#ffffff",
                        fontSize: "0.88rem",
                        color: "#1c1917",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Purpose */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 5 }}>
                      What would you like to discuss?
                    </label>
                    <select
                      value={contactForm.interest}
                      onChange={(e) => setContactForm({ ...contactForm, interest: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d6cdbe",
                        background: "#ffffff",
                        fontSize: "0.88rem",
                        color: "#1c1917",
                        outline: "none"
                      }}
                    >
                      <option value="Hiring Talent">We want to hire talent</option>
                      <option value="Post a Job">Post a new job opening</option>
                      <option value="Agency Partnership">Hiring agency partnership</option>
                      <option value="General Question">General question or feedback</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 5 }}>
                      Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about the roles you are hiring for..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d6cdbe",
                        background: "#ffffff",
                        fontSize: "0.88rem",
                        color: "#1c1917",
                        outline: "none",
                        fontFamily: "inherit",
                        resize: "vertical"
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    style={{
                      background: "#4f46e5",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      padding: "12px",
                      borderRadius: 8,
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      cursor: "pointer",
                      marginTop: 6
                    }}
                  >
                    {formSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FOOTER ─── */}
      <footer
        style={{
          background: "#fcfbf9",
          padding: "48px 24px 32px",
          borderTop: "1px solid #e6dfd3"
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 32,
            marginBottom: 36
          }}
        >
          {/* Col 1 */}
          <div>
            <img
              src="/logo-exhier.png"
              alt="ExpertHier"
              style={{
                height: 40,
                width: "auto",
                objectFit: "contain",
                background: "transparent",
                mixBlendMode: "multiply",
                marginBottom: 10
              }}
            />
            <p style={{ fontSize: "0.82rem", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
              ExpertHier makes hiring and tracking applicants straightforward for growing teams.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.85rem", marginBottom: 10, color: "#1c1917" }}>
              Quick Links
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: "0.82rem" }}>
              <li>
                <span onClick={() => navigate("/career-site")} style={{ color: "#57534e", cursor: "pointer" }}>
                  Browse Jobs
                </span>
              </li>
              <li>
                <span onClick={() => navigate("/career-site/snab")} style={{ color: "#57534e", cursor: "pointer" }}>
                  SNAB Nashik Jobs
                </span>
              </li>
              <li>
                <span onClick={() => navigate("/login")} style={{ color: "#57534e", cursor: "pointer" }}>
                  Workspace Sign In
                </span>
              </li>
              <li>
                <a href="#contact" style={{ color: "#57534e", textDecoration: "none" }}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.85rem", marginBottom: 10, color: "#1c1917" }}>
              Contact Details
            </div>
            <div style={{ fontSize: "0.82rem", color: "#57534e", lineHeight: 1.6 }}>
              <div>Nashik, Maharashtra, India 422005</div>
              <div>hello@snab.co.in</div>
              <div>+91 91759 17293 &bull; +91 95455 56045</div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            paddingTop: 18,
            borderTop: "1px solid #e6dfd3",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            fontSize: "0.78rem",
            color: "#78716c"
          }}
        >
          <div>&copy; {new Date().getFullYear()} ExpertHier &bull; SNAB. All rights reserved.</div>
          <div style={{ display: "flex", gap: 14 }}>
            <span onClick={() => navigate("/career-site")} style={{ cursor: "pointer" }}>
              Careers
            </span>
            <a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>
              Contact
            </a>
            <span onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
              Login
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
