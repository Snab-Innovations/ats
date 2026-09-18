import { getSupabase, isSupabaseConfigured } from "./supabaseClient";

/**
 * DB Service: Coordinates multi-tenant reads, writes, and file storage
 * between the React ATS state and Supabase PostgreSQL.
 */

// Helper to convert camelCase candidate/job object to DB-safe snake_case if needed
const mapJobToDb = (job) => ({
  id: String(job.id),
  company_id: String(job.companyId),
  title: job.title,
  department: job.department,
  location: job.location,
  type: job.type || "Full-time",
  format: job.format || "In-Office",
  experience: job.experience || "3-5 Yrs",
  education: job.education || "B.Tech / B.E.",
  ctc_range: job.ctcRange || job.ctc_range || "₹25 - ₹40 LPA",
  status: job.status || "active",
  description: job.description || "",
  requirements: Array.isArray(job.requirements) ? job.requirements : [],
  skills: Array.isArray(job.skills) ? job.skills : [],
  bounty: job.bounty || "₹1.5 Lakhs",
  commission_rate: job.commissionRate || job.commission_rate || "8.5%",
  agency_dispatched: Boolean(job.agencyDispatched ?? true),
  created_at: job.createdAt || job.created_at || new Date().toISOString()
});

const mapJobFromDb = (dbJob) => ({
  id: dbJob.id,
  companyId: dbJob.company_id,
  title: dbJob.title,
  department: dbJob.department,
  location: dbJob.location,
  type: dbJob.type,
  format: dbJob.format,
  experience: dbJob.experience,
  education: dbJob.education,
  ctcRange: dbJob.ctc_range,
  status: dbJob.status,
  description: dbJob.description,
  requirements: dbJob.requirements || [],
  skills: dbJob.skills || [],
  bounty: dbJob.bounty,
  commissionRate: dbJob.commission_rate,
  agencyDispatched: dbJob.agency_dispatched,
  createdAt: dbJob.created_at
});

const mapCandidateToDb = (cand) => ({
  id: String(cand.id),
  company_id: String(cand.companyId),
  job_id: String(cand.jobId),
  name: cand.name,
  email: cand.email,
  phone: cand.phone || "",
  current_company: cand.currentCompany || cand.current_company || "",
  experience: cand.experience || "0 Yrs",
  current_ctc: cand.currentCtc || cand.current_ctc || "₹0 LPA",
  expected_ctc: cand.expectedCtc || cand.expected_ctc || "₹0 LPA",
  notice_period: cand.noticePeriod || cand.notice_period || "30 Days",
  education: cand.education || "",
  college: cand.college || "",
  skills: Array.isArray(cand.skills) ? cand.skills : [],
  stage: cand.stage || "applied",
  source: cand.source || "direct",
  agency_id: cand.agencyId ? String(cand.agencyId) : null,
  resume_url: cand.resumeUrl || cand.resume_url || "",
  resume_file_name: cand.resumeFileName || cand.resume_file_name || "",
  pitch: cand.pitch || "",
  applied_date: cand.appliedDate || cand.applied_date || new Date().toISOString()
});

const mapCandidateFromDb = (dbCand) => ({
  id: dbCand.id,
  companyId: dbCand.company_id,
  jobId: dbCand.job_id,
  name: dbCand.name,
  email: dbCand.email,
  phone: dbCand.phone,
  currentCompany: dbCand.current_company,
  experience: dbCand.experience,
  currentCtc: dbCand.current_ctc,
  expectedCtc: dbCand.expected_ctc,
  noticePeriod: dbCand.notice_period,
  education: dbCand.education,
  college: dbCand.college,
  skills: dbCand.skills || [],
  stage: dbCand.stage,
  source: dbCand.source,
  agencyId: dbCand.agency_id,
  resumeUrl: dbCand.resume_url,
  resumeFileName: dbCand.resume_file_name,
  pitch: dbCand.pitch,
  appliedDate: dbCand.applied_date
});

/**
 * Fetch all platform entities from Supabase PostgreSQL
 */
export const fetchAllFromSupabase = async () => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const [companiesRes, usersRes, agenciesRes, jobsRes, candidatesRes] = await Promise.all([
      client.from("companies").select("*").order("name"),
      client.from("company_users").select("*"),
      client.from("agencies").select("*").order("name"),
      client.from("jobs").select("*").order("created_at", { ascending: false }),
      client.from("candidates").select("*").order("applied_date", { ascending: false })
    ]);

    if (companiesRes.error || jobsRes.error || candidatesRes.error) {
      console.warn("Supabase fetch returned error:", companiesRes.error || jobsRes.error);
      return null;
    }

    return {
      companies: (companiesRes.data || []).map((c) => ({
        id: c.id,
        name: c.name,
        domain: c.domain,
        headquarters: c.headquarters,
        city: c.city || "Bengaluru",
        tagline: c.tagline,
        brandColor: c.brand_color,
        accentColor: c.accent_color,
        logoUrl: c.logo_url,
        logoInitials: c.logo_initials,
        coverBannerUrl: c.cover_banner_url || c.cover_image || "",
        coverImage: c.cover_banner_url || c.cover_image || "",
        status: c.status,
        plan: c.plan,
        primaryAdmin: c.primary_admin,
        adminPassword: c.admin_password
      })),
      companyUsers: (usersRes.data || []).map((u) => ({
        id: u.id,
        companyId: u.company_id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        status: u.status,
        lastLogin: u.last_login
      })),
      agencies: (agenciesRes.data || []).map((a) => {
        const rawSpec = a.specialization || "";
        let cleanSpec = rawSpec;
        let parsedLogo = a.logo_url || a.logo || "";
        let parsedGstin = "";

        if (rawSpec.includes("||META:")) {
          const [s, metaJson] = rawSpec.split("||META:");
          cleanSpec = s.trim();
          try {
            const meta = JSON.parse(metaJson);
            if (meta.logoUrl || meta.logo) parsedLogo = meta.logoUrl || meta.logo;
            if (meta.gstin) parsedGstin = meta.gstin;
          } catch {}
        } else if (rawSpec.includes("||LOGO:")) {
          const [s, logoStr] = rawSpec.split("||LOGO:");
          cleanSpec = s.trim();
          if (logoStr) parsedLogo = logoStr.trim();
        }

        return {
          id: a.id,
          name: a.name,
          portalCode: a.portal_code,
          city: a.city,
          tier: a.tier,
          primaryContact: a.primary_contact,
          email: a.email,
          phone: a.phone,
          specialization: cleanSpec,
          commissionTier: a.commission_tier,
          commissionRate: a.commission_tier,
          status: a.status,
          portalPassword: a.portal_password,
          candidatesSubmitted: a.candidates_submitted || 0,
          placementsHired: a.placements_hired || 0,
          bountiesClaimed: a.bounties_claimed || 0,
          logoUrl: parsedLogo,
          logo: parsedLogo,
          gstin: parsedGstin
        };
      }),
      jobs: (jobsRes.data || []).map(mapJobFromDb),
      candidates: (candidatesRes.data || []).map(mapCandidateFromDb)
    };
  } catch (err) {
    console.warn("Error communicating with Supabase:", err);
    return null;
  }
};

/**
 * Company Tenant CRUD
 */
export const saveCompanyToDb = async (company) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = {
      id: String(company.id),
      name: company.name,
      domain: company.domain,
      headquarters: company.headquarters || "",
      city: company.city || "Bengaluru",
      tagline: company.tagline || "",
      brand_color: company.brandColor || "#4f46e5",
      accent_color: company.accentColor || "#06b6d4",
      logo_url: company.logoUrl || "",
      logo_initials: company.logoInitials || company.name.slice(0, 2).toUpperCase(),
      cover_banner_url: company.coverBannerUrl || company.coverImage || "",
      status: company.status || "Active",
      plan: company.plan || "Growth Scale Tier",
      primary_admin: company.primaryAdmin || `admin@${company.domain}`,
      admin_password: company.adminPassword || "Company#2026!"
    };

    const { error } = await client.from("companies").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to save company to Supabase:", err);
    return false;
  }
};

export const deleteCompanyFromDb = async (companyId) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from("companies").delete().eq("id", String(companyId));
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to delete company from Supabase:", err);
    return false;
  }
};

/**
 * Job Requisition CRUD
 */
export const saveJobToDb = async (job) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapJobToDb(job);
    const { error } = await client.from("jobs").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to save job to Supabase:", err);
    return false;
  }
};

export const deleteJobFromDb = async (jobId) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from("jobs").delete().eq("id", String(jobId));
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to delete job from Supabase:", err);
    return false;
  }
};

/**
 * Candidate CRUD & Stage Tracking
 */
export const saveCandidateToDb = async (candidate) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapCandidateToDb(candidate);
    const { error } = await client.from("candidates").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to save candidate to Supabase:", err);
    return false;
  }
};

export const updateCandidateStageInDb = async (candidateId, newStage) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from("candidates")
      .update({ stage: newStage })
      .eq("id", String(candidateId));
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to update candidate stage in Supabase:", err);
    return false;
  }
};

/**
 * Agency Partner CRUD
 */
export const saveAgencyToDb = async (agency) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const cleanLogo = (agency.logoUrl || agency.logo || "").trim();
    const cleanGstin = (agency.gstin || "").trim();
    const rawSpec = agency.specialization || "";
    const baseSpec = rawSpec.split("||META:")[0].split("||LOGO:")[0].trim() || "Engineering & Cloud";

    let finalSpecialization = baseSpec;
    if (cleanLogo || cleanGstin) {
      const meta = {};
      if (cleanLogo) meta.logoUrl = cleanLogo;
      if (cleanGstin) meta.gstin = cleanGstin;
      finalSpecialization = `${baseSpec}||META:${JSON.stringify(meta)}`;
    }

    const payload = {
      id: String(agency.id),
      name: agency.name || "Agency Partner",
      portal_code: agency.portalCode || agency.portal_code || agency.id,
      city: agency.city || "Bengaluru",
      tier: agency.tier || "Elite Partner",
      primary_contact: agency.primaryContact || agency.primary_contact || "",
      email: agency.email || "",
      phone: agency.phone || "",
      specialization: finalSpecialization,
      commission_tier: agency.commissionTier || agency.commissionRate || agency.commission_tier || "8.50% [Standard Retainer]",
      status: agency.status || "active",
      portal_password: agency.portalPassword || agency.portal_password || "Agency#2026!",
      candidates_submitted: Number(agency.candidatesSubmitted || agency.candidates_submitted || 0),
      placements_hired: Number(agency.placementsHired || agency.placements_hired || 0),
      bounties_claimed: Number(agency.bountiesClaimed || agency.bounties_claimed || 0)
    };

    const { error } = await client.from("agencies").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Failed to save agency to Supabase:", error);
      throw error;
    }
    return true;
  } catch (err) {
    console.error("Failed to save agency to Supabase:", err);
    return false;
  }
};

/**
 * Cloud File Storage (Resume PDF / DOCX to Cloudinary [preset: resumes, cloud_name: ljelkpy4] with Supabase Storage fallback)
 */
export const uploadResumeToStorage = async (file, candidateId = Date.now()) => {
  if (!file) {
    return {
      success: false,
      error: "No file provided"
    };
  }

  // 1. Direct Cloud Storage via Cloudinary Preset (name: ljelkpy4, preset: resumes)
  const cloudName =
    import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME ||
    localStorage.getItem("experthire_cloudinary_cloud_name") ||
    "ljelkpy4";
  const uploadPreset =
    import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET ||
    localStorage.getItem("experthire_cloudinary_upload_preset") ||
    "resumes";

  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      // Try raw/upload first for PDF/DOCX documents, then auto/upload as fallback
      const endpoints = ["raw", "auto"];
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/upload`, {
            method: "POST",
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            if (data.secure_url) {
              console.info("Successfully uploaded resume to Cloudinary:", data.secure_url);
              return {
                success: true,
                url: data.secure_url,
                fileName: file.name,
                source: "cloudinary_storage",
                assetId: data.asset_id,
                publicId: data.public_id,
                format: data.format || file.name.split(".").pop()
              };
            }
          } else {
            const errJson = await response.json().catch(() => ({}));
            console.warn(`Cloudinary ${endpoint}/upload returned non-200:`, errJson);
          }
        } catch (subErr) {
          console.warn(`Cloudinary ${endpoint}/upload attempt error:`, subErr);
        }
      }
    } catch (cErr) {
      console.warn("Cloudinary upload network error, trying fallback:", cErr);
    }
  }

  // 2. Supabase Storage Fallback (if configured)
  const client = getSupabase();
  if (client) {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `resumes/${candidateId}_${Date.now()}_${cleanFileName}`;

      const { data, error } = await client.storage.from("resumes").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true
      });

      if (!error) {
        const { data: publicData } = client.storage.from("resumes").getPublicUrl(filePath);
        if (publicData?.publicUrl) {
          return {
            success: true,
            url: publicData.publicUrl,
            fileName: file.name,
            source: "supabase_storage"
          };
        }
      }
    } catch (sErr) {
      console.warn("Supabase storage upload error:", sErr);
    }
  }

  // 3. Local offline fallback URL
  return {
    success: true,
    url: URL.createObjectURL(file),
    fileName: file.name,
    source: "local-fallback"
  };
};

/**
 * Direct Cloudinary Image Upload for Company/Agency Logos and Cover Banners
 */
export const uploadImageToCloudinary = async (file) => {
  if (!file) return { success: false, error: "No file selected" };

  const cloudName =
    import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME ||
    localStorage.getItem("experthire_cloudinary_cloud_name") ||
    "ljelkpy4";
  const uploadPreset =
    import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET ||
    localStorage.getItem("experthire_cloudinary_upload_preset") ||
    "resumes";

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // 1. Try image/upload endpoint first
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) {
        return {
          success: true,
          url: data.secure_url,
          fileName: file.name,
          publicId: data.public_id,
          format: data.format
        };
      }
    }

    // 2. Fallback to auto/upload endpoint
    const autoRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData
    });

    if (autoRes.ok) {
      const autoData = await autoRes.json();
      if (autoData.secure_url) {
        return {
          success: true,
          url: autoData.secure_url,
          fileName: file.name,
          publicId: autoData.public_id,
          format: autoData.format
        };
      }
    }

    const errJson = await res.json().catch(() => ({}));
    console.warn("Cloudinary upload returned error:", errJson);
  } catch (netErr) {
    console.warn("Cloudinary network upload error:", netErr);
  }

  // Graceful fallback to FileReader Base64 Data URL so user never gets stuck
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        success: true,
        url: reader.result,
        fileName: file.name,
        source: "local-data-url"
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        error: "Could not read file locally"
      });
    };
    reader.readAsDataURL(file);
  });
};

