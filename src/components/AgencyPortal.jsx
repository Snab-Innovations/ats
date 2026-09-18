import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import { AgencySidebar } from "./AgencySidebar";
import {
  Users2,
  Briefcase,
  UserPlus,
  IndianRupee,
  Share2,
  CheckCircle,
  Clock,
  Sparkles,
  Send,
  X,
  FileText,
  Building,
  GraduationCap,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Trash2,
  Plus,
  Search,
  Check,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ReceiptText,
  DollarSign,
  Building2,
  Settings,
  LogOut,
  Camera,
  Save,
  MapPin
} from "lucide-react";

export const AgencyPortal = () => {
  const {
    company,
    companies = [],
    jobs,
    candidates,
    agencies,
    selectedAgencyId,
    setSelectedAgencyId,
    activeAgency,
    addCandidate,
    addBulkCandidates,
    setActiveRole,
    uploadResumeFile,
    updateAgency,
    addAgency,
    logout,
    uploadImageToCloudinary
  } = useAts();

  // Active Tab: 'mandates' | 'bulk_upload' | 'pipeline' | 'payouts' | 'duplicate_check' | 'settings'
  const [activeTab, setActiveTab] = useState("mandates");

  const agencyInitials = activeAgency?.name
    ? activeAgency.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AP";

  // Agency Details & Settings State
  const [agencyForm, setAgencyForm] = useState({
    name: activeAgency?.name || "",
    logoUrl: activeAgency?.logoUrl || activeAgency?.logo || "",
    primaryContact: activeAgency?.primaryContact || "",
    email: activeAgency?.email || "",
    phone: activeAgency?.phone || "+91 ",
    city: activeAgency?.city || "Bengaluru & Mumbai",
    specialization: activeAgency?.specialization || "Technical Recruiting & Scaleups",
    commissionRate: activeAgency?.commissionRate || "8.50% [Standard Retainer]",
    portalCode: activeAgency?.portalCode || "",
    portalPassword: activeAgency?.portalPassword || "Agency#2026!",
    tier: activeAgency?.tier || "Elite Partner",
    gstin: activeAgency?.gstin || ""
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState("");

  // Sync agencyForm only when activeAgency ID changes (prevents overwriting user inputs while editing)
  React.useEffect(() => {
    if (activeAgency) {
      setAgencyForm({
        name: activeAgency.name || "",
        logoUrl: activeAgency.logoUrl || activeAgency.logo || "",
        primaryContact: activeAgency.primaryContact || "",
        email: activeAgency.email || "",
        phone: activeAgency.phone || "+91 ",
        city: activeAgency.city || "Bengaluru & Mumbai",
        specialization: activeAgency.specialization || "Technical Recruiting & Scaleups",
        commissionRate: activeAgency.commissionRate || activeAgency.commissionTier || "8.50% [Standard Retainer]",
        portalCode: activeAgency.portalCode || "",
        portalPassword: activeAgency.portalPassword || "Agency#2026!",
        tier: activeAgency.tier || "Elite Partner",
        gstin: activeAgency.gstin || ""
      });
    }
  }, [activeAgency?.id]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await uploadImageToCloudinary(file);
      if (res?.success && res.url) {
        setAgencyForm((prev) => ({ ...prev, logoUrl: res.url }));
        if (activeAgency?.id) {
          await updateAgency(activeAgency.id, { logoUrl: res.url, logo: res.url });
        }
      }
    } catch (err) {
      console.warn("Logo upload failed:", err);
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleSaveAgencySettings = async (e) => {
    e.preventDefault();
    if (!agencyForm.name.trim()) return;

    const cleanLogo = (agencyForm.logoUrl || "").trim();
    setIsSavingSettings(true);

    try {
      const payload = {
        ...agencyForm,
        commissionRate: agencyForm.commissionRate,
        commissionTier: agencyForm.commissionRate,
        logoUrl: cleanLogo,
        logo: cleanLogo
      };

      if (activeAgency && activeAgency.id) {
        await updateAgency(activeAgency.id, payload);
      } else {
        const created = await addAgency(payload);
        if (created?.id) {
          setSelectedAgencyId(created.id);
        }
      }

      setSettingsSuccessMsg("Agency details saved successfully!");
      setTimeout(() => setSettingsSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to save agency settings:", err);
      alert("Failed to save agency details: " + (err.message || err));
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Single candidate modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedJobToSubmit, setSelectedJobToSubmit] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isUploadingSingleResume, setIsUploadingSingleResume] = useState(false);

  // Job Spec Drawer State
  const [specJob, setSpecJob] = useState(null);

  // Duplicate checker state
  const [dupQuery, setDupQuery] = useState("");
  const [dupResult, setDupResult] = useState(null);

  // Search & filter in mandates across all client companies
  const [searchMandates, setSearchMandates] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterCompany, setFilterCompany] = useState("all");

  // Search in submissions
  const [searchSubmissions, setSearchSubmissions] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterSubmissionCompany, setFilterSubmissionCompany] = useState("all");
  const [filterSubmissionJob, setFilterSubmissionJob] = useState("all");
  const [filterSubmissionTime, setFilterSubmissionTime] = useState("all");
  const [filterSubmissionNotice, setFilterSubmissionNotice] = useState("all");

  // Single Candidate Form
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    location: "Bengaluru, Karnataka",
    experience: "5 years",
    currentCompany: "",
    currentCtc: "",
    expectedCtc: "",
    noticePeriod: "Immediate Joiner",
    education: "",
    resumeFileName: "",
    resumeUrl: "",
    resumeSummary: "",
    agencyNotes: "",
    answers: {}
  });

  // Bulk Candidates Table State
  const [bulkTargetJobId, setBulkTargetJobId] = useState("");
  const [bulkRows, setBulkRows] = useState([
    {
      id: 1,
      name: "",
      email: "",
      phone: "+91 ",
      currentCompany: "",
      experience: "",
      currentCtc: "",
      expectedCtc: "",
      noticePeriod: "Immediate Joiner",
      education: "",
      resumeFileName: "",
      resumeFileSize: ""
    }
  ]);
  const [bulkSubmittedSuccess, setBulkSubmittedSuccess] = useState(false);
  const [bulkBatchId, setBulkBatchId] = useState("");

  // Invoice modal state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Active syndicated jobs from companies that have NOT blocked this agency
  const syndicatedJobs = jobs.filter((j) => {
    if (!j.syndicateToAgencies || j.status !== "active") return false;
    const jobCompId = j.companyId || company.id;
    const isBlocked = (activeAgency?.blockedCompanyIds || []).includes(jobCompId);
    return !isBlocked;
  });

  // Filter submissions by active agency across all client companies
  const mySubmissions = candidates.filter(
    (c) =>
      c.source === activeAgency?.name ||
      (c.sourceType === "agency" && c.source?.toLowerCase().includes(activeAgency?.name?.split(" ")[0]?.toLowerCase()))
  );

  const hiredByMe = mySubmissions.filter((c) => c.stage === "hired");

  // Filtered mandates list across all client companies
  const filteredMandates = syndicatedJobs.filter((job) => {
    const q = searchMandates.toLowerCase();
    const jobComp = companies.find((c) => c.id === job.companyId) || company;
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      (jobComp.name && jobComp.name.toLowerCase().includes(q)) ||
      job.department.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      (job.skills && job.skills.some((s) => s.toLowerCase().includes(q)));
    const matchesDept = filterDept === "all" || job.department === filterDept;
    const matchesCompany =
      filterCompany === "all" ||
      (job.companyId ? job.companyId === filterCompany : company.id === filterCompany);
    return matchesQuery && matchesDept && matchesCompany;
  });

  // Unique client companies that currently have active syndicated mandates
  const clientCompaniesWithMandates = companies.filter((c) =>
    syndicatedJobs.some((j) => (j.companyId ? j.companyId === c.id : company.id === c.id))
  );

  // Departments in syndicated jobs
  const departments = ["all", ...new Set(syndicatedJobs.map((j) => j.department))];

  // Open single submission modal for a specific job
  const handleOpenSubmit = (job) => {
    setSelectedJobToSubmit(job);
    setCandidateForm({
      name: "",
      email: "",
      phone: "+91 ",
      location: "Bengaluru, Karnataka",
      experience: "5 years",
      currentCompany: "",
      currentCtc: "₹25 LPA",
      expectedCtc: "₹36 LPA",
      noticePeriod: "15 Days Notice",
      education: "IIT / BITS / NIT",
      resumeSummary: "",
      agencyNotes: "",
      answers: {}
    });
    setSubmittedSuccess(false);
    setIsSubmitModalOpen(true);
  };

  // Helper alias for sidebar / header actions
  const handleOpenSubmitModal = (job) => {
    handleOpenSubmit(job || syndicatedJobs[0]);
  };

  // Switch to bulk tab with a specific job pre-selected
  const handleOpenBulkForJob = (job) => {
    setBulkTargetJobId(job.id);
    setActiveTab("bulk_upload");
  };

  // Submit Single Candidate
  const handleCandidateSubmit = (e) => {
    e.preventDefault();
    if (!candidateForm.name.trim() || !selectedJobToSubmit) return;

    const screeningAnswers = (selectedJobToSubmit.screeningQuestions || []).map((q, idx) => ({
      question: q,
      answer: candidateForm.answers[idx] || "Profile verified by agency partner."
    }));

    const targetComp = companies.find((c) => c.id === selectedJobToSubmit.companyId) || company;

    addCandidate({
      name: candidateForm.name.trim(),
      email: candidateForm.email.trim(),
      phone: candidateForm.phone.trim() || "+91 98201 44821",
      location: candidateForm.location,
      jobId: selectedJobToSubmit.id,
      companyId: selectedJobToSubmit.companyId || company.id,
      role: selectedJobToSubmit.title,
      source: activeAgency?.name || "Agency Partner",
      sourceType: "agency",
      experience: candidateForm.experience,
      currentCompany: candidateForm.currentCompany || "Confidential Product Firm",
      currentCtc: candidateForm.currentCtc,
      expectedCtc: candidateForm.expectedCtc,
      noticePeriod: candidateForm.noticePeriod,
      education: candidateForm.education,
      resumeUrl:
        candidateForm.resumeUrl ||
        `https://res.cloudinary.com/ljelkpy4/raw/upload/${candidateForm.name.replace(/\s+/g, "_")}_Resume.pdf`,
      resumeSource: candidateForm.resumeUrl?.includes("cloudinary.com")
        ? "cloudinary_storage"
        : "agency_portal",
      resumeFileName:
        candidateForm.resumeFileName || `${candidateForm.name.replace(/\s+/g, "_")}_Resume.pdf`,
      resumeFileSize: candidateForm.resumeFileSize || "172 KB",
      tags: [
        "Agency Candidate",
        activeAgency?.name?.split(" ")[0] || "Agency",
        targetComp.name?.split(" ")[0] || "Client",
        candidateForm.noticePeriod?.includes("Immediate") ? "Immediate Joiner" : "Notice Verified"
      ],
      screeningAnswers,
      notes: [
        {
          author: `${activeAgency?.primaryContact || "Recruiter"} (${activeAgency?.name || "Agency"})`,
          text:
            candidateForm.agencyNotes ||
            `Referred via Agency Portal for ${selectedJobToSubmit.title} at ${targetComp.name}. Candidate is serving notice period and ready for immediate interview rounds.`,
          date: new Date().toISOString().split("T")[0]
        }
      ]
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmitModalOpen(false);
      setSubmittedSuccess(false);
    }, 1800);
  };

  // Bulk: Add new empty row
  const handleAddBulkRow = () => {
    const newId = Date.now();
    setBulkRows([
      ...bulkRows,
      {
        id: newId,
        name: "",
        email: "",
        phone: "+91 ",
        currentCompany: "",
        experience: "4-6 yrs",
        currentCtc: "₹22 LPA",
        expectedCtc: "₹32 LPA",
        noticePeriod: "30 Days Notice",
        education: "B.Tech",
        resumeFileName: "",
        resumeFileSize: ""
      }
    ]);
  };

  // Bulk: Remove row
  const handleRemoveBulkRow = (rowId) => {
    setBulkRows(bulkRows.filter((r) => r.id !== rowId));
  };

  // Bulk: Update specific field
  const handleUpdateBulkField = (rowId, field, value) => {
    setBulkRows(
      bulkRows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
  };

  // Bulk: Multi-file Resume Batch Uploader
  const handleBatchResumeFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newRows = files.map((file, idx) => {
      const rowId = Date.now() + idx;
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .replace(/(resume|cv|profile|final|updated)/gi, "")
        .trim();
      const generatedEmail = `${cleanName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;

      // Upload each file to Cloudinary in background and attach permanent HTTPS URL
      uploadResumeFile(file).then((res) => {
        if (res?.success && res?.url) {
          setBulkRows((current) =>
            current.map((r) =>
              r.id === rowId
                ? {
                    ...r,
                    resumeUrl: res.url,
                    resumeSource: "cloudinary_storage"
                  }
                : r
            )
          );
        }
      });

      return {
        id: rowId,
        name: cleanName || `Candidate ${bulkRows.length + idx + 1}`,
        email: generatedEmail,
        phone: "+91 98201 " + Math.floor(10000 + Math.random() * 90000),
        currentCompany: "Product Scaleup",
        experience: "5 yrs",
        currentCtc: "₹24 LPA",
        expectedCtc: "₹34 LPA",
        noticePeriod: "15 Days Notice",
        education: "B.Tech / MCA",
        resumeFileName: file.name,
        resumeFileSize: `${(file.size / 1024).toFixed(0)} KB`,
        resumeUrl: ""
      };
    });

    setBulkRows((prev) => [...prev, ...newRows]);
  };

  // Download CSV template
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Name,Email,Phone,Current Company,Experience,Current CTC,Expected CTC,Notice Period,Education\n" +
      "Aarav Verma,aarav.verma@gmail.com,+91 98201 44821,Swiggy,5 yrs,₹26 LPA,₹36 LPA,Immediate Joiner,IIT Bombay\n" +
      "Simran Kaur,simran.k@gmail.com,+91 98450 11223,Flipkart,6 yrs,₹30 LPA,₹42 LPA,15 Days Notice,BITS Pilani";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sample_Candidate_Batch_${(company.name || "ATS").replace(/\s/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk: Submit all rows
  const handleSubmitBulkBatch = (e) => {
    e.preventDefault();
    const validRows = bulkRows.filter((r) => r.name.trim() && r.email.trim());
    if (validRows.length === 0) {
      alert("Please add at least one candidate with a name and email.");
      return;
    }

    const targetJob = syndicatedJobs.find((j) => j.id === bulkTargetJobId) || syndicatedJobs[0];
    if (!targetJob) {
      alert("Please select a target job requisition for this batch.");
      return;
    }
    const targetComp = companies.find((c) => c.id === targetJob.companyId) || company;

    const candidatePayload = validRows.map((r) => ({
      name: r.name.trim(),
      email: r.email.trim(),
      phone: r.phone.trim() || "+91 98201 XXXXX",
      location: "Bengaluru / Pan-India",
      jobId: targetJob.id,
      companyId: targetJob.companyId || company.id,
      role: targetJob.title,
      source: activeAgency?.name || "Agency Partner",
      sourceType: "agency",
      experience: r.experience,
      currentCompany: r.currentCompany || "Confidential Tech Scaleup",
      currentCtc: r.currentCtc,
      expectedCtc: r.expectedCtc,
      noticePeriod: r.noticePeriod,
      education: r.education,
      resumeFileName: r.resumeFileName || `${r.name.replace(/\s+/g, "_")}_Resume.pdf`,
      resumeFileSize: r.resumeFileSize || "148 KB",
      resumeUrl: "https://experthire.io/resumes/" + (r.resumeFileName || `${r.name.replace(/\s+/g, "_")}.pdf`),
      resumeSummary: `${r.name} has ${r.experience} experience in software engineering. Currently at ${r.currentCompany || "Confidential Tech"}, educated at ${r.education}. Profile and verified resume submitted by ${activeAgency?.name || "Agency"} for ${targetComp.name}.`,
      tags: [
        "Agency Batch",
        activeAgency?.name?.split(" ")[0] || "Agency",
        targetComp.name?.split(" ")[0] || "Client",
        r.noticePeriod?.includes("Immediate") ? "Immediate Joiner" : "Notice Verified",
        r.resumeFileName ? "Resume Attached" : "Profile Sourced"
      ]
    }));

    addBulkCandidates(candidatePayload);

    const batchCode = `BATCH-${activeAgency?.portalCode?.split("-")[0] || "AGY"}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBulkBatchId(batchCode);
    setBulkSubmittedSuccess(true);

    setTimeout(() => {
      setBulkSubmittedSuccess(false);
      // Clear rows after successful import
      setBulkRows([]);
      setActiveTab("pipeline");
    }, 2400);
  };

  // Duplicate checker handler
  const handleCheckDuplicate = (e) => {
    e.preventDefault();
    if (!dupQuery.trim()) return;
    const query = dupQuery.trim().toLowerCase();
    const match = candidates.find(
      (c) => c.email.toLowerCase() === query || c.phone?.replace(/\s/g, "") === query.replace(/\s/g, "")
    );
    if (match) {
      const matchComp = companies.find((c) => c.id === match.companyId) || company;
      setDupResult({
        found: true,
        candidateName: match.name,
        role: match.role,
        companyName: matchComp.name,
        source: match.source,
        date: match.submittedAt || "Recently"
      });
    } else {
      setDupResult({
        found: false
      });
    }
  };

  // Filtered Submissions in Tracker
  const filteredSubmissions = mySubmissions.filter((c) => {
    const q = searchSubmissions.toLowerCase().trim();
    const matchesQ =
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.role && c.role.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q));

    const matchesStage = filterStage === "all" || c.stage === filterStage;

    const matchesCompany =
      filterSubmissionCompany === "all" || c.companyId === filterSubmissionCompany;

    const matchesJob =
      filterSubmissionJob === "all" ||
      c.jobId === filterSubmissionJob ||
      (c.role && c.role.toLowerCase() === filterSubmissionJob.toLowerCase());

    // Time filter
    let matchesTime = true;
    if (filterSubmissionTime !== "all") {
      const candidateDateStr = c.submittedAt || c.appliedDate || c.date;
      if (!candidateDateStr) {
        matchesTime = false;
      } else {
        const cDate = new Date(candidateDateStr);
        if (!isNaN(cDate.getTime())) {
          const diffDays = (new Date() - cDate) / (1000 * 60 * 60 * 24);
          if (filterSubmissionTime === "today") matchesTime = diffDays <= 1;
          else if (filterSubmissionTime === "7d") matchesTime = diffDays <= 7;
          else if (filterSubmissionTime === "30d") matchesTime = diffDays <= 30;
          else if (filterSubmissionTime === "90d") matchesTime = diffDays <= 90;
          else if (filterSubmissionTime === "year") matchesTime = diffDays <= 365;
        }
      }
    }

    return matchesQ && matchesStage && matchesCompany && matchesJob && matchesTime;
  });

  return (
    <div className="admin-shell">
      {/* 1. Consistent Left Agency Sidebar */}
      <AgencySidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmitModal={handleOpenSubmitModal}
      />

      {/* 2. Main Work Area with Uniform ATS Page Header */}
      <div className="admin-main">
        <header
          className="page-header"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            padding: "20px 32px"
          }}
        >
          <div className="page-title-group">
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
              {activeTab === "mandates" && "Active Mandates & Bounties"}
              {activeTab === "bulk_upload" && "Bulk Candidate Import"}
              {activeTab === "pipeline" && "Submitted Candidate Pipeline"}
              {activeTab === "payouts" && "Commission Wallet & Payouts"}
              {activeTab === "duplicate_check" && "Attribution & Duplicate Checker"}
              {activeTab === "settings" && "Agency Details & Settings"}
            </h1>
            <p style={{ marginTop: 4, color: "var(--text-secondary)", fontSize: "0.85rem", margin: "4px 0 0" }}>
              {activeTab === "mandates" &&
                "Active requisitions open for headhunting across client companies with transparent cash placement bounties."}
              {activeTab === "bulk_upload" &&
                "Add candidate profiles and dispatch resumes directly into employer ATS."}
              {activeTab === "pipeline" &&
                "Track real-time candidate progression and stage updates across employer requisitions."}
              {activeTab === "payouts" &&
                "Placement commission ledger, TDS 194H calculations, and GST tax invoice generation."}
              {activeTab === "duplicate_check" &&
                "Check candidate email or phone against client company talent pools before reaching out."}
              {activeTab === "settings" &&
                "Manage agency profile, contact information, commercials, and portal credentials."}
            </p>
          </div>

          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {activeTab === "bulk_upload" && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={handleDownloadCsvTemplate}>
                  <Download size={14} />
                  <span>CSV Template</span>
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleAddBulkRow}>
                  <Plus size={14} />
                  <span>Add Candidate</span>
                </button>
              </>
            )}

            {activeTab === "payouts" && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsInvoiceModalOpen(true)}
              >
                <ReceiptText size={14} />
                <span>Generate GST Invoice</span>
              </button>
            )}
          </div>
        </header>

        <div className="page-content" style={{ padding: "24px 32px 50px" }}>
          {/* TAB 1: MANDATES (PER-JOB CANDIDATE SUBMISSION) */}
          {activeTab === "mandates" && (
            <div>
              {/* Sourcing Overview KPI Strip */}
              <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">Dispatched Mandates</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed" }}>
                      <Briefcase size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{syndicatedJobs.length}</div>
                  <div className="kpi-footer">
                    <span style={{ color: "#7c3aed", fontWeight: 700 }}>Open for headhunting</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">Your Submitted Profiles</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7" }}>
                      <UserPlus size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{mySubmissions.length}</div>
                  <div className="kpi-footer">
                    <span>Tracked across ExpertHire ATS</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">In Active Rounds</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(219, 39, 119, 0.1)", color: "#db2777" }}>
                      <Clock size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {mySubmissions.filter((c) => c.stage === "interview" || c.stage === "offer").length}
                  </div>
                  <div className="kpi-footer">
                    <span style={{ color: "#db2777", fontWeight: 700 }}>Active interview pipeline</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">Bounties Claimed</span>
                    <div className="kpi-icon-wrap" style={{ background: "rgba(5, 150, 105, 0.1)", color: "#059669" }}>
                      <IndianRupee size={18} />
                    </div>
                  </div>
                  <div className="kpi-value" style={{ color: "#059669" }}>
                    {activeAgency?.totalBountiesEarned || "₹0"}
                  </div>
                  <div className="kpi-footer">
                    <span style={{ color: "#059669", fontWeight: 700 }}>{hiredByMe.length} Placed Candidates</span>
                  </div>
                </div>
              </div>

              {/* Client Company Filter Strip */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  overflowX: "auto",
                  paddingBottom: 4
                }}
              >
                <span style={{ fontSize: "0.775rem", fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                  <Building2 size={14} color="var(--primary)" /> Client Company:
                </span>

                <button
                  onClick={() => setFilterCompany("all")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.775rem",
                    fontWeight: filterCompany === "all" ? 700 : 500,
                    background: filterCompany === "all" ? "var(--primary)" : "var(--bg-surface)",
                    color: filterCompany === "all" ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${filterCompany === "all" ? "var(--primary)" : "var(--border-subtle)"}`,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span>All Client Companies</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      background: filterCompany === "all" ? "rgba(255,255,255,0.25)" : "var(--bg-surface-elevated)",
                      fontWeight: 800
                    }}
                  >
                    {syndicatedJobs.length}
                  </span>
                </button>

                {companies.map((c) => {
                  const compCount = syndicatedJobs.filter((j) => (j.companyId ? j.companyId === c.id : company.id === c.id)).length;
                  if (compCount === 0) return null;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setFilterCompany(c.id)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.775rem",
                        fontWeight: filterCompany === c.id ? 700 : 500,
                        background: filterCompany === c.id ? "var(--primary)" : "var(--bg-surface)",
                        color: filterCompany === c.id ? "#fff" : "var(--text-secondary)",
                        border: `1px solid ${filterCompany === c.id ? "var(--primary)" : "var(--border-subtle)"}`,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} style={{ width: 14, height: 14, borderRadius: 3, objectFit: "contain" }} />
                      ) : (
                        <Building2 size={13} />
                      )}
                      <span>{c.name}</span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          padding: "1px 6px",
                          borderRadius: "var(--radius-full)",
                          background: filterCompany === c.id ? "rgba(255,255,255,0.25)" : "var(--bg-surface-elevated)",
                          fontWeight: 800
                        }}
                      >
                        {compCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Department Filters */}
              <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 14
              }}
            >
              <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                <Search
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="text"
                  placeholder="Search mandates by role, Go, Kafka, React, Bengaluru..."
                  className="form-input"
                  style={{ paddingLeft: 38, height: 38, fontSize: "0.85rem" }}
                  value={searchMandates}
                  onChange={(e) => setSearchMandates(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setFilterDept(dept)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.775rem",
                      fontWeight: filterDept === dept ? 700 : 500,
                      background: filterDept === dept ? "var(--primary)" : "var(--bg-surface)",
                      color: filterDept === dept ? "#fff" : "var(--text-secondary)",
                      border: `1px solid ${filterDept === dept ? "var(--primary)" : "var(--border-subtle)"}`,
                      cursor: "pointer"
                    }}
                  >
                    {dept === "all" ? "All Departments" : dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandates Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 18 }}>
              {filteredMandates.map((job) => {
                const jobCompany = companies.find((c) => c.id === job.companyId) || company;
                return (
                <div key={job.id} className="bounty-card-glow" style={{ padding: "20px 22px", display: "flex", flexDirection: "column" }}>
                  {/* Client Company Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--border-subtle)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {jobCompany.logoUrl ? (
                        <img
                          src={jobCompany.logoUrl}
                          alt={jobCompany.name}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "var(--radius-sm)",
                            objectFit: "contain",
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            padding: 2
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "var(--radius-sm)",
                            background: jobCompany.brandColor || "var(--primary)",
                            color: "#fff",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {jobCompany.logoInitials || "CO"}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
                          {jobCompany.name}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                          {jobCompany.headquarters?.split("&")[0]?.trim() || "India"} &bull; Verified Client ATS
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--bg-surface-elevated)",
                        color: "var(--primary)",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      Client Mandate
                    </span>
                  </div>

                  {/* Bounty Banner Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: "0.725rem",
                        fontWeight: 800,
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(124, 58, 237, 0.1)",
                        color: "#7c3aed",
                        border: "1px solid rgba(124, 58, 237, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{job.agencyBounty || "₹75,000 Cash Bounty"}</span>
                    </span>

                    <span style={{ fontSize: "0.725rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      {job.agencyCommissionPercent || "8.33% CTC"}
                    </span>
                  </div>

                  {/* Job Title & Details */}
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 6px", color: "var(--text-primary)" }}>
                    {job.title}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8rem", color: "var(--text-secondary)", flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Building size={13} color="var(--text-muted)" />
                      <span>{job.department}</span>
                    </span>
                    <span>&bull;</span>
                    <span>{job.location}</span>
                    <span>&bull;</span>
                    <span>{job.workType}</span>
                    <span>&bull;</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <GraduationCap size={13} color="var(--primary)" />
                      <span>{job.education || "B.Tech / B.E."}</span>
                    </span>
                  </div>

                  {/* Salary & Notice preference */}
                  <div
                    style={{
                      background: "var(--bg-surface-elevated)",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.825rem"
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.725rem" }}>Candidate Budget:</span>
                      <div style={{ fontWeight: 800, color: "var(--primary)" }}>₹ {job.salary}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.725rem" }}>Notice Preference:</span>
                      <div style={{ fontWeight: 700, color: "#059669", fontSize: "0.775rem" }}>
                        {job.noticePeriodPreference || "30 Days Max"}
                      </div>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "0.825rem",
                      color: "var(--text-secondary)",
                      margin: "0 0 14px",
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {job.description}
                  </p>

                  {/* Sourcing Action Buttons for EACH job */}
                  <div style={{ marginTop: "auto", display: "flex", gap: 8, paddingTop: 10, borderTop: "1px solid var(--border-subtle)" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, padding: "7px 10px", fontSize: "0.775rem" }}
                      onClick={() => setSpecJob(job)}
                    >
                      View Specs
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "7px 10px", fontSize: "0.775rem" }}
                      onClick={() => handleOpenBulkForJob(job)}
                      title="Bulk upload multiple candidates for this mandate"
                    >
                      <FileSpreadsheet size={13} />
                      <span>Bulk</span>
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1.4, padding: "7px 12px", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                      onClick={() => handleOpenSubmit(job)}
                    >
                      <UserPlus size={14} />
                      <span>Submit Profile</span>
                    </button>
                  </div>
                </div>
              ); })}
            </div>
          </div>
        )}

        {/* TAB 2: FAST-TRACK BULK CANDIDATE IMPORT */}
        {activeTab === "bulk_upload" && (
          <div>
            {/* Dedicated Top Action Bar */}
            <div className="card" style={{ marginBottom: 16, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: "rgba(16, 185, 129, 0.12)",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <FileSpreadsheet size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                      Fast-Track Multi-Candidate Spreadsheet Import
                    </h3>
                    <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginTop: 2, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span>Target Mandate:</span>
                      <select
                        className="form-select"
                        style={{
                          padding: "2px 8px",
                          fontSize: "0.775rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                          background: "var(--bg-surface-elevated)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-subtle)"
                        }}
                        value={bulkTargetJobId || (syndicatedJobs[0]?.id || "")}
                        onChange={(e) => setBulkTargetJobId(e.target.value)}
                      >
                        {syndicatedJobs.map((j) => {
                          const jComp = companies.find((c) => c.id === j.companyId);
                          return (
                            <option key={j.id} value={j.id}>
                              {jComp ? `[${jComp.name}] ` : ""}{j.title} &bull; {j.location} (Bounty: {j.agencyBounty})
                            </option>
                          );
                        })}
                      </select>
                      <span className="badge badge-active" style={{ fontSize: "0.68rem", padding: "1px 6px" }}>
                        90-Day Lock
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {/* Multi-Resume Batch Upload */}
                  <label
                    className="btn btn-secondary btn-sm"
                    style={{
                      cursor: "pointer",
                      background: "rgba(79, 70, 229, 0.08)",
                      color: "var(--primary)",
                      borderColor: "rgba(79, 70, 229, 0.25)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                    title="Select multiple resume PDF/DOCX files to automatically populate candidate rows"
                  >
                    <UploadCloud size={14} />
                    <span>Upload Resumes (PDF / DOCX)</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.doc"
                      style={{ display: "none" }}
                      onChange={handleBatchResumeFiles}
                    />
                  </label>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleDownloadCsvTemplate}
                  >
                    <Download size={14} />
                    <span>CSV Template</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddBulkRow}
                  >
                    <Plus size={14} />
                    <span>Add Row</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSubmitBulkBatch}
                    style={{
                      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
                    }}
                  >
                    <Send size={14} />
                    <span>Dispatch Batch ({bulkRows.filter((r) => r.name.trim() && r.email.trim()).length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Success Notification */}
            {bulkSubmittedSuccess && (
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #10b981",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px 20px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#065f46"
                }}
              >
                <CheckCircle size={24} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                    Batch Dispatched Successfully! (Reference: {bulkBatchId})
                  </div>
                  <div style={{ fontSize: "0.825rem" }}>
                    All candidate profiles have been added to the active ATS pipeline with 90-day exclusive agency attribution.
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Table */}
            <form onSubmit={handleSubmitBulkBatch}>
              <div className="bulk-table-container" style={{ marginBottom: 16 }}>
                <table className="bulk-table">
                  <thead>
                    <tr>
                      <th style={{ width: 36 }}>#</th>
                      <th style={{ minWidth: 150 }}>Candidate Full Name *</th>
                      <th style={{ minWidth: 170 }}>Email Address *</th>
                      <th style={{ minWidth: 130 }}>Phone (+91) *</th>
                      <th style={{ minWidth: 160 }}>Attached Resume / CV *</th>
                      <th style={{ minWidth: 130 }}>Current Company</th>
                      <th style={{ minWidth: 90 }}>Exp</th>
                      <th style={{ minWidth: 100 }}>Current CTC</th>
                      <th style={{ minWidth: 100 }}>Expected CTC</th>
                      <th style={{ minWidth: 130 }}>Notice Period</th>
                      <th style={{ minWidth: 110 }}>Education</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.length === 0 ? (
                      <tr>
                        <td colSpan={12} style={{ textAlign: "center", padding: "36px 16px", color: "var(--text-muted)" }}>
                          No candidates in batch. Click "+ Add Row" or "Upload Resumes (PDF)" above.
                        </td>
                      </tr>
                    ) : (
                      bulkRows.map((row, idx) => (
                        <tr key={row.id}>
                          <td style={{ textAlign: "center", fontWeight: 700, color: "var(--text-muted)" }}>
                            {idx + 1}
                          </td>
                          <td>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Sharma"
                              className="bulk-input"
                              value={row.name}
                              onChange={(e) => handleUpdateBulkField(row.id, "name", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              required
                              placeholder="rahul@gmail.com"
                              className="bulk-input"
                              value={row.email}
                              onChange={(e) => handleUpdateBulkField(row.id, "email", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              required
                              placeholder="+91 98201 XXXXX"
                              className="bulk-input"
                              value={row.phone}
                              onChange={(e) => handleUpdateBulkField(row.id, "phone", e.target.value)}
                            />
                          </td>
                          {/* Resume Upload Column */}
                          <td>
                            {row.resumeFileName ? (
                              <div
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  background: "rgba(79, 70, 229, 0.08)",
                                  border: "1px solid rgba(79, 70, 229, 0.25)",
                                  borderRadius: "var(--radius-sm)",
                                  padding: "3px 8px",
                                  fontSize: "0.72rem",
                                  color: "var(--primary)",
                                  fontWeight: 600,
                                  maxWidth: 160
                                }}
                              >
                                <FileText size={12} color="var(--primary)" />
                                <span
                                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  title={`${row.resumeFileName} (${row.resumeFileSize || "PDF"})`}
                                >
                                  {row.resumeFileName}
                                </span>
                                <button
                                  type="button"
                                  style={{
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    padding: 0,
                                    background: "transparent",
                                    border: "none",
                                    display: "inline-flex"
                                  }}
                                  title="Remove resume"
                                  onClick={() => {
                                    handleUpdateBulkField(row.id, "resumeFileName", "");
                                    handleUpdateBulkField(row.id, "resumeFileSize", "");
                                  }}
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ) : (
                              <label
                                className="btn btn-ghost btn-sm"
                                style={{
                                  border: "1px dashed var(--border-medium)",
                                  borderRadius: "var(--radius-sm)",
                                  padding: "3px 8px",
                                  cursor: "pointer",
                                  fontSize: "0.72rem",
                                  color: "var(--primary)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  whiteSpace: "nowrap",
                                  background: "var(--bg-surface)"
                                }}
                              >
                                <UploadCloud size={13} />
                                <span>+ Upload CV</span>
                                <input
                                  type="file"
                                  accept=".pdf,.docx,.doc"
                                  style={{ display: "none" }}
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      handleUpdateBulkField(row.id, "resumeFileName", file.name);
                                      handleUpdateBulkField(
                                        row.id,
                                        "resumeFileSize",
                                        `${(file.size / 1024).toFixed(0)} KB`
                                      );
                                      try {
                                        const res = await uploadResumeFile(file);
                                        if (res?.success && res?.url) {
                                          handleUpdateBulkField(row.id, "resumeUrl", res.url);
                                          handleUpdateBulkField(
                                            row.id,
                                            "resumeSource",
                                            "cloudinary_storage"
                                          );
                                        }
                                      } catch (cErr) {
                                        console.warn("Cloudinary upload failed:", cErr);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g. Swiggy"
                              className="bulk-input"
                              value={row.currentCompany}
                              onChange={(e) => handleUpdateBulkField(row.id, "currentCompany", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="6 yrs"
                              className="bulk-input"
                              value={row.experience}
                              onChange={(e) => handleUpdateBulkField(row.id, "experience", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="₹26 LPA"
                              className="bulk-input"
                              value={row.currentCtc}
                              onChange={(e) => handleUpdateBulkField(row.id, "currentCtc", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="₹36 LPA"
                              className="bulk-input"
                              value={row.expectedCtc}
                              onChange={(e) => handleUpdateBulkField(row.id, "expectedCtc", e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              className="bulk-input"
                              value={row.noticePeriod}
                              onChange={(e) => handleUpdateBulkField(row.id, "noticePeriod", e.target.value)}
                            >
                              <option value="Immediate Joiner">Immediate Joiner</option>
                              <option value="15 Days Notice">15 Days Notice</option>
                              <option value="30 Days Notice">30 Days Notice</option>
                              <option value="60 Days (Buyout OK)">60 Days (Buyout OK)</option>
                              <option value="90 Days Official">90 Days Official</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="IIT / BITS"
                              className="bulk-input"
                              value={row.education}
                              onChange={(e) => handleUpdateBulkField(row.id, "education", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon"
                              style={{ padding: 4 }}
                              onClick={() => handleRemoveBulkRow(row.id)}
                            >
                              <Trash2 size={13} color="#dc2626" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddBulkRow}>
                  <Plus size={14} />
                  <span>Add Another Candidate Row</span>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                    Ready to dispatch: <strong>{bulkRows.filter((r) => r.name && r.email).length} candidates</strong>
                  </span>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={bulkRows.filter((r) => r.name && r.email).length === 0}
                    style={{ padding: "10px 22px", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Send size={15} />
                    {(() => {
                      const targetJob = syndicatedJobs.find((j) => j.id === bulkTargetJobId) || syndicatedJobs[0];
                      const targetComp = companies.find((c) => c.id === targetJob?.companyId) || company;
                      return <span>Dispatch Batch to {targetComp.name} ATS &rarr;</span>;
                    })()}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SUBMISSIONS & STAGE PIPELINE TRACKER */}
        {activeTab === "pipeline" && (
          <div>
            {/* Unified Search, Filters & Stage Bar Card */}
            <div
              className="card"
              style={{
                padding: "16px 20px",
                marginBottom: 20,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg, 12px)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {/* Row 1: Search & Filter Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap"
                }}
              >
                {/* Search Box */}
                <div style={{ position: "relative", flex: "1 1 280px", minWidth: 240 }}>
                  <Search
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="text"
                    placeholder="Search submitted candidates by name, email, or role..."
                    className="form-input"
                    style={{
                      paddingLeft: 38,
                      height: 40,
                      fontSize: "0.85rem",
                      width: "100%",
                      borderRadius: 8,
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-surface-elevated, #f8fafc)"
                    }}
                    value={searchSubmissions}
                    onChange={(e) => setSearchSubmissions(e.target.value)}
                  />
                </div>

                {/* Company Filter */}
                <div style={{ flex: "0 1 180px", minWidth: 160 }}>
                  <select
                    className="form-select"
                    style={{
                      height: 40,
                      fontSize: "0.825rem",
                      padding: "0 12px",
                      width: "100%",
                      borderRadius: 8,
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-surface-elevated, #f8fafc)"
                    }}
                    value={filterSubmissionCompany}
                    onChange={(e) => {
                      setFilterSubmissionCompany(e.target.value);
                      setFilterSubmissionJob("all");
                    }}
                    title="Filter by Employer Company"
                  >
                    <option value="all">All Client Companies</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Requisition Filter */}
                <div style={{ flex: "0 1 210px", minWidth: 180 }}>
                  <select
                    className="form-select"
                    style={{
                      height: 40,
                      fontSize: "0.825rem",
                      padding: "0 12px",
                      width: "100%",
                      borderRadius: 8,
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-surface-elevated, #f8fafc)"
                    }}
                    value={filterSubmissionJob}
                    onChange={(e) => setFilterSubmissionJob(e.target.value)}
                    title="Filter by Job Requisition"
                  >
                    <option value="all">All Jobs & Requisitions</option>
                    {syndicatedJobs
                      .filter((j) => filterSubmissionCompany === "all" || (j.companyId || company.id) === filterSubmissionCompany)
                      .map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Time Range Filter */}
                <div style={{ flex: "0 1 140px", minWidth: 130 }}>
                  <select
                    className="form-select"
                    style={{
                      height: 40,
                      fontSize: "0.825rem",
                      padding: "0 12px",
                      width: "100%",
                      borderRadius: 8,
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-surface-elevated, #f8fafc)"
                    }}
                    value={filterSubmissionTime}
                    onChange={(e) => setFilterSubmissionTime(e.target.value)}
                    title="Filter by Submission Time"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(searchSubmissions ||
                  filterStage !== "all" ||
                  filterSubmissionCompany !== "all" ||
                  filterSubmissionJob !== "all" ||
                  filterSubmissionTime !== "all") && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setSearchSubmissions("");
                      setFilterStage("all");
                      setFilterSubmissionCompany("all");
                      setFilterSubmissionJob("all");
                      setFilterSubmissionTime("all");
                    }}
                    style={{
                      fontSize: "0.8rem",
                      color: "#ef4444",
                      height: 40,
                      fontWeight: 700,
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      borderRadius: 8
                    }}
                  >
                    <X size={14} /> Clear
                  </button>
                )}
              </div>

              {/* Subtle Divider */}
              <div style={{ height: 1, background: "var(--border-subtle)", margin: "14px 0" }} />

              {/* Row 2: Stage Pills Bar & Results Summary */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12
                }}
              >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { id: "all", label: `All (${mySubmissions.length})` },
                    { id: "applied", label: `Applied (${mySubmissions.filter((c) => c.stage === "applied").length})` },
                    { id: "interview", label: `Technical Rounds (${mySubmissions.filter((c) => c.stage === "interview").length})` },
                    { id: "offer", label: `Offer (${mySubmissions.filter((c) => c.stage === "offer").length})` },
                    { id: "hired", label: `Hired (${hiredByMe.length})` }
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setFilterStage(st.id)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.785rem",
                        fontWeight: filterStage === st.id ? 700 : 500,
                        background: filterStage === st.id ? "var(--primary)" : "var(--bg-surface-elevated)",
                        color: filterStage === st.id ? "#fff" : "var(--text-secondary)",
                        border: `1px solid ${filterStage === st.id ? "var(--primary)" : "var(--border-subtle)"}`,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxShadow: filterStage === st.id ? "0 2px 8px var(--primary-glow)" : "none"
                      }}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: "0.825rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  Showing <strong style={{ color: "var(--text-primary)" }}>{filteredSubmissions.length}</strong> of {mySubmissions.length} candidates
                </div>
              </div>
            </div>

            {/* Candidate Submissions Table */}
            <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg, 12px)" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Client Employer</th>
                    <th>Target Requisition</th>
                    <th>Education</th>
                    <th>Compensation (Cur / Exp)</th>
                    <th>Notice Period</th>
                    <th>Client ATS Stage</th>
                    <th>Attribution Lock</th>
                    <th>Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div
                          style={{
                            maxWidth: 400,
                            margin: "0 auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 12
                          }}
                        >
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              background: "rgba(79, 70, 229, 0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--primary)"
                            }}
                          >
                            <Users2 size={24} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                              No candidate submissions found
                            </div>
                            <div style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: 4 }}>
                              {searchSubmissions || filterStage !== "all" || filterSubmissionCompany !== "all" || filterSubmissionJob !== "all" || filterSubmissionTime !== "all"
                                ? "No candidates match the selected filters. Try adjusting or clearing filters."
                                : "No candidates have been submitted to client employer mandates yet."}
                            </div>
                          </div>
                          {searchSubmissions || filterStage !== "all" || filterSubmissionCompany !== "all" || filterSubmissionJob !== "all" || filterSubmissionTime !== "all" ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setSearchSubmissions("");
                                setFilterStage("all");
                                setFilterSubmissionCompany("all");
                                setFilterSubmissionJob("all");
                                setFilterSubmissionTime("all");
                              }}
                              style={{ marginTop: 6 }}
                            >
                              Reset Filters
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => setActiveTab("mandates")}
                              style={{ marginTop: 6 }}
                            >
                              Browse Mandates &rarr;
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>{c.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.email} &bull; {c.phone}</div>
                        </td>
                        <td>
                          {(() => {
                            const targetComp = companies.find((comp) => comp.id === c.companyId) || company;
                            return (
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {targetComp.logoUrl ? (
                                  <img
                                    src={targetComp.logoUrl}
                                    alt={targetComp.name}
                                    style={{ width: 18, height: 18, borderRadius: 3, objectFit: "contain", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", padding: 1 }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      width: 18,
                                      height: 18,
                                      borderRadius: 3,
                                      background: targetComp.brandColor || "var(--primary)",
                                      color: "#fff",
                                      fontSize: "0.55rem",
                                      fontWeight: 800,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    {targetComp.logoInitials || "CO"}
                                  </span>
                                )}
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: "0.825rem", color: "var(--text-primary)" }}>
                                    {targetComp.name}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{c.role}</div>
                          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>{c.currentCompany || "Product Firm"}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                            {c.education || "B.Tech CSE"}
                          </div>
                          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                            {c.experience || "5+ yrs"}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{c.expectedCtc}</div>
                          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>Current: {c.currentCtc}</div>
                        </td>
                        <td>
                          <span className="badge badge-active" style={{ fontSize: "0.725rem" }}>
                            {c.noticePeriod}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`stage-pill ${
                              c.stage === "hired"
                                ? "stage-hired"
                                : c.stage === "interview"
                                ? "stage-interview"
                                : c.stage === "offer"
                                ? "stage-offer"
                                : "stage-applied"
                            }`}
                          >
                            {c.stage.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                            <ShieldCheck size={13} />
                            <span>Locked (90 Days)</span>
                          </span>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {c.submittedAt || c.appliedDate || c.date || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COMMISSION WALLET & PAYOUTS */}
        {activeTab === "payouts" && (
          <div>
            {/* Financial Metrics Strip */}
            <div className="kpi-grid" style={{ marginBottom: 20 }}>
              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Total Placement Fees</span>
                  <div className="kpi-icon-wrap" style={{ background: "rgba(5, 150, 105, 0.1)", color: "#059669" }}>
                    <IndianRupee size={18} />
                  </div>
                </div>
                <div className="kpi-value" style={{ color: "#059669" }}>
                  {activeAgency?.totalBountiesEarned || "₹0"}
                </div>
                <div className="kpi-footer">
                  <span style={{ color: "#059669", fontWeight: 700 }}>Approved Bounties</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Placed Candidates</span>
                  <div className="kpi-icon-wrap" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed" }}>
                    <Users2 size={18} />
                  </div>
                </div>
                <div className="kpi-value">{hiredByMe.length} Placements</div>
                <div className="kpi-footer">
                  <span>Joined & Verified</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">TDS Withheld (Sec 194H)</span>
                  <div className="kpi-icon-wrap" style={{ background: "rgba(220, 38, 38, 0.1)", color: "#dc2626" }}>
                    <IndianRupee size={18} />
                  </div>
                </div>
                <div className="kpi-value" style={{ color: "#dc2626" }}>
                  {hiredByMe.length > 0 ? "- 10%" : "₹0"}
                </div>
                <div className="kpi-footer">
                  <span>10% Form 16A Credit</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Net Bank Settlement</span>
                  <div className="kpi-icon-wrap" style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7" }}>
                    <ReceiptText size={18} />
                  </div>
                </div>
                <div className="kpi-value" style={{ color: "#0284c7" }}>
                  {activeAgency?.totalBountiesEarned || "₹0"}
                </div>
                <div className="kpi-footer">
                  <span>Direct Bank Transfer</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <ReceiptText size={18} color="var(--primary)" />
                    <span>Placement Commission Ledger & Invoicing</span>
                  </h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setIsInvoiceModalOpen(true)}>
                    <span>Generate GST Invoice</span>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: "var(--bg-surface-elevated)", padding: "14px 16px", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>Agreed Placement Commission Rate</div>
                      <div style={{ fontWeight: 800, fontSize: "1rem" }}>{activeAgency?.commissionRate || "8.50% [Standard Retainer]"}</div>
                    </div>
                    <span className="badge badge-active">Active Contract</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Total Bounties Claimed to Date:</span>
                    <span style={{ fontWeight: 800, color: "#059669" }}>{activeAgency?.totalBountiesEarned || "₹0"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Pending Payout (Offer In Progress):</span>
                    <span style={{ fontWeight: 800, color: "var(--primary)" }}>
                      {mySubmissions.filter((c) => c.stage === "offer").length > 0
                        ? `${mySubmissions.filter((c) => c.stage === "offer").length} Offer(s) Pending`
                        : "₹0"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>TDS Rate (Section 194H):</span>
                    <span style={{ fontWeight: 600 }}>10% (Automated Form 16A Credit)</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Settlement Bank Account:</span>
                    <span style={{ fontWeight: 600 }}>{activeAgency?.bankDetails || "Bank Account on File"}</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 12px" }}>
                    Agency Attribution Guarantee
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 14px" }}>
                    ExpertHire ensures absolute candidate ownership for certified placement partners. When you submit a candidate profile:
                  </p>

                  <ul style={{ paddingLeft: 18, fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    <li><strong>90-Day Ownership Lock:</strong> No other agency or direct application can claim attribution for 90 days.</li>
                    <li><strong>Automated Bounty Match:</strong> Commission is automatically calculated upon candidate offer acceptance.</li>
                    <li><strong>Transparent Rejection Reasons:</strong> If a candidate is rejected, detailed hiring manager notes are published immediately.</li>
                  </ul>
                </div>

                <div style={{ background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.2)", padding: "12px", borderRadius: "var(--radius-md)", marginTop: 16 }}>
                  <div style={{ fontSize: "0.8rem", color: "#065f46", fontWeight: 700 }}>
                    Certified Partner Tier: Grade A Executive Search
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#047857", marginTop: 2 }}>
                    Average offer-to-join ratio: 94.2% &bull; Net payment terms: Net-15 days.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DUPLICATE / ATTRIBUTION PRE-CHECK TOOL */}
        {activeTab === "duplicate_check" && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 4px" }}>
                  Pre-Submission Duplicate & Attribution Checker
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Verify whether a prospective candidate is already in {company.name}'s talent pool before contacting them or submitting their profile.
                </p>
              </div>

              <form onSubmit={handleCheckDuplicate} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  type="text"
                  required
                  placeholder="Enter candidate email or mobile number..."
                  className="form-input"
                  style={{ flex: 1 }}
                  value={dupQuery}
                  onChange={(e) => {
                    setDupQuery(e.target.value);
                    setDupResult(null);
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "0 20px" }}>
                  Verify Ownership
                </button>
              </form>

              {dupResult && (
                <div>
                  {dupResult.found ? (
                    <div style={{ background: "#fef2f2", border: "1px solid #f87171", borderRadius: "var(--radius-md)", padding: "16px", color: "#991b1b" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, marginBottom: 4 }}>
                        <AlertCircle size={18} />
                        <span>Candidate Already Exists in Pipeline</span>
                      </div>
                      <div style={{ fontSize: "0.825rem", lineHeight: 1.5 }}>
                        <strong>{dupResult.candidateName}</strong> was already submitted for role <strong>{dupResult.role}</strong> via <strong>{dupResult.source}</strong> on {dupResult.date}. Active attribution protection is currently in effect.
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "#ecfdf5", border: "1px solid #10b981", borderRadius: "var(--radius-md)", padding: "16px", color: "#065f46" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, marginBottom: 4 }}>
                        <CheckCircle size={18} />
                        <span>Clear for Sourcing! (Zero Conflicts)</span>
                      </div>
                      <div style={{ fontSize: "0.825rem", lineHeight: 1.5, marginBottom: 12 }}>
                        No records found for this candidate. You can submit this candidate now to lock in 90-day exclusive partner attribution and claim placement bounties.
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setCandidateForm({ ...candidateForm, email: dupQuery });
                          setSelectedJobToSubmit(syndicatedJobs[0]);
                          setIsSubmitModalOpen(true);
                        }}
                      >
                        Submit Candidate Now &rarr;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: AGENCY DETAILS & SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            {settingsSuccessMsg && (
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #10b981",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 18px",
                  color: "#065f46",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.12)"
                }}
              >
                <CheckCircle size={20} color="#10b981" />
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{settingsSuccessMsg}</div>
              </div>
            )}

            <form onSubmit={handleSaveAgencySettings} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Card 1: Logo & Branding */}
              <div
                className="card"
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  padding: 24
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 4px" }}>
                      Agency Visual Branding & Logo
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                      This logo is displayed at the top of your agency workspace and across client ATS candidate submissions.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: 16,
                        background: "#ffffff",
                        padding: 6,
                        border: "1.5px solid var(--border-medium)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                      }}
                    >
                      <img
                        src={agencyForm.logoUrl || "/logo-exhier.png"}
                        alt="Agency Logo"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/logo-exhier.png";
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <label
                        className="btn btn-secondary btn-sm"
                        style={{
                          cursor: isUploadingLogo ? "wait" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6
                        }}
                      >
                        <Camera size={15} />
                        <span>{isUploadingLogo ? "Uploading to Cloud..." : "Upload Agency Logo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={isUploadingLogo}
                          onChange={handleLogoUpload}
                        />
                      </label>

                      {agencyForm.logoUrl && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: "#dc2626" }}
                          onClick={() => setAgencyForm((prev) => ({ ...prev, logoUrl: "" }))}
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                        Or Direct Logo Image URL
                      </label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://example.com/agency-logo.png"
                        value={agencyForm.logoUrl || ""}
                        onChange={(e) => setAgencyForm({ ...agencyForm, logoUrl: e.target.value })}
                        style={{ fontSize: "0.825rem", padding: "7px 10px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Agency Identity & Contact */}
              <div
                className="card"
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  padding: 24
                }}
              >
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 16px" }}>
                  Agency Identity & Authorized Contact Details
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Agency Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Apex Talent Partners"
                      value={agencyForm.name}
                      onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Operating Locations / Cities *
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Mumbai & Bengaluru"
                      value={agencyForm.city}
                      onChange={(e) => setAgencyForm({ ...agencyForm, city: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Authorized Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Ritu Sengupta"
                      value={agencyForm.primaryContact}
                      onChange={(e) => setAgencyForm({ ...agencyForm, primaryContact: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="e.g. partner@apextalent.in"
                      value={agencyForm.email}
                      onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. +91 98450 77123"
                      value={agencyForm.phone}
                      onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Specialization & Practice Areas
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Fintech Infrastructure, Cloud Platforms, AI/ML"
                      value={agencyForm.specialization}
                      onChange={(e) => setAgencyForm({ ...agencyForm, specialization: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Commercials & Credentials */}
              <div
                className="card"
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  padding: 24
                }}
              >
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 16px" }}>
                  Commercial Terms & Portal Credentials
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Commission Rate / Retainer Model
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 8.50% [Standard Retainer]"
                      value={agencyForm.commissionRate}
                      onChange={(e) => setAgencyForm({ ...agencyForm, commissionRate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      GSTIN / Tax Identification Number
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      value={agencyForm.gstin}
                      onChange={(e) => setAgencyForm({ ...agencyForm, gstin: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Agency Portal ID / Code
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                      placeholder="e.g. APEX-TALENT-BLR"
                      value={agencyForm.portalCode}
                      onChange={(e) => setAgencyForm({ ...agencyForm, portalCode: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Portal Access Password
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Password"
                      value={agencyForm.portalPassword}
                      onChange={(e) => setAgencyForm({ ...agencyForm, portalPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  padding: "16px 0"
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
                    padding: "10px 24px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: isSavingSettings ? "wait" : "pointer",
                    opacity: isSavingSettings ? 0.75 : 1
                  }}
                  disabled={isSavingSettings}
                >
                  <Save size={16} />
                  <span>{isSavingSettings ? "Saving Changes..." : "Save Agency Details"}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={logout}
                  style={{
                    color: "#ef4444",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px"
                  }}
                  title="Exit and Sign Out to Workspace Login"
                >
                  <LogOut size={16} />
                  <span>Exit Agency Portal</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>

      {/* 3. Single Candidate Submission Modal */}
      {isSubmitModalOpen && selectedJobToSubmit && (
        <div className="modal-overlay" onClick={() => setIsSubmitModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: 740, borderRadius: "var(--radius-xl)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ padding: "18px 24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
                    Submit Candidate for {selectedJobToSubmit.title}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(124, 58, 237, 0.1)",
                      color: "#7c3aed"
                    }}
                  >
                    {selectedJobToSubmit.agencyBounty || "₹75,000 Bounty"}
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                  {(() => {
                    const targetComp = companies.find((c) => c.id === selectedJobToSubmit.companyId) || company;
                    return (
                      <span>Client: <strong>{targetComp.name}</strong> &bull; {selectedJobToSubmit.department} &bull; Budget: ₹ {selectedJobToSubmit.salary}</span>
                    );
                  })()}
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsSubmitModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {submittedSuccess ? (
              <div style={{ padding: "50px 24px", textAlign: "center" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "#ecfdf5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}
                >
                  <Check size={34} />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6 }}>
                  Profile Submitted with 90-Day Lock!
                </h3>
                {(() => {
                  const targetComp = companies.find((c) => c.id === selectedJobToSubmit.companyId) || company;
                  return (
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto" }}>
                      {candidateForm.name}'s profile has been submitted to <strong>{targetComp.name}</strong>'s hiring team with attribution credited to <strong>{activeAgency?.name}</strong>.
                    </p>
                  );
                })()}
              </div>
            ) : (
              <form onSubmit={handleCandidateSubmit}>
                <div className="modal-body" style={{ padding: "18px 24px", maxHeight: "70vh", overflowY: "auto" }}>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label className="form-label">Candidate Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Vikramaditya Sen"
                        value={candidateForm.name}
                        onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="candidate@gmail.com"
                        value={candidateForm.email}
                        onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Mobile Number (+91) *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="+91 98201 XXXXX"
                        value={candidateForm.phone}
                        onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Company & Title *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Senior SRE at Razorpay"
                        value={candidateForm.currentCompany}
                        onChange={(e) => setCandidateForm({ ...candidateForm, currentCompany: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Experience</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="6.5 years"
                        value={candidateForm.experience}
                        onChange={(e) => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Education and Notice Period */}
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1.5 }}>
                      <label className="form-label">Highest Education & College *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. B.Tech CSE (IIT Delhi) / B.E."
                        value={candidateForm.education}
                        onChange={(e) => setCandidateForm({ ...candidateForm, education: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Notice Period *</label>
                      <select
                        className="form-select"
                        value={candidateForm.noticePeriod}
                        onChange={(e) => setCandidateForm({ ...candidateForm, noticePeriod: e.target.value })}
                      >
                        <option value="Immediate Joiner (Serving / Relieved)">Immediate Joiner (Serving / Relieved)</option>
                        <option value="15 Days Notice">15 Days Notice</option>
                        <option value="30 Days Notice">30 Days Notice</option>
                        <option value="60 Days (Buyout OK)">60 Days (Buyout OK)</option>
                        <option value="90 Days Official">90 Days Official</option>
                      </select>
                    </div>
                  </div>

                  {/* CTC Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Current Fixed CTC (₹ LPA) *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. ₹28 LPA"
                        value={candidateForm.currentCtc}
                        onChange={(e) => setCandidateForm({ ...candidateForm, currentCtc: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Expected CTC (₹ LPA) *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. ₹38 LPA"
                        value={candidateForm.expectedCtc}
                        onChange={(e) => setCandidateForm({ ...candidateForm, expectedCtc: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Agency Recommendation Notes */}
                  <div className="form-group">
                    <label className="form-label">Headhunter / Recruiter Notes</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="Candidate's key strengths, interview availability, and reasons for transition..."
                      value={candidateForm.agencyNotes}
                      onChange={(e) => setCandidateForm({ ...candidateForm, agencyNotes: e.target.value })}
                    />
                  </div>

                  {/* Real Cloudinary Resume Upload */}
                  <div className="form-group">
                    <label className="form-label">Attach Verified Candidate Resume (PDF / DOCX)</label>
                    <label
                      style={{
                        border: candidateForm.resumeUrl ? "1px solid #10b981" : "2px dashed var(--border-medium)",
                        borderRadius: "var(--radius-md)",
                        padding: "16px",
                        textAlign: "center",
                        background: candidateForm.resumeUrl ? "rgba(16, 185, 129, 0.04)" : "var(--bg-surface-elevated)",
                        display: "block",
                        cursor: isUploadingSingleResume ? "not-allowed" : "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {isUploadingSingleResume ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              border: "2px solid rgba(79, 70, 229, 0.3)",
                              borderTopColor: "var(--primary)",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                              display: "inline-block"
                            }}
                          />
                          <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--primary)" }}>
                            Uploading directly to Cloudinary (preset: resumes, cloud: ljelkpy4)...
                          </span>
                        </div>
                      ) : candidateForm.resumeUrl ? (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#059669" }}>
                            <CheckCircle size={16} />
                            <strong style={{ fontSize: "0.85rem" }}>
                              {candidateForm.resumeFileName || "Candidate_Resume.pdf"}
                            </strong>
                          </div>
                          <div style={{ fontSize: "0.725rem", color: "var(--text-secondary)", marginTop: 4 }}>
                            Uploaded to Cloudinary &bull;{" "}
                            <a
                              href={candidateForm.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#2563eb", fontWeight: 600 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Preview Secure Cloud Asset &rarr;
                            </a>
                          </div>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={22} color="var(--primary)" style={{ margin: "0 auto 4px", display: "block" }} />
                          <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            {candidateForm.name ? `${candidateForm.name.replace(/\s/g, "_")}_Resume.pdf` : "Choose Candidate Resume (PDF / DOCX)"}
                          </div>
                          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: 2 }}>
                            Click to browse and upload directly to Cloudinary storage
                          </div>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        disabled={isUploadingSingleResume}
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCandidateForm((prev) => ({
                              ...prev,
                              resumeFileName: file.name,
                              resumeFileSize: `${(file.size / 1024).toFixed(0)} KB`
                            }));
                            setIsUploadingSingleResume(true);
                            try {
                              const res = await uploadResumeFile(file);
                              if (res?.success && res?.url) {
                                setCandidateForm((prev) => ({
                                  ...prev,
                                  resumeUrl: res.url,
                                  resumeFileName: file.name
                                }));
                              }
                            } catch (err) {
                              console.warn("Cloudinary upload failed:", err);
                            } finally {
                              setIsUploadingSingleResume(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="modal-footer" style={{ padding: "14px 24px" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: "10px 22px" }}>
                    Submit Candidate & Lock Attribution &rarr;
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Job Spec Sourcing Drawer */}
      {specJob && (
        <div className="career-drawer-overlay" onClick={() => setSpecJob(null)}>
          <div className="career-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "0.725rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase" }}>
                  {specJob.agencyBounty} &bull; {specJob.agencyCommissionPercent}
                </span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "4px 0 6px" }}>{specJob.title}</h2>
                <div style={{ display: "flex", gap: 10, fontSize: "0.825rem", color: "var(--text-secondary)", flexWrap: "wrap", alignItems: "center" }}>
                  <span>{specJob.location}</span>
                  <span>&bull;</span>
                  <span>{specJob.experienceLevel || specJob.experience || "3-6 yrs"}</span>
                  <span>&bull;</span>
                  <span style={{ color: "var(--primary)", fontWeight: 700 }}>Budget: ₹ {specJob.salary}</span>
                  <span>&bull;</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--text-primary)", fontWeight: 600 }}>
                    <GraduationCap size={13} color="var(--primary)" />
                    {specJob.education || "B.Tech / B.E. or Equivalent"}
                  </span>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSpecJob(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: 6 }}>Sourcing Guidance & Notes</h4>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  {specJob.description}
                </p>
              </div>

              {specJob.requirements?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: 6 }}>Ideal Candidate Criteria</h4>
                  <ul style={{ paddingLeft: 18, fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {specJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {specJob.screeningQuestions?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: 6 }}>Mandatory Client Screening Questions</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                    {specJob.screeningQuestions.map((q, i) => (
                      <div key={i} style={{ background: "var(--bg-surface-elevated)", padding: "8px 12px", borderRadius: "var(--radius-sm)" }}>
                        <strong>Q{i + 1}:</strong> {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onClick={() => {
                  setSpecJob(null);
                  handleOpenSubmit(specJob);
                }}
              >
                <UserPlus size={15} />
                <span>Submit Candidate for this Role</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Simulated GST Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="modal-overlay" onClick={() => setIsInvoiceModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 640, borderRadius: "var(--radius-xl)" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: "18px 24px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>
                Simulated GST Tax Invoice (Section 194H)
              </h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsInvoiceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: "20px 24px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem" }}>{activeAgency?.name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>GSTIN: 29AABCS1429P1ZX &bull; {activeAgency?.city}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>Invoice #INV-2026-0891</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Date: {new Date().toISOString().split("T")[0]}</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Billed To Client:</span>
                <div style={{ fontWeight: 700 }}>{company.name} Private Limited</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{company.headquarters}</div>
              </div>

              <table className="bulk-table" style={{ marginBottom: 16 }}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Candidate</th>
                    <th>Commission</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Senior Engineering Placement</td>
                    <td>Rohan Deshmukh</td>
                    <td>8.33% of ₹28L</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>₹ 2,33,240</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--border-subtle)", paddingTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Gross Commission:</span>
                  <span style={{ fontWeight: 700 }}>₹ 2,33,240</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#dc2626" }}>
                  <span>Less TDS @ 10% (Sec 194H):</span>
                  <span>- ₹ 23,324</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>CGST (9%) + SGST (9%):</span>
                  <span>+ ₹ 41,983</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1rem", color: "#059669", borderTop: "1px solid var(--border-medium)", paddingTop: 8 }}>
                  <span>Net Payable Amount:</span>
                  <span>₹ 2,51,899</span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "14px 24px" }}>
              <button className="btn btn-secondary" onClick={() => setIsInvoiceModalOpen(false)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert("Invoice successfully submitted to Client Finance & Accounts payable!");
                  setIsInvoiceModalOpen(false);
                }}
              >
                Submit Invoice to Finance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
