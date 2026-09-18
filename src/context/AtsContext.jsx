import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  getSupabase,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection
} from "../services/supabaseClient";
import {
  fetchAllFromSupabase,
  saveCompanyToDb,
  deleteCompanyFromDb,
  saveJobToDb,
  deleteJobFromDb,
  saveCandidateToDb,
  updateCandidateStageInDb,
  saveAgencyToDb,
  uploadResumeToStorage,
  uploadImageToCloudinary
} from "../services/dbService";

export const getAdminEnvCredentials = () => {
  const id = (import.meta.env?.VITE_ADMIN_ID || "admin").trim();
  const email = (import.meta.env?.VITE_ADMIN_EMAIL || "admin@gmail.com").trim();
  const password = (import.meta.env?.VITE_ADMIN_PASSWORD || "admin").trim();
  const name = (import.meta.env?.VITE_ADMIN_NAME || "Platform Administrator").trim();
  return { id, email, password, name };
};

const adminEnv = getAdminEnvCredentials();

export const DEFAULT_USERS = [
  {
    id: adminEnv.id || "usr-super-1",
    name: adminEnv.name,
    email: adminEnv.email,
    role: "super_admin",
    roleLabel: "Platform Super Administrator",
    title: "Chief Executive & Platform Admin",
    portalRoute: "/super-admin",
    password: adminEnv.password,
    badgeColor: "#6366f1",
    avatarBg: "linear-gradient(135deg, #6366f1, #a855f7)",
    description: "Multi-tenant engine, tenant provisioning & agency management"
  },
  {
    id: "usr-snab-1",
    companyId: "comp-mu5rn6mu",
    name: "SNAB Admin",
    email: "snab@gmail.com",
    role: "company_admin",
    roleLabel: "Company Admin",
    title: "Engineering Leadership",
    companyName: "SNAB",
    portalRoute: "/employer-dashboard",
    password: "snab",
    badgeColor: "#4f46e5",
    avatarBg: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    description: "Enterprise ATS hiring pipeline, requisitions, and candidate evaluation"
  }
];

const AtsContext = createContext();

const STORAGE_KEYS = {
  JOBS: "experthire_in_jobs_v2",
  CANDIDATES: "experthire_in_candidates_v2",
  AGENCIES: "experthire_in_agencies_v2",
  AGENCY_LOGOS: "experthire_in_agency_logos_v2",
  INTERVIEWS: "experthire_in_interviews_v2",
  CAREER_SETTINGS: "experthire_in_career_settings_v2",
  COMPANIES: "experthire_in_companies_v2",
  COMPANY_USERS: "experthire_in_company_users_v2",
  ACTIVE_COMPANY_ID: "experthire_in_active_company_id_v2",
  SESSION_USER: "experthire_in_session_user_v2",
  THEME: "experthire_in_theme_v2"
};

const getStored = (key, legacySuffix) => {
  return localStorage.getItem(key) || localStorage.getItem(`talentorbit_in_${legacySuffix}_v2`);
};

export const getStoredAgencyLogos = () => {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEYS.AGENCY_LOGOS) ||
      localStorage.getItem("experthire_agency_logos") ||
      localStorage.getItem("agency_logos");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const persistAgencyLogo = (agencyId, logoUrl) => {
  if (!agencyId) return;
  try {
    const current = getStoredAgencyLogos();
    if (logoUrl) {
      current[agencyId] = logoUrl;
    } else {
      delete current[agencyId];
    }
    const serialized = JSON.stringify(current);
    localStorage.setItem(STORAGE_KEYS.AGENCY_LOGOS, serialized);
    localStorage.setItem("experthire_agency_logos", serialized);
  } catch (err) {
    console.warn("Failed to persist agency logo:", err);
  }
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

  // URL Routing & Role Sync
  const location = useLocation();
  const navigate = useNavigate();

  const ROLE_MAP = {
    "/super-admin": "super_admin",
    "/superadmin": "super_admin",
    "/admin": "super_admin",
    "/employer-dashboard": "company_admin",
    "/employer-ats": "company_admin",
    "/ats": "company_admin",
    "/agency-portal": "agency_portal",
    "/agency": "agency_portal",
    "/agency-dashboard": "agency_portal",
    "/career-site": "experthire_platform",
    "/careers": "experthire_platform",
    "/career-page": "experthire_platform",
    "/experthire-platform": "experthire_platform",
    "/experthire": "experthire_platform",
    "/jobs": "experthire_platform",
    "/iframe-simulator": "iframe_simulator",
    "/iframe": "iframe_simulator",
    "/embed": "iframe_simulator"
  };

  const ROLE_TO_PATH = {
    super_admin: "/super-admin",
    company_admin: "/employer-dashboard",
    agency_portal: "/agency-portal",
    public_careers: "/career-site",
    experthire_platform: "/career-site",
    iframe_simulator: "/iframe-simulator"
  };

  const getRoleFromPath = (path) => {
    if (
      path === "/career-site" ||
      path === "/careers" ||
      path === "/career-page" ||
      path === "/jobs" ||
      path === "/experthire-platform" ||
      path === "/experthire"
    ) {
      return "experthire_platform";
    }
    if (
      path.endsWith("-careers") ||
      path.includes("/careers/") ||
      path.startsWith("/career-site/")
    ) {
      return "public_careers";
    }
    for (const [prefix, role] of Object.entries(ROLE_MAP)) {
      if (path === prefix || path.startsWith(prefix + "/")) {
        return role;
      }
    }
    return "company_admin";
  };

  const getTabFromPath = (path) => {
    const parts = path.split("/").filter(Boolean);
    if ((parts[0] === "employer-dashboard" || parts[0] === "ats" || parts[0] === "employer-ats") && parts[1]) {
      return parts[1] === "career-builder" ? "career_builder" : parts[1];
    }
    return "dashboard";
  };

  const [activeRole, setActiveRoleState] = useState(() => getRoleFromPath(window.location.pathname));
  const [adminTab, setAdminTabState] = useState(() => getTabFromPath(window.location.pathname));

  // Keep state in sync with URL
  useEffect(() => {
    const roleFromUrl = getRoleFromPath(location.pathname);
    if (roleFromUrl && roleFromUrl !== activeRole) {
      setActiveRoleState(roleFromUrl);
    }
    const tabFromUrl = getTabFromPath(location.pathname);
    if (tabFromUrl && tabFromUrl !== adminTab) {
      setAdminTabState(tabFromUrl);
    }
  }, [location.pathname]);

  const setActiveRole = useCallback((role) => {
    setActiveRoleState(role);
    const targetPath = ROLE_TO_PATH[role] || "/employer-dashboard";
    if (location.pathname !== targetPath && !location.pathname.startsWith(targetPath + "/")) {
      navigate(targetPath);
    }
  }, [navigate, location.pathname]);

  const setAdminTab = useCallback((tab) => {
    setAdminTabState(tab);
    const slug = tab === "career_builder" ? "career-builder" : tab === "dashboard" ? "" : tab;
    const targetPath = slug ? `/employer-dashboard/${slug}` : "/employer-dashboard";
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [navigate, location.pathname]);

  const [selectedAgencyId, setSelectedAgencyId] = useState(() => {
    try {
      const savedUser = getStored(STORAGE_KEYS.SESSION_USER, "session_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u?.agencyId) return u.agencyId;
      }
      return localStorage.getItem("experthire_in_selected_agency_id_v2") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (selectedAgencyId) {
      try {
        localStorage.setItem("experthire_in_selected_agency_id_v2", selectedAgencyId);
      } catch {}
    }
  }, [selectedAgencyId]);
  
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
          const cover = c.coverBannerUrl || c.coverImage || (fallback ? (fallback.coverBannerUrl || fallback.coverImage) : INITIAL_COMPANY.coverBannerUrl);
          return {
            ...c,
            logoUrl: c.logoUrl || (fallback ? fallback.logoUrl : INITIAL_COMPANY.logoUrl),
            coverBannerUrl: cover,
            coverImage: cover
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (u) =>
              !u.id?.startsWith("usr-10") &&
              !u.id?.startsWith("usr-20") &&
              !u.id?.startsWith("usr-30") &&
              !["usr-101", "usr-102", "usr-103", "usr-104", "usr-105", "usr-201", "usr-202", "usr-301", "usr-302"].includes(u.id) &&
              !u.email?.includes("@bharatscale.in") &&
              !u.email?.includes("@zeptolabs.in") &&
              !u.email?.includes("@razorinfra.com")
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || companies[0] || INITIAL_COMPANY;
  
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.JOBS, "jobs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean out any stale prototype jobs
          return parsed.filter(
            (j) =>
              !j.id?.startsWith("job-zepto-") &&
              !j.id?.startsWith("job-razor-") &&
              !["job-1", "job-2", "job-3", "job-4", "job-5"].includes(j.id)
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.CANDIDATES, "candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean out any stale mock candidates
          return parsed.filter(
            (c) =>
              !c.id?.startsWith("cand-1") &&
              !c.id?.startsWith("cand-2") &&
              !c.id?.startsWith("cand-3") &&
              !c.id?.startsWith("cand-4") &&
              !c.id?.startsWith("cand-5") &&
              !c.id?.startsWith("cand-6") &&
              !c.id?.startsWith("cand-7") &&
              !c.id?.startsWith("cand-8") &&
              !c.id?.startsWith("cand-9")
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [agencies, setAgencies] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.AGENCIES, "agencies");
      const savedLogos = getStoredAgencyLogos();
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(
              (a) =>
                !["agy-1", "agy-2", "agy-3"].includes(a.id) &&
                !["NAUKRI-ELITE-BLR", "ABC-INDIA-MUM", "SUTRA-TECH-PUN"].includes(a.portalCode) &&
                !["Naukri Elite Talent Partners", "ABC Consultants Tech Practice", "SutraHR Executive Search"].includes(a.name)
            )
            .map((a) => {
              const logo = savedLogos[a.id] || a.logoUrl || a.logo || "";
              return {
                ...a,
                logoUrl: logo,
                logo: logo
              };
            });
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [interviews, setInterviews] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.INTERVIEWS, "interviews");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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

  // =========================================================================
  // ENTERPRISE UNIFIED AUTHENTICATION & SESSION LAYER
  // =========================================================================
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = getStored(STORAGE_KEYS.SESSION_USER, "session_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    (email, password) => {
      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanPass = (password || "").trim();

      if (!cleanEmail) {
        return {
          success: false,
          message: "Please enter your corporate email or portal ID."
        };
      }

      // Password validator helper
      const isPasswordValid = (expectedPassword, standardFallbacks = []) => {
        if (!cleanPass) return false;
        if (expectedPassword && cleanPass === expectedPassword) return true;
        // Permissive fallback passwords for development and initial setups
        const fallbacks = [
          "admin",
          "admin123",
          "password",
          "Company#2026!",
          "Agency#2026!",
          "Agency#2026Pass!",
          "User#2026!",
          "bharat123",
          "razor123",
          "zepto123",
          "agency123",
          ...standardFallbacks
        ];
        return fallbacks.includes(cleanPass);
      };

      let targetUser = null;

      // 1. Dynamic Super Admin Verification from .env & built-in master credentials
      const currentAdminEnv = getAdminEnvCredentials();
      const adminIdClean = (currentAdminEnv.id || "admin").trim().toLowerCase();
      const adminEmailClean = (currentAdminEnv.email || "admin@gmail.com").trim().toLowerCase();
      const configuredAdminPass = (currentAdminEnv.password || "admin").trim();

      const isSuperAdminEmail =
        cleanEmail === adminIdClean ||
        cleanEmail === adminEmailClean ||
        cleanEmail === "admin" ||
        cleanEmail === "superadmin" ||
        cleanEmail === "admin@experthire.com" ||
        cleanEmail === "admin@ats.com" ||
        cleanEmail === "admin@gmail.com" ||
        cleanEmail === "usr-super-1";

      if (isSuperAdminEmail) {
        // Must match either the configured .env password, or 'admin' / 'admin123'
        const isSuperAdminPassValid =
          (configuredAdminPass && cleanPass === configuredAdminPass) ||
          cleanPass === "admin" ||
          cleanPass === "admin123";

        if (isSuperAdminPassValid) {
          targetUser = {
            id: currentAdminEnv.id || "usr-super-1",
            name: currentAdminEnv.name || "Platform Administrator",
            email: currentAdminEnv.email || "admin@gmail.com",
            role: "super_admin",
            roleLabel: "Platform Super Administrator",
            title: "Chief Executive & Platform Admin",
            portalRoute: "/super-admin",
            password: configuredAdminPass,
            badgeColor: "#6366f1",
            avatarBg: "linear-gradient(135deg, #6366f1, #a855f7)",
            description: "Multi-tenant engine, tenant provisioning & agency management"
          };
        } else {
          return {
            success: false,
            message: "Invalid corporate email or password. Please check your credentials."
          };
        }
      }

      // 2. Dynamic Agency Partner Check (By email, portalCode, or agency ID)
      if (!targetUser) {
        const matchedAgency = agencies.find(
          (a) =>
            (a.email && a.email.toLowerCase() === cleanEmail) ||
            (a.portalCode && a.portalCode.toLowerCase() === cleanEmail) ||
            (a.id && a.id.toLowerCase() === cleanEmail)
        );

        if (matchedAgency) {
          const expectedAgencyPass = matchedAgency.portalPassword || "Agency#2026!";
          if (isPasswordValid(expectedAgencyPass, ["agency123", "Agency#2026Pass!", "Agency#2026!"])) {
            targetUser = {
              id: matchedAgency.id,
              agencyId: matchedAgency.id,
              name: matchedAgency.primaryContact || matchedAgency.name,
              email: matchedAgency.email,
              role: "agency_portal",
              roleLabel: "Recruitment Agency Partner",
              title: "Authorized Partner",
              agencyName: matchedAgency.name,
              portalRoute: "/agency-portal",
              badgeColor: "#7c3aed",
              password: expectedAgencyPass
            };
          } else {
            return {
              success: false,
              message: "Invalid corporate email or password. Please check your credentials."
            };
          }
        }
      }

      // 3. Dynamic Company Workspace Check (By primaryAdmin, domain, company ID, or name)
      if (!targetUser) {
        const matchedCompany = companies.find(
          (c) =>
            (c.primaryAdmin && c.primaryAdmin.toLowerCase() === cleanEmail) ||
            (c.domain && c.domain.toLowerCase() === cleanEmail) ||
            (c.id && c.id.toLowerCase() === cleanEmail) ||
            (c.name && c.name.toLowerCase() === cleanEmail)
        );

        if (matchedCompany) {
          const expectedCompPass = matchedCompany.adminPassword || "Company#2026!";
          if (isPasswordValid(expectedCompPass, ["bharat123", "razor123", "zepto123", "BharatScale@2026!"])) {
            targetUser = {
              id: `usr-${matchedCompany.id}`,
              companyId: matchedCompany.id,
              name: matchedCompany.primaryAdminName || `${matchedCompany.name} Admin`,
              email: matchedCompany.primaryAdmin || `${matchedCompany.domain || "admin"}@experthire.com`,
              role: "company_admin",
              roleLabel: "Company Admin",
              title: "Workspace Administrator",
              companyName: matchedCompany.name,
              portalRoute: "/employer-dashboard",
              badgeColor: matchedCompany.brandColor || "#4f46e5",
              password: expectedCompPass
            };
          } else {
            return {
              success: false,
              message: "Invalid corporate email or password. Please check your credentials."
            };
          }
        }
      }

      // 4. Dynamic Company Team Member Check (In companyUsers by email or ID)
      if (!targetUser) {
        const matchedCompUser = companyUsers.find(
          (cu) =>
            (cu.email && cu.email.toLowerCase() === cleanEmail) ||
            (cu.id && cu.id.toLowerCase() === cleanEmail)
        );

        if (matchedCompUser) {
          const comp = companies.find((c) => c.id === matchedCompUser.companyId) || companies[0];
          const expectedUserPass = matchedCompUser.password || comp?.adminPassword || "Company#2026!";
          if (isPasswordValid(expectedUserPass, ["User#2026!", "bharat123", "razor123", "zepto123"])) {
            targetUser = {
              id: matchedCompUser.id,
              name: matchedCompUser.name,
              email: matchedCompUser.email,
              role: "company_admin",
              roleLabel: matchedCompUser.role || "Company Admin",
              title: matchedCompUser.title || "Talent Partner",
              companyId: matchedCompUser.companyId,
              companyName: comp?.name || "Corporate Workspace",
              portalRoute: "/employer-dashboard",
              badgeColor: comp?.brandColor || "#4f46e5",
              password: expectedUserPass
            };
          } else {
            return {
              success: false,
              message: "Invalid corporate email or password. Please check your credentials."
            };
          }
        }
      }

      // 5. Fallback Check Against DEFAULT_USERS for backwards compatibility
      if (!targetUser) {
        const fallbackUser = DEFAULT_USERS.find(
          (u) =>
            (u.email && u.email.toLowerCase() === cleanEmail) ||
            (u.id && u.id.toLowerCase() === cleanEmail)
        );

        if (fallbackUser) {
          if (isPasswordValid(fallbackUser.password)) {
            targetUser = fallbackUser;
          } else {
            return {
              success: false,
              message: "Invalid corporate email or password. Please check your credentials."
            };
          }
        }
      }

      if (!targetUser) {
        return {
          success: false,
          message: "Invalid corporate email or password. Please check your credentials."
        };
      }

      setCurrentUser(targetUser);
      try {
        localStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(targetUser));
      } catch (err) {
        console.warn("Could not store session:", err);
      }

      // Tenant Workspace Alignment
      if (targetUser.companyId) {
        setActiveCompanyId(targetUser.companyId);
        try {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY_ID, targetUser.companyId);
        } catch {}
      } else if (targetUser.agencyId) {
        setSelectedAgencyId(targetUser.agencyId);
      }

      setActiveRole(targetUser.role);
      navigate(targetUser.portalRoute || "/employer-dashboard");

      return { success: true, user: targetUser };
    },
    [companyUsers, companies, agencies, setActiveRole, setActiveCompanyId, setSelectedAgencyId, navigate]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
    } catch {}
    navigate("/login");
  }, [navigate]);

  // =========================================================================
  // SUPABASE POSTGRESQL & CLOUD STORAGE SYNCHRONIZATION LAYER
  // =========================================================================
  const [dbConfig, setDbConfig] = useState(() => getSupabaseConfig());
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    checking: true,
    connected: false,
    message: "Initializing cloud database connection...",
    lastSynced: null
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Check and Sync Database
  const checkAndSyncDb = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsDbConnected(false);
      setDbStatus({
        checking: false,
        connected: false,
        message: "Running in local storage mode. Connect Supabase PostgreSQL in Super Admin settings to activate real multi-tenant cloud persistence.",
        lastSynced: null
      });
      return;
    }

    setDbStatus((prev) => ({ ...prev, checking: true, message: "Pinging Supabase PostgreSQL..." }));
    const test = await testSupabaseConnection();

    if (test.success) {
      setIsDbConnected(true);
      setDbStatus({
        checking: false,
        connected: true,
        message: test.message,
        lastSynced: new Date().toLocaleTimeString()
      });

      // Load live PostgreSQL data if available
      try {
        setIsSyncing(true);
        const liveData = await fetchAllFromSupabase();
        if (liveData) {
          if (liveData.companies && liveData.companies.length > 0) {
            setCompanies(liveData.companies);
          }
          if (Array.isArray(liveData.jobs)) {
            setJobs(liveData.jobs);
          }
          if (Array.isArray(liveData.candidates)) {
            setCandidates(liveData.candidates);
          }
          if (liveData.agencies) {
            const cleanAgencies = (liveData.agencies || []).filter(
              (a) =>
                !["agy-1", "agy-2", "agy-3"].includes(a.id) &&
                !["NAUKRI-ELITE-BLR", "ABC-INDIA-MUM", "SUTRA-TECH-PUN"].includes(a.portalCode) &&
                !["Naukri Elite Talent Partners", "ABC Consultants Tech Practice", "SutraHR Executive Search"].includes(a.name)
            );
            const savedLogos = getStoredAgencyLogos();
            setAgencies((prevAgencies) => {
              const prevMap = new Map((prevAgencies || []).map((pa) => [pa.id, pa]));
              return cleanAgencies.map((a) => {
                const existing = prevMap.get(a.id);
                const preservedLogo =
                  a.logoUrl ||
                  a.logo ||
                  savedLogos[a.id] ||
                  existing?.logoUrl ||
                  existing?.logo ||
                  "";
                if (preservedLogo) {
                  persistAgencyLogo(a.id, preservedLogo);
                }
                return {
                  ...a,
                  ...existing,
                  ...a,
                  commissionRate: a.commissionRate || a.commissionTier || existing?.commissionRate || "8.50% [Standard Retainer]",
                  commissionTier: a.commissionTier || a.commissionRate || existing?.commissionTier || "8.50% [Standard Retainer]",
                  gstin: a.gstin || existing?.gstin || "",
                  logoUrl: preservedLogo,
                  logo: preservedLogo
                };
              });
            });
          }
          if (liveData.companyUsers) {
            const cleanUsers = (liveData.companyUsers || []).filter(
              (u) =>
                !u.id?.startsWith("usr-10") &&
                !u.id?.startsWith("usr-20") &&
                !u.id?.startsWith("usr-30") &&
                !["usr-101", "usr-102", "usr-103", "usr-104", "usr-105", "usr-201", "usr-202", "usr-301", "usr-302"].includes(u.id) &&
                !u.email?.includes("@bharatscale.in") &&
                !u.email?.includes("@zeptolabs.in") &&
                !u.email?.includes("@razorinfra.com")
            );
            setCompanyUsers(cleanUsers);
          }
          setDbStatus((prev) => ({
            ...prev,
            lastSynced: new Date().toLocaleTimeString(),
            message: `Connected & Synced with live Supabase PostgreSQL (${liveData.companies.length} Companies, ${liveData.jobs.length} Jobs, ${liveData.candidates.length} Candidates).`
          }));
        }
      } catch (err) {
        console.warn("Could not pull live Supabase data:", err);
      } finally {
        setIsSyncing(false);
      }
    } else {
      setIsDbConnected(false);
      setDbStatus({
        checking: false,
        connected: false,
        message: test.message,
        lastSynced: null
      });
    }
  }, []);

  useEffect(() => {
    checkAndSyncDb();
  }, [checkAndSyncDb]);

  const connectSupabase = async (url, anonKey) => {
    saveSupabaseConfig(url, anonKey);
    setDbConfig(getSupabaseConfig());
    await checkAndSyncDb();
  };

  const disconnectSupabase = () => {
    clearSupabaseConfig();
    setDbConfig(getSupabaseConfig());
    setIsDbConnected(false);
    setDbStatus({
      checking: false,
      connected: false,
      message: "Disconnected from Supabase PostgreSQL. Reverted to local state.",
      lastSynced: null
    });
  };

  const syncFromSupabase = async () => {
    setIsSyncing(true);
    await checkAndSyncDb();
    setIsSyncing(false);
  };

  const uploadResumeFile = async (file, candidateId) => {
    return await uploadResumeToStorage(file, candidateId);
  };

  // Sync to local storage as fallback
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

  // Stage Transition & Notification Modal State
  const [stageTransitionPrompt, setStageTransitionPrompt] = useState(null);
  const [stageAlert, setStageAlert] = useState(null);

  const promptStageChange = (candidateOrId, newStage) => {
    const candidateObj =
      typeof candidateOrId === "object"
        ? candidateOrId
        : candidates.find((c) => c.id === candidateOrId);
    if (!candidateObj) return;
    setStageTransitionPrompt({ candidate: candidateObj, newStage });
  };

  const closeStageTransitionPrompt = () => {
    setStageTransitionPrompt(null);
  };

  // Actions
  const changeStage = (candidateId, newStage, customNote = null) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              stage: newStage,
              notes: [
                {
                  author: "Recruiting Operations",
                  text: customNote || `Candidate moved to stage: ${newStage.toUpperCase()}`,
                  date: new Date().toISOString().split("T")[0],
                },
                ...(c.notes || []),
              ],
            }
          : c
      )
    );

    // Sync to Supabase PostgreSQL in background
    if (isSupabaseConfigured()) {
      updateCandidateStageInDb(candidateId, newStage);
    }
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

    // Sync to Supabase PostgreSQL in background
    if (isSupabaseConfigured()) {
      saveCandidateToDb(newCand);
    }

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

  const updateCandidate = (candidateId, updates) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updated = { ...c, ...updates };
          if (isSupabaseConfigured()) {
            saveCandidateToDb(updated);
          }
          return updated;
        }
        return c;
      })
    );
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

    // Sync batch to Supabase PostgreSQL in background
    if (isSupabaseConfigured()) {
      createdCandidates.forEach((cand) => saveCandidateToDb(cand));
    }

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

    // Sync to Supabase PostgreSQL in background
    if (isSupabaseConfigured()) {
      saveJobToDb(newJob);
    }

    return newJob;
  };

  const updateJob = (jobId, updatedData) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updated = { ...j, ...updatedData };
          if (isSupabaseConfigured()) {
            saveJobToDb(updated);
          }
          return updated;
        }
        return j;
      })
    );
  };

  const toggleJobStatus = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const newStatus = j.status === "active" ? "inactive" : "active";
          const updated = { ...j, status: newStatus };
          if (isSupabaseConfigured()) {
            saveJobToDb(updated);
          }
          return updated;
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

  const addAgency = async (agencyData) => {
    const newAgencyId = agencyData.id || `agy-${Date.now()}`;
    const logoVal = agencyData.logoUrl || agencyData.logo || "";
    if (logoVal) {
      persistAgencyLogo(newAgencyId, logoVal);
    }
    const newAgency = {
      id: newAgencyId,
      joinedDate: new Date().toISOString().split("T")[0],
      activeJobsAssigned: jobs.filter((j) => j.syndicateToAgencies).length,
      candidatesSubmitted: 0,
      placementsHired: 0,
      totalBountiesEarned: "₹0",
      status: "active",
      rating: 5.0,
      tier: agencyData.tier || "Elite Partner",
      portalPassword: agencyData.portalPassword || "Agency#2026!",
      ...agencyData,
      commissionRate: agencyData.commissionRate || agencyData.commissionTier || "8.50% [Standard Retainer]",
      commissionTier: agencyData.commissionTier || agencyData.commissionRate || "8.50% [Standard Retainer]",
      logoUrl: logoVal,
      logo: logoVal
    };

    setAgencies((prev) => {
      const next = [newAgency, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.AGENCIES, JSON.stringify(next));
      } catch (err) {
        console.warn("Storage write:", err);
      }
      return next;
    });

    // Sync to Supabase in background
    if (isSupabaseConfigured()) {
      try {
        await saveAgencyToDb(newAgency);
      } catch (err) {
        console.error("Supabase add agency error:", err);
      }
    }

    return newAgency;
  };

  const toggleAgencyStatus = (agencyId) => {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          const updated = { ...a, status: a.status === "active" ? "suspended" : "active" };
          if (isSupabaseConfigured()) {
            saveAgencyToDb(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const toggleBlockAgencyForCompany = (agencyId, targetCompanyId = activeCompanyId) => {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          const currentBlocked = a.blockedCompanyIds || [];
          const isBlocked = currentBlocked.includes(targetCompanyId);
          const updatedBlocked = isBlocked
            ? currentBlocked.filter((id) => id !== targetCompanyId)
            : [...currentBlocked, targetCompanyId];
          const updated = {
            ...a,
            blockedCompanyIds: updatedBlocked,
          };
          if (isSupabaseConfigured()) {
            saveAgencyToDb(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const updateAgency = async (agencyId, updatedData) => {
    const logoVal = updatedData.logoUrl !== undefined ? updatedData.logoUrl : updatedData.logo;
    if (logoVal !== undefined) {
      persistAgencyLogo(agencyId, logoVal);
    }

    let updatedAgencyObj = null;

    setAgencies((prev) => {
      const nextList = prev.map((a) => {
        if (String(a.id) === String(agencyId)) {
          const finalLogo = logoVal !== undefined ? logoVal : (a.logoUrl || a.logo || "");
          updatedAgencyObj = {
            ...a,
            ...updatedData,
            commissionRate: updatedData.commissionRate || updatedData.commissionTier || a.commissionRate || a.commissionTier || "8.50% [Standard Retainer]",
            commissionTier: updatedData.commissionTier || updatedData.commissionRate || a.commissionTier || a.commissionRate || "8.50% [Standard Retainer]",
            logoUrl: finalLogo,
            logo: finalLogo
          };
          return updatedAgencyObj;
        }
        return a;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.AGENCIES, JSON.stringify(nextList));
      } catch (err) {
        console.warn("Storage write:", err);
      }
      return nextList;
    });

    if (updatedAgencyObj && isSupabaseConfigured()) {
      try {
        await saveAgencyToDb(updatedAgencyObj);
      } catch (err) {
        console.error("Supabase update agency error:", err);
      }
    }

    return updatedAgencyObj;
  };

  const removeAgency = (agencyId) => {
    setAgencies((prev) => prev.filter((a) => a.id !== agencyId));
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
      employeeCount: newTenant.employeeCount || "50-250 Builders",
      logoInitials: initials,
      logoUrl: newTenant.logoUrl || "",
      logoBadgeColor: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
      coverImage: newTenant.coverImage || newTenant.coverBannerUrl || COVER_PRESETS[0].url,
      coverBannerUrl: newTenant.coverBannerUrl || newTenant.coverImage || COVER_PRESETS[0].url,
      brandColor: newTenant.brandColor || "#4f46e5",
      accentColor: newTenant.accentColor || "#0284c7",
      plan: newTenant.plan || "Enterprise Scale Tier",
      adminPassword: newTenant.adminPassword || "Company#2026!",
      ...newTenant,
    };
    setCompanies((prev) => [created, ...prev]);

    // Sync to Supabase in background
    if (isSupabaseConfigured()) {
      saveCompanyToDb(created);
    }

    // Create primary admin user if email given
    if (created.primaryAdmin) {
      const adminUser = {
        id: `usr-${Date.now().toString(36)}`,
        companyId: created.id,
        name: created.primaryAdminName || "Primary Administrator",
        email: created.primaryAdmin,
        password: created.adminPassword,
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

  const toggleCompanyStatus = (companyId) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const updated = { ...c, status: c.status === "Active" ? "Suspended" : "Active" };
          if (isSupabaseConfigured()) {
            saveCompanyToDb(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  const updateCompanyCredentials = (companyId, credentials) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const updated = { ...c, ...credentials };
          if (isSupabaseConfigured()) {
            saveCompanyToDb(updated);
          }
          return updated;
        }
        return c;
      })
    );

    // Keep companyUsers in sync so team members list and credentials match
    if (credentials.primaryAdmin || credentials.adminPassword) {
      setCompanyUsers((prev) => {
        const hasAdmin = prev.some(
          (u) =>
            u.companyId === companyId &&
            (u.role === "Company Admin" || u.role === "company_admin")
        );
        if (hasAdmin) {
          return prev.map((u) => {
            if (
              u.companyId === companyId &&
              (u.role === "Company Admin" || u.role === "company_admin")
            ) {
              return {
                ...u,
                email: credentials.primaryAdmin || u.email,
                password: credentials.adminPassword || u.password
              };
            }
            return u;
          });
        } else if (credentials.primaryAdmin) {
          const newAdminUser = {
            id: `usr-${Date.now().toString(36)}`,
            companyId,
            name: "Company Administrator",
            email: credentials.primaryAdmin,
            password: credentials.adminPassword || "Company#2026!",
            role: "Company Admin",
            title: "Primary Administrator",
            department: "Talent Acquisition",
            status: "Active",
            lastLogin: "Active Now",
            phone: "+91 98000 00000"
          };
          return [newAdminUser, ...prev];
        }
        return prev;
      });
    }
  };

  const removeCompanyTenant = (companyId) => {
    setCompanies((prev) => {
      const filtered = prev.filter((c) => c.id !== companyId);
      if (activeCompanyId === companyId && filtered.length > 0) {
        setActiveCompanyId(filtered[0].id);
      }
      return filtered;
    });
    setCompanyUsers((prev) => prev.filter((u) => u.companyId !== companyId));
    setJobs((prev) => prev.filter((j) => j.companyId !== companyId));
    setCandidates((prev) => prev.filter((cand) => cand.companyId !== companyId));
    if (isSupabaseConfigured()) {
      deleteCompanyFromDb(companyId);
    }
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

  const activeAgency =
    agencies.find((a) => a.id === selectedAgencyId) ||
    (currentUser?.agencyId ? agencies.find((a) => a.id === currentUser.agencyId) : null) ||
    agencies[0] ||
    null;

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
        stageTransitionPrompt,
        promptStageChange,
        closeStageTransitionPrompt,
        stageAlert,
        setStageAlert,
        addCandidate,
        updateCandidate,
        addBulkCandidates,
        addCandidateNote,
        addJob,
        updateJob,
        toggleJobStatus,
        toggleJobSyndication,
        scheduleInterview,
        addAgency,
        toggleAgencyStatus,
        toggleBlockAgencyForCompany,
        updateAgency,
        removeAgency,
        toggleCompanyStatus,
        updateCompanyCredentials,
        removeCompanyTenant,
        updateCareerSettings,
        resetToDefaults,
        // Cloud Database & Storage (Supabase + Cloudflare R2)
        dbConfig,
        isDbConnected,
        dbStatus,
        isSyncing,
        connectSupabase,
        disconnectSupabase,
        syncFromSupabase,
        uploadResumeFile,
        uploadImageToCloudinary,
        // Enterprise Unified Auth & Session
        currentUser,
        setCurrentUser,
        login,
        logout,
        DEFAULT_USERS,
        getAdminEnvCredentials,
        adminCredentials: getAdminEnvCredentials()
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
