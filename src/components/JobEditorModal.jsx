import React, { useState, useEffect } from "react";
import { useAts } from "../context/AtsContext";
import { X, Briefcase, IndianRupee, Share2, Plus, Trash2, Check, Clock, PlayCircle, PauseCircle } from "lucide-react";

export const JobEditorModal = () => {
  const { isJobModalOpen, setIsJobModalOpen, editingJob, addJob, updateJob, company } = useAts();

  const [formData, setFormData] = useState({
    title: "",
    department: "Backend Engineering",
    location: "Bengaluru (HSR Layout) / Hybrid",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior (5-8 yrs)",
    education: "B.Tech / B.E. in CS/IT or Equivalent",
    salary: "₹30 - ₹45 LPA + ESOPs",
    status: "active",
    noticePeriodPreference: "Immediate or 30 Days Max",
    description: "",
    requirements: ["", "", ""],
    benefits: [
      "Comprehensive ₹10 Lakhs Family & Dependent Parents Medical Cover",
      "Flexible Remote/Hybrid Hours with Catered Office Lunches",
      "Lucrative ESOP Grants with Guaranteed Annual Buyback"
    ],
    screeningQuestions: [
      "What is your Current and Expected CTC in LPA?",
      "What is your official Notice Period and can it be bought out?",
      "Describe a distributed systems or scaling challenge you solved in production."
    ],
    syndicateToAgencies: true,
    agencyBounty: "₹75,000 Cash Bounty",
    agencyCommissionPercent: "8.33% (1 Month CTC)"
  });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        ...editingJob,
        education: editingJob.education || "B.Tech / B.E. in CS/IT or Equivalent",
        requirements: editingJob.requirements || [""],
        benefits: editingJob.benefits || [""],
        screeningQuestions: editingJob.screeningQuestions || [""]
      });
    } else {
      setFormData({
        title: "",
        department: "Backend Engineering",
        location: "Bengaluru (HSR Layout) / Hybrid",
        workType: "Hybrid",
        employmentType: "Full-time",
        experienceLevel: "Senior (5-8 yrs)",
        education: "B.Tech / B.E. in CS/IT or Equivalent",
        salary: "₹30 - ₹45 LPA + ESOPs",
        status: "active",
        noticePeriodPreference: "Immediate or 30 Days Max",
        description: "We are seeking a high-agency engineer to build high-scale distributed systems and developer infrastructure for digital India.",
        requirements: [
          "5+ years of production experience in Go, Java, or Node.js with distributed caching",
          "Experience with Kafka, PostgreSQL, Redis Cluster, and Docker/Kubernetes",
          "Strong computer science fundamentals and asynchronous communication"
        ],
        benefits: [
          "Comprehensive ₹10 Lakhs Family & Dependent Parents Medical Cover",
          "₹60,000 Annual Ergonomic Home Office & Tech Allowance",
          "Annual Goa/Manali Engineering Offsite and Wellness Leave"
        ],
        screeningQuestions: [
          "What is your Current and Expected CTC in LPA?",
          "What is your official Notice Period and can it be bought out?",
          "Describe a distributed systems or scaling challenge you solved in production."
        ],
        syndicateToAgencies: true,
        agencyBounty: "₹75,000 Cash Bounty",
        agencyCommissionPercent: "8.33% (1 Month CTC)"
      });
    }
  }, [editingJob, isJobModalOpen]);

  if (!isJobModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingJob) {
      updateJob(editingJob.id, formData);
    } else {
      addJob({ ...formData, companyId: company?.id || "comp-mu5rn6mu" });
    }
    setIsJobModalOpen(false);
  };

  const addRequirement = () => {
    setFormData((prev) => ({ ...prev, requirements: [...prev.requirements, ""] }));
  };

  const updateRequirement = (index, value) => {
    const updated = [...formData.requirements];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, requirements: updated }));
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal-overlay" onClick={() => setIsJobModalOpen(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: 760 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="kpi-icon-wrap" style={{ width: 32, height: 32 }}>
              <Briefcase size={16} />
            </div>
            <h2 style={{ fontSize: "1.2rem" }}>
              {editingJob ? `Edit Job Opening: ${editingJob.title}` : "Create & Syndicate New Job Opening (India)"}
            </h2>
          </div>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setIsJobModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Job Title & Department */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Lead Distributed Systems Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Backend Engineering">Backend Engineering</option>
                  <option value="Frontend Platform">Frontend Platform</option>
                  <option value="AI Research & Core">AI Research & Core</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Product Management">Product Management</option>
                  <option value="DevRel & Solutions">DevRel & Solutions</option>
                </select>
              </div>
            </div>

            {/* Indian Location, Work Type, Compensation in ₹ */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location (Indian Tech Hub)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bengaluru (HSR Layout)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Type</label>
                <select
                  className="form-select"
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                >
                  <option value="Hybrid">Hybrid (2-3 days office)</option>
                  <option value="Remote">Pan-India Remote</option>
                  <option value="Onsite">In-Office (Bengaluru)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target CTC Band (₹ LPA)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ₹32 - ₹48 LPA + ESOPs"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Experience & Education Qualification */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience Required</label>
                <select
                  className="form-select"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                >
                  <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                  <option value="Lead / Staff (8-12 yrs)">Lead / Staff (8-12 yrs)</option>
                  <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                  <option value="Associate / Junior (1-3 yrs)">Associate / Junior (1-3 yrs)</option>
                  <option value="Principal / Director (12+ yrs)">Principal / Director (12+ yrs)</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Education / Degree Requirement *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <select
                    className="form-select"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  >
                    <option value="B.Tech / B.E. in CS/IT or Equivalent">B.Tech / B.E. in CS/IT or Equivalent</option>
                    <option value="Tier-1 Engineering College (IIT / NIT / BITS / IIIT)">Tier-1 Engineering College (IIT / NIT / BITS / IIIT)</option>
                    <option value="M.Tech / M.S. in Computer Science / AI">M.Tech / M.S. in Computer Science / AI</option>
                    <option value="BCA / MCA / B.Sc Computer Science">BCA / MCA / B.Sc Computer Science</option>
                    <option value="MBA / PGDM from Tier-1 B-School (IIM / XLRI / ISB)">MBA / PGDM from Tier-1 B-School (IIM / XLRI / ISB)</option>
                    <option value="Any Graduate / Equivalent Practical Experience">Any Graduate / Equivalent Practical Experience</option>
                  </select>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Or type custom degree requirement..."
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    style={{ fontSize: "0.825rem", padding: "6px 10px" }}
                  />
                </div>
              </div>
            </div>

            {/* Notice Period Preference */}
            <div className="form-group">
              <label className="form-label">Notice Period Preference</label>
              <select
                className="form-select"
                value={formData.noticePeriodPreference}
                onChange={(e) => setFormData({ ...formData, noticePeriodPreference: e.target.value })}
              >
                <option value="Immediate or 30 Days Max">Immediate or 30 Days Max (Recommended)</option>
                <option value="Serving Notice Period only">Serving Notice Period only (Fast-track)</option>
                <option value="Notice Buyout Available">Notice Buyout Available (Up to 60 days)</option>
                <option value="Flexible">Flexible for Exceptional Candidates</option>
              </select>
            </div>

            {/* Requisition Status: Active or Deactive */}
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                padding: "14px 18px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                marginBottom: 16
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="form-label" style={{ marginBottom: 0 }}>
                  Requisition Status
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: formData.status === "active" ? "#059669" : "#d97706"
                  }}
                >
                  {formData.status === "active" ? "Active (Accepting Applications)" : "Deactive / Paused"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${formData.status === "active" ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  onClick={() => setFormData({ ...formData, status: "active" })}
                >
                  <PlayCircle size={14} />
                  <span>Active (Live)</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${formData.status !== "active" ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  onClick={() => setFormData({ ...formData, status: "inactive" })}
                >
                  <PauseCircle size={14} />
                  <span>Deactive (Paused)</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Role Overview & Tech Stack</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe role impact, distributed architecture, and stack..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Requirements */}
            <div className="form-group">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Qualifications & Requirements
                </label>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: "0.75rem", color: "var(--primary)" }}
                  onClick={addRequirement}
                >
                  <Plus size={13} /> Add Requirement
                </button>
              </div>

              {formData.requirements.map((req, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`Requirement #${idx + 1}`}
                    value={req}
                    onChange={(e) => updateRequirement(idx, e.target.value)}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      onClick={() => removeRequirement(idx)}
                    >
                      <Trash2 size={14} color="#dc2626" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Indian Recruitment Consultancy Syndication */}
            <div
              style={{
                background: "rgba(124, 58, 237, 0.05)",
                border: "1px solid rgba(124, 58, 237, 0.25)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                marginTop: 20
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Share2 size={18} color="#7c3aed" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Recruitment Consultancy Syndication (Authorized Partner Agencies)
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      Dispatches requisition to certified Indian headhunters with placement bounty
                    </div>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
                  onClick={() =>
                    setFormData({ ...formData, syndicateToAgencies: !formData.syndicateToAgencies })
                  }
                >
                  <div
                    style={{
                      width: 38,
                      height: 22,
                      borderRadius: 12,
                      background: formData.syndicateToAgencies ? "var(--primary)" : "var(--border-medium)",
                      position: "relative",
                      transition: "background 0.2s ease"
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
                        left: formData.syndicateToAgencies ? 19 : 3,
                        transition: "left 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    {formData.syndicateToAgencies ? "Send to Agency: ON (Visible)" : "Send to Agency: OFF (Hidden)"}
                  </span>
                </div>
              </div>

              {formData.syndicateToAgencies && (
                <div className="form-row" style={{ marginTop: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>
                      Placement Bounty (₹ INR)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ₹75,000 Cash Bounty"
                      value={formData.agencyBounty}
                      onChange={(e) => setFormData({ ...formData, agencyBounty: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>
                      Standard Agency Placement Fee
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 8.33% (1 Month CTC)"
                      value={formData.agencyCommissionPercent}
                      onChange={(e) =>
                        setFormData({ ...formData, agencyCommissionPercent: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsJobModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingJob ? "Save Changes" : "Publish & Syndicate Job"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
