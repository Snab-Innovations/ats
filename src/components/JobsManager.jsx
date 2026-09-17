import React, { useState, useRef } from "react";
import { useAts } from "../context/AtsContext";
import {
  Briefcase,
  Plus,
  Share2,
  Code2,
  Search,
  Users,
  Eye,
  Edit,
  Sparkles,
  IndianRupee,
  MapPin,
  PlayCircle,
  PauseCircle,
  GraduationCap,
  CheckCircle2,
  Clock,
  Info,
  Building
} from "lucide-react";

export const JobsManager = () => {
  const {
    jobs,
    company,
    setIsJobModalOpen,
    setEditingJob,
    toggleJobStatus,
    toggleJobSyndication,
    setAdminTab
  } = useAts();

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'inactive'

  // Floating hover popover state for job title
  const [hoveredJob, setHoveredJob] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, placeAbove: false });
  const hoverTimeoutRef = useRef(null);

  const handleTitleMouseEnter = (e, job) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const cardEstimatedHeight = 360;
    const placeAbove = spaceBelow < cardEstimatedHeight && rect.top > cardEstimatedHeight;

    setPopoverPos({
      top: placeAbove ? rect.top - 8 : rect.bottom + 8,
      left: Math.max(16, Math.min(rect.left, window.innerWidth - 460)),
      placeAbove
    });
    setHoveredJob(job);
  };

  const handleTitleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredJob(null);
    }, 120);
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handlePopoverMouseLeave = () => {
    setHoveredJob(null);
  };

  const companyJobs = jobs.filter((j) => (j.companyId ? j.companyId === company.id : true));
  const departments = ["all", ...new Set(companyJobs.map((j) => j.department))];

  const activeCount = companyJobs.filter((j) => j.status === "active").length;
  const inactiveCount = companyJobs.filter((j) => j.status !== "active").length;

  const filteredJobs = companyJobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === "all" || j.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? j.status === "active" : j.status !== "active");
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="admin-main">
      <header className="page-header">
        <div className="page-title-group">
          <h1>Requisitions & Consultancy Syndication Hub</h1>
          <p>
            Publish open mandates across Bengaluru, Gurugram, Mumbai & syndicate to certified Indian headhunters
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setAdminTab("career_builder")}
          >
            <Code2 size={15} />
            <span>Iframe Embed Setup</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingJob(null);
              setIsJobModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Create New Requisition</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* Quick Active / Deactive Job Status Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === "all" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStatusFilter("all")}
            style={{ padding: "6px 14px", borderRadius: "var(--radius-full)", fontWeight: statusFilter === "all" ? 700 : 500 }}
          >
            All Requisitions ({companyJobs.length})
          </button>

          <button
            type="button"
            className={`btn btn-sm ${statusFilter === "active" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStatusFilter("active")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontWeight: statusFilter === "active" ? 700 : 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            <span>Active Jobs ({activeCount})</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm ${statusFilter === "inactive" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStatusFilter("inactive")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontWeight: statusFilter === "inactive" ? 700 : 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            <span>Deactive / Paused ({inactiveCount})</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 280 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Search jobs by title, department, or Indian tech hub..."
                className="form-input"
                style={{ paddingLeft: 38 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ minWidth: 200 }}>
              <select
                className="form-select"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? "All Departments" : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Showing <strong>{filteredJobs.length}</strong> of {companyJobs.length} mandates
          </div>
        </div>

        {/* Jobs Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Requisition Title</th>
                <th>Department</th>
                <th>Hub Location</th>
                <th>CTC Band (₹ LPA)</th>
                <th>Applicant Flow</th>
                <th>Consultancy Syndication</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    No requisitions found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} style={{ opacity: job.status !== "active" ? 0.85 : 1 }}>
                    <td>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: job.status !== "active" ? "var(--text-secondary)" : "var(--text-primary)",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6
                        }}
                        onMouseEnter={(e) => handleTitleMouseEnter(e, job)}
                        onMouseLeave={handleTitleMouseLeave}
                        onClick={() => {
                          setEditingJob(job);
                          setIsJobModalOpen(true);
                        }}
                        title="Hover to view full requisition details • Click to edit"
                      >
                        <span style={{ textDecoration: "underline", textDecorationColor: "var(--border-medium)", textUnderlineOffset: 3 }}>
                          {job.title}
                        </span>
                        <Info size={13} color="var(--primary)" style={{ opacity: 0.65, flexShrink: 0 }} />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "nowrap" }}>
                        <span
                          className={`badge ${job.status === "active" ? "badge-active" : "badge-paused"}`}
                          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.725rem", padding: "2px 8px" }}
                          title="Click to toggle Active / Deactive status"
                          onClick={() => toggleJobStatus(job.id)}
                        >
                          {job.status === "active" ? (
                            <>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                              Active
                            </>
                          ) : (
                            <>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
                              Deactive
                            </>
                          )}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                          Posted on {job.postedDate}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600 }}>{job.department}</span>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={13} color="var(--text-muted)" />
                        <span>{job.location}</span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {job.workType} &bull; {job.employmentType}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>
                        {job.salary}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div title="Total Views" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          <Eye size={14} color="var(--text-muted)" />
                          <span>{job.viewsCount || 0}</span>
                        </div>
                        <div
                          title="Total Applicants"
                          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--primary)", cursor: "pointer", fontWeight: 700 }}
                          onClick={() => setAdminTab("pipeline")}
                        >
                          <Users size={14} />
                          <span>{job.applicationsCount || 0}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {/* Toggle switch for Send to Agency */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            cursor: "pointer",
                            userSelect: "none",
                            width: "fit-content"
                          }}
                          onClick={() =>
                            toggleJobSyndication(
                              job.id,
                              !job.syndicateToAgencies,
                              job.agencyBounty || "₹75,000 Cash Bounty"
                            )
                          }
                          title={
                            job.syndicateToAgencies
                              ? "Agency syndication is ON (agencies can view and submit candidates). Click to turn OFF."
                              : "Agency syndication is OFF (hidden from agency portal). Click to send to agencies."
                          }
                        >
                          {/* Toggle Switch Track */}
                          <div
                            style={{
                              width: 38,
                              height: 22,
                              borderRadius: 12,
                              background: job.syndicateToAgencies ? "var(--primary)" : "var(--border-medium)",
                              position: "relative",
                              transition: "background 0.2s ease",
                              flexShrink: 0
                            }}
                          >
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: "#ffffff",
                                position: "absolute",
                                top: 3,
                                left: job.syndicateToAgencies ? 19 : 3,
                                transition: "left 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.25)"
                              }}
                            />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", minWidth: 110 }}>
                            <span
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: job.syndicateToAgencies ? "var(--text-primary)" : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              Send to Agency
                            </span>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: job.syndicateToAgencies ? "#059669" : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              {job.syndicateToAgencies ? (
                                <>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                                  ON (Visible)
                                </>
                              ) : (
                                <>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border-medium)", display: "inline-block" }} />
                                  OFF (Hidden)
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        {job.syndicateToAgencies && (
                          <div style={{ fontSize: "0.725rem", color: "#7c3aed", display: "flex", alignItems: "center", gap: 4, paddingLeft: 2 }}>
                            <Sparkles size={11} />
                            <span>Bounty: <strong>{job.agencyBounty}</strong></span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                        {/* Active / Deactive Job Button */}
                        {job.status === "active" ? (
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{
                              fontSize: "0.75rem",
                              color: "#b45309",
                              border: "1px solid rgba(245, 158, 11, 0.3)",
                              padding: "5px 10px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4
                            }}
                            title="Deactivate requisition (pause hiring)"
                            onClick={() => toggleJobStatus(job.id)}
                          >
                            <PauseCircle size={13} />
                            <span>Deactivate</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{
                              fontSize: "0.75rem",
                              color: "#059669",
                              borderColor: "rgba(16, 185, 129, 0.4)",
                              background: "rgba(16, 185, 129, 0.06)",
                              padding: "5px 10px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontWeight: 600
                            }}
                            title="Activate requisition (publish live)"
                            onClick={() => toggleJobStatus(job.id)}
                          >
                            <PlayCircle size={13} />
                            <span>Activate</span>
                          </button>
                        )}

                        <button
                          className="btn btn-ghost btn-sm"
                          title="Edit Requisition Specs"
                          onClick={() => {
                            setEditingJob(job);
                            setIsJobModalOpen(true);
                          }}
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          title="View Candidates in Pipeline"
                          onClick={() => setAdminTab("pipeline")}
                        >
                          Pipeline &rarr;
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Floating Rich Hover Card with Full Job Information */}
        {hoveredJob && (
          <div
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
            style={{
              position: "fixed",
              top: popoverPos.placeAbove ? undefined : popoverPos.top,
              bottom: popoverPos.placeAbove ? window.innerHeight - popoverPos.top : undefined,
              left: popoverPos.left,
              width: 440,
              maxWidth: "calc(100vw - 32px)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 18px 40px rgba(28, 25, 23, 0.16), 0 4px 12px rgba(28, 25, 23, 0.08)",
              zIndex: 99999,
              padding: "18px 20px",
              pointerEvents: "auto",
              lineHeight: 1.4
            }}
          >
            {/* Header with Title & Status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span
                    className={`badge ${hoveredJob.status === "active" ? "badge-active" : "badge-paused"}`}
                    style={{ fontSize: "0.725rem", padding: "2px 8px" }}
                  >
                    {hoveredJob.status === "active" ? "Active Requisition" : "Deactive / Paused"}
                  </span>
                  <span style={{ fontSize: "0.725rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    ID: #{hoveredJob.id.replace("job-", "")}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  {hoveredJob.title}
                </h3>
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  background: "rgba(79, 70, 229, 0.08)",
                  padding: "3px 8px",
                  borderRadius: "var(--radius-sm)",
                  whiteSpace: "nowrap"
                }}
              >
                {hoveredJob.department}
              </span>
            </div>

            {/* Key Fields Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                background: "var(--bg-surface-elevated)",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                marginBottom: 12,
                fontSize: "0.8rem",
                border: "1px solid var(--border-subtle)"
              }}
            >
              {/* Location & Work Mode */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Location & Mode
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-primary)", fontWeight: 600 }}>
                  <MapPin size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {hoveredJob.location}
                  </span>
                </div>
                <span style={{ fontSize: "0.725rem", color: "var(--text-secondary)" }}>
                  {hoveredJob.workType} &bull; {hoveredJob.employmentType || "Full-time"}
                </span>
              </div>

              {/* CTC Band */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  CTC Compensation Band
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--primary)", fontWeight: 800, fontSize: "0.875rem" }}>
                  <IndianRupee size={13} />
                  <span>{hoveredJob.salary}</span>
                </div>
              </div>

              {/* Education Requirement */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Education Requirement
                </span>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 5, color: "var(--text-primary)", fontWeight: 600 }}>
                  <GraduationCap size={13} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.76rem", lineHeight: 1.3 }}>
                    {hoveredJob.education || "B.Tech / B.E. or Equivalent"}
                  </span>
                </div>
              </div>

              {/* Experience Required */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Experience Level
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-primary)", fontWeight: 600 }}>
                  <Clock size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <span>{hoveredJob.experienceLevel || "Senior (5-8 yrs)"}</span>
                </div>
              </div>

              {/* Notice Period */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Notice Preference
                </span>
                <span style={{ color: "#059669", fontWeight: 600, fontSize: "0.75rem" }}>
                  {hoveredJob.noticePeriodPreference || "Immediate or 30 Days Max"}
                </span>
              </div>

              {/* Agency Syndication */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Consultancy Syndication
                </span>
                <span style={{ color: hoveredJob.syndicateToAgencies ? "#7c3aed" : "var(--text-muted)", fontWeight: 600, fontSize: "0.75rem" }}>
                  {hoveredJob.syndicateToAgencies ? `${hoveredJob.agencyBounty || "₹75,000 Bounty"}` : "Direct Only"}
                </span>
              </div>
            </div>

            {/* Description snippet */}
            {hoveredJob.description && (
              <div style={{ marginBottom: 10 }}>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    margin: 0,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {hoveredJob.description}
                </p>
              </div>
            )}

            {/* Skills tags */}
            {hoveredJob.skills && hoveredJob.skills.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {hoveredJob.skills.slice(0, 5).map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.725rem",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-app)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Quick Action */}
            <div
              style={{
                paddingTop: 10,
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.75rem",
                color: "var(--text-muted)"
              }}
            >
              <span>Posted on {hoveredJob.postedDate} &bull; {hoveredJob.viewsCount || 0} views &bull; {hoveredJob.applicationsCount || 0} applicants</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: "0.75rem", padding: "3px 8px", color: "var(--primary)", fontWeight: 700 }}
                onClick={() => {
                  setEditingJob(hoveredJob);
                  setIsJobModalOpen(true);
                  setHoveredJob(null);
                }}
              >
                Edit Specs &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
