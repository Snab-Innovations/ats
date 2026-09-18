/**
 * Company Slug Utilities for ExpertHire ATS
 * Generates and parses company career URLs like /career-site/:companySlug and /:companySlug-careers
 */

export const getCompanySlug = (company) => {
  if (!company) return "bharatscale";
  if (company.domain) {
    const part = company.domain.split(".")[0].toLowerCase().trim();
    if (part) return part;
  }
  if (company.name) {
    return company.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  return String(company.id || "company").toLowerCase();
};

export const findCompanyBySlug = (slug, companies = []) => {
  if (!slug || !Array.isArray(companies) || companies.length === 0) return null;

  const normalized = slug
    .toLowerCase()
    .trim()
    .replace(/-careers$|-career-site$|-portal$|^career-site-|^careers-/, "");

  // 1. Exact match on domain prefix (e.g. 'bharatscale', 'zeptolabs', 'razorinfra')
  const byDomain = companies.find((c) => {
    const prefix = (c.domain || "").split(".")[0].toLowerCase().trim();
    return prefix === normalized || prefix === slug.toLowerCase();
  });
  if (byDomain) return byDomain;

  // 2. Match on name slug
  const byName = companies.find((c) => {
    const nameSlug = (c.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return nameSlug === normalized || nameSlug.includes(normalized) || normalized.includes(nameSlug);
  });
  if (byName) return byName;

  // 3. Match on ID
  const byId = companies.find((c) => {
    return (c.id || "").toLowerCase() === normalized || (c.id || "").toLowerCase() === slug.toLowerCase();
  });
  if (byId) return byId;

  return null;
};
