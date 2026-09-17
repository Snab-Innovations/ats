import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_COMPANY,
  INITIAL_COMPANIES,
  INITIAL_COMPANY_USERS,
  COVER_PRESETS,
  INITIAL_JOBS,
  INITIAL_AGENCIES,
  INITIAL_CANDIDATES,
  INITIAL_INTERVIEWS,
  INITIAL_CAREER_SETTINGS
} from "../data/mockData";

const AtsContext = createContext();

const STORAGE_KEYS = {
  JOBS: "experthire_in_jobs_v2",
  CANDIDATES: "experthire_in_candidates_v2",
  AGENCIES: "experthire_in_agencies_v2",
  INTERVIEWS: "experthire_in_interviews_v2",
  CAREER_SETTINGS: "experthire_in_career_settings_v2",
  COMPANIES: "experthire_in_companies_v2",
  COMPANY_USERS: "experthire_in_company_users_v2",
  ACTIVE_COMPANY_ID: "experthire_in_active_company_id_v2",
  THEME: "experthire_in_theme_v2"
};

const getStored = (key, legacySuffix) => {
  return localStorage.getItem(key) || localStorage.getItem(`talentorbit_in_${legacySuffix}_v2`);
};

export const AtsProvider = ({ children }) => {
  // Theme state: Default to 'light' (Day Mode as requested)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.THEME, "theme");
      return saved || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Navigation & Role states
  const [activeRole, setActiveRole] = useState("company_admin"); // 'super_admin' | 'company_admin' | 'agency_portal' | 'public_careers' | 'iframe_simulator'
  const [adminTab, setAdminTab] = useState("dashboard");
  const [selectedAgencyId, setSelectedAgencyId] = useState("agy-1"); // Naukri Elite
  
  // Modals & Selection state
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Multi-Tenant Companies state
  const [companies, setCompanies] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.COMPANIES, "companies");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Guarantee vector logoUrl exists if previously saved as empty string
        return parsed.map((c) => {
          const fallback = INITIAL_COMPANIES.find((init) => init.id === c.id);
          return {
            ...c,
            logoUrl: c.logoUrl || (fallback ? fallback.logoUrl : INITIAL_COMPANY.logoUrl)
          };
        });
      }
      return INITIAL_COMPANIES;
    } catch {
      return INITIAL_COMPANIES;
    }
  });

  const [activeCompanyId, setActiveCompanyId] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.ACTIVE_COMPANY_ID, "active_company_id");
      return saved || INITIAL_COMPANIES[0].id;
    } catch {
      return INITIAL_COMPANIES[0].id;
    }
  });

  // Multiple team users per company
  const [companyUsers, setCompanyUsers] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.COMPANY_USERS, "company_users");
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_USERS;
    } catch {
      return INITIAL_COMPANY_USERS;
    }
  });

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || companies[0] || INITIAL_COMPANY;
  
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.JOBS, "jobs");
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasCompanyId = parsed.some((j) => j.companyId === "comp-zepto-102");
        if (!hasCompanyId) {
          return INITIAL_JOBS;
        }
        return parsed;
      }
      return INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.CANDIDATES, "candidates");
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [agencies, setAgencies] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.AGENCIES, "agencies");
      return saved ? JSON.parse(saved) : INITIAL_AGENCIES;
    } catch {
      return INITIAL_AGENCIES;
    }
  });

  const [interviews, setInterviews] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.INTERVIEWS, "interviews");
      return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
    } catch {
      return INITIAL_INTERVIEWS;
    }
  });

  const [careerSettings, setCareerSettings] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.CAREER_SETTINGS, "career_settings");
      return saved ? JSON.parse(saved) : INITIAL_CAREER_SETTINGS;
    } catch {
      return INITIAL_CAREER_SETTINGS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY_ID, activeCompanyId);
  }, [activeCompanyId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_USERS, JSON.stringify(companyUsers));
  }, [companyUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGENCIES, JSON.stringify(agencies));
  }, [agencies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAREER_SETTINGS, JSON.stringify(careerSettings));
  }, [careerSettings]);

  // Actions
  const changeStage = (candidateId, newStage) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              stage: newStage,
              notes: [
                {
                  author: "Hiring Team",
                  text: `Candidate moved to stage: ${newStage.toUpperCase()}`,
                  date: new Date().toISOString().split("T")[0],
                },
                ...(c.notes || []),
              ],
            }
          : c
      )
    );
  };

  const addCandidate = (candidateData) => {
    const newCand = {
      id: `cand-${Date.now()}`,
      submittedAt: new Date().toISOString().split("T")[0],
      stage: "applied",
      matchScore: Math.floor(Math.random() * 12) + 88,
      rating: 4,
      scorecard: {
        technicalSkills: 4,
        systemDesign: 4,
        cultureAlignment: 5,
        communication: 4,
        recommendation: "Review Needed",
      },
      currentCtc: candidateData.currentCtc || "₹22 LPA",
      expectedCtc: candidateData.expectedCtc || "₹32 LPA",
      noticePeriod: candidateData.noticePeriod || "30 Days Notice",
      education: candidateData.education || "B.Tech Computer Science",
      notes: [
        {
          author: candidateData.sourceType === "agency" ? `${candidateData.source} (Partner)` : "Career Portal",
          text: candidateData.sourceType === "agency"
            ? `Candidate profile submitted by Indian recruitment partner ${candidateData.source}. Placement bounty tracked.`
            : "Direct online application received via company career portal.",
          date: new Date().toISOString().split("T")[0],
        },
      ],
      ...candidateData,
    };

    setCandidates((prev) => [newCand, ...prev]);

    // Update job application count
    if (candidateData.jobId) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === candidateData.jobId
            ? { ...j, applicationsCount: (j.applicationsCount || 0) + 1 }
            : j
        )
      );
    }

    // Update agency counter if submitted by agency
    if (candidateData.sourceType === "agency") {
      setAgencies((prev) =>
        prev.map((a) =>
          a.name === candidateData.source
            ? { ...a, candidatesSubmitted: (a.candidatesSubmitted || 0) + 1 }
            : a
        )
      );
    }

    return newCand;
  };

  const addBulkCandidates = (candidateList) => {
    if (!candidateList || candidateList.length === 0) return [];
    const timestamp = Date.now();
    const createdCandidates = candidateList.map((c, idx) => ({
      id: `cand-${timestamp}-${idx}`,
      submittedAt: new Date().toISOString().split("T")[0],
      stage: "applied",
      matchScore: Math.floor(Math.random() * 12) + 88,
      rating: 4,
      scorecard: {
        technicalSkills: 4,
        systemDesign: 4,
        cultureAlignment: 5,
        communication: 4,
        recommendation: "Review Needed",
      },
      currentCtc: c.currentCtc || "₹22 LPA",
      expectedCtc: c.expectedCtc || "₹32 LPA",
      noticePeriod: c.noticePeriod || "30 Days Notice",
      education: c.education || "B.Tech Computer Science",
      notes: [
        {
          author: c.sourceType === "agency" ? `${c.source} (Partner)` : "Career Portal",
          text: c.sourceType === "agency"
            ? `Bulk candidate batch submission by recruitment partner ${c.source}. Attribution locked.`
            : "Direct bulk application received.",
          date: new Date().toISOString().split("T")[0],
        },
      ],
      ...c,
    }));

    setCandidates((prev) => [...createdCandidates, ...prev]);

    // Update job application counts
    const jobCounts = {};
    candidateList.forEach((c) => {
      if (c.jobId) {
        jobCounts[c.jobId] = (jobCounts[c.jobId] || 0) + 1;
      }
    });

    setJobs((prev) =>
      prev.map((j) =>
        jobCounts[j.id]
          ? { ...j, applicationsCount: (j.applicationsCount || 0) + jobCounts[j.id] }
          : j
      )
    );

    // Update agency counter if agency
    const agencyCounts = {};
    candidateList.forEach((c) => {
      if (c.sourceType === "agency" && c.source) {
        agencyCounts[c.source] = (agencyCounts[c.source] || 0) + 1;
      }
    });

    setAgencies((prev) =>
      prev.map((a) =>
        agencyCounts[a.name]
          ? { ...a, candidatesSubmitted: (a.candidatesSubmitted || 0) + agencyCounts[a.name] }
          : a
      )
    );

    return createdCandidates;
  };

  const addCandidateNote = (candidateId, text, author = "Hiring Lead") => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              notes: [
                { author, text, date: new Date().toISOString().split("T")[0] },
                ...(c.notes || []),
              ],
            }
          : c
      )
    );
  };

  const addJob = (newJobData) => {
    const newJob = {
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split("T")[0],
      viewsCount: 1,
      applicationsCount: 0,
      status: "active",
      requirements: newJobData.requirements || [],
      benefits: newJobData.benefits || [],
      screeningQuestions: newJobData.screeningQuestions || [],
      ...newJobData,
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJob = (jobId, updatedData) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...updatedData } : j))
    );
  };

  const toggleJobStatus = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const newStatus = j.status === "active" ? "inactive" : "active";
          return { ...j, status: newStatus };
        }
        return j;
      })
    );
  };

  const toggleJobSyndication = (jobId, syndicate, bounty = "₹60,000 Cash Bounty") => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              syndicateToAgencies: syndicate,
              agencyBounty: bounty,
              ...(syndicate && j.status !== "active" ? { status: "active" } : {})
            }
          : j
      )
    );
  };

  const scheduleInterview = (candidateId, interviewData) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const newInterview = {
      id: `int-${Date.now()}`,
      candidateId,
      candidateName: candidate.name,
      role: candidate.role,
      status: "Confirmed",
      source: candidate.source,
      ...interviewData,
    };

    setInterviews((prev) => [newInterview, ...prev]);

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              stage: "interview",
              interviewScheduled: interviewData,
              notes: [
                {
                  author: "Interview Coordinator",
                  text: `Scheduled ${interviewData.round} on ${interviewData.date} at ${interviewData.time} with ${interviewData.interviewer}.`,
                  date: new Date().toISOString().split("T")[0],
                },
                ...(c.notes || []),
              ],
            }
          : c
      )
    );
  };

  const addAgency = (agencyData) => {
    const newAgency = {
      id: `agy-${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0],
      activeJobsAssigned: jobs.filter((j) => j.syndicateToAgencies).length,
      candidatesSubmitted: 0,
      placementsHired: 0,
      totalBountiesEarned: "₹0",
      status: "active",
      rating: 5.0,
      ...agencyData,
    };
    setAgencies((prev) => [...prev, newAgency]);
  };

  const updateCareerSettings = (newSettings) => {
    setCareerSettings((prev) => ({
      ...prev,
      ...newSettings,
      iframeConfig: {
        ...prev.iframeConfig,
        ...(newSettings.iframeConfig || {}),
      },
    }));
  };

  const switchCompany = (companyId) => {
    setActiveCompanyId(companyId);
    const targetComp = companies.find((c) => c.id === companyId);
    if (targetComp) {
      setCareerSettings((prev) => ({
        ...prev,
        companyName: targetComp.name,
        tagline: targetComp.tagline,
        brandColor: targetComp.brandColor || "#4f46e5",
        accentColor: targetComp.accentColor || "#0284c7"
      }));
    }
  };

  const addCompanyTenant = (newTenant) => {
    const initials = newTenant.name
      ? newTenant.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "CO";
    const created = {
      id: `comp-${Date.now().toString(36)}`,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      employeeCount: "50-250 Builders",
      logoInitials: initials,
      logoBadgeColor: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
      coverImage: COVER_PRESETS[0].url,
      brandColor: "#4f46e5",
      accentColor: "#0284c7",
      plan: "Enterprise Scale Tier",
      ...newTenant,
    };
    setCompanies((prev) => [created, ...prev]);

    // Create primary admin user if email given
    if (created.primaryAdmin) {
      const adminUser = {
        id: `usr-${Date.now().toString(36)}`,
        companyId: created.id,
        name: created.primaryAdminName || "Primary Administrator",
        email: created.primaryAdmin,
        role: "Company Admin",
        title: "Head of Talent / VP",
        department: "Talent Acquisition",
        status: "Active",
        lastLogin: "Just Created",
        phone: "+91 98000 00000",
      };
      setCompanyUsers((prev) => [adminUser, ...prev]);
    }

    return created;
  };

  const updateCompanyBranding = (companyId, brandingData) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, ...brandingData } : c))
    );
    if (companyId === activeCompanyId) {
      setCareerSettings((prev) => ({
        ...prev,
        companyName: brandingData.name || prev.companyName,
        tagline: brandingData.tagline || prev.tagline,
        brandColor: brandingData.brandColor || prev.brandColor,
        accentColor: brandingData.accentColor || prev.accentColor,
      }));
    }
  };

  const addCompanyUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now().toString(36)}`,
      companyId: userData.companyId || activeCompanyId,
      status: "Active",
      lastLogin: "Invited Recently",
      ...userData,
    };
    setCompanyUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateCompanyUser = (userId, updatedData) => {
    setCompanyUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
    );
  };

  const removeCompanyUser = (userId) => {
    setCompanyUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setJobs(INITIAL_JOBS);
    setCandidates(INITIAL_CANDIDATES);
    setAgencies(INITIAL_AGENCIES);
    setInterviews(INITIAL_INTERVIEWS);
    setCareerSettings(INITIAL_CAREER_SETTINGS);
    setCompanies(INITIAL_COMPANIES);
    setCompanyUsers(INITIAL_COMPANY_USERS);
    setActiveCompanyId(INITIAL_COMPANIES[0].id);
  };

  const activeAgency = agencies.find((a) => a.id === selectedAgencyId) || agencies[0];

  return (
    <AtsContext.Provider
      value={{
        theme,
        toggleTheme,
        company: activeCompany,
        activeCompany,
        companies,
        activeCompanyId,
        switchCompany,
        addCompanyTenant,
        updateCompanyBranding,
        companyUsers,
        addCompanyUser,
        updateCompanyUser,
        removeCompanyUser,
        coverPresets: COVER_PRESETS,
        jobs,
        candidates,
        agencies,
        interviews,
        careerSettings,
        activeRole,
        setActiveRole,
        adminTab,
        setAdminTab,
        selectedAgencyId,
        setSelectedAgencyId,
        activeAgency,
        selectedCandidateId,
        setSelectedCandidateId,
        isJobModalOpen,
        setIsJobModalOpen,
        editingJob,
        setEditingJob,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        schedulingCandidate,
        setSchedulingCandidate,
        isApplyModalOpen,
        setIsApplyModalOpen,
        selectedJobForApply,
        setSelectedJobForApply,
        changeStage,
        addCandidate,
        addBulkCandidates,
        addCandidateNote,
        addJob,
        updateJob,
        toggleJobStatus,
        toggleJobSyndication,
        scheduleInterview,
        addAgency,
        updateCareerSettings,
        resetToDefaults,
      }}
    >
      {children}
    </AtsContext.Provider>
  );
};

export const useAts = () => {
  const context = useContext(AtsContext);
  if (!context) {
    throw new Error("useAts must be used within an AtsProvider");
  }
  return context;
};
