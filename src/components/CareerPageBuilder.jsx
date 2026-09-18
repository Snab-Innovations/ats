import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import {
  Palette,
  Code2,
  Copy,
  Check,
  Eye,
  Plus,
  Trash2,
  MonitorPlay,
  IndianRupee,
  Sparkles
} from "lucide-react";

export const CareerPageBuilder = () => {
  const {
    careerSettings,
    updateCareerSettings,
    setActiveRole,
    company,
    jobs
  } = useAts();

  const [copied, setCopied] = useState(false);
  const [newPerk, setNewPerk] = useState("");

  const embedUrl = `https://experthire.io/embed/${company.domain.replace(/\./g, "-")}`;
  const iframeSnippet = `<iframe
  src="${embedUrl}"
  width="${careerSettings.iframeConfig?.width || "100%"}"
  height="${careerSettings.iframeConfig?.minHeight || "760px"}"
  frameborder="0"
  scrolling="auto"
  style="border-radius: ${careerSettings.iframeConfig?.borderRadius || "12px"}; border: none; width: 100%; min-height: 720px; box-shadow: 0 10px 30px rgba(0,0,0,0.06);"
  title="${careerSettings.companyName} India Careers"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPerk = (e) => {
    e.preventDefault();
    if (!newPerk.trim()) return;
    updateCareerSettings({
      perks: [...(careerSettings.perks || []), newPerk.trim()]
    });
    setNewPerk("");
  };

  const handleRemovePerk = (index) => {
    updateCareerSettings({
      perks: careerSettings.perks.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="admin-main">
      <header className="page-header">
        <div className="page-title-group">
          <h1>Career Portal Customizer & Iframe Engine</h1>
          <p>
            White-label your company's Indian career portal and generate ready-to-embed responsive iframes
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setActiveRole("public_careers")}
          >
            <Eye size={15} />
            <span>Open Standalone Portal</span>
          </button>
          <button
            className="btn btn-accent"
            onClick={() => setActiveRole("iframe_simulator")}
          >
            <MonitorPlay size={15} />
            <span>Launch Iframe Simulator</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
          {/* Left Column: Iframe Generator & Customizer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Embed Code Generation Card */}
            <div className="card" style={{ border: "1px solid rgba(2, 132, 199, 0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Code2 size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: "1.05rem" }}>Embeddable Iframe Code</h3>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied Snippet!" : "Copy Embed HTML"}</span>
                </button>
              </div>

              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                Copy and paste this snippet into your corporate website (WordPress, Webflow, Next.js, or React app):
              </p>

              <div className="code-box" style={{ maxHeight: 180, overflowY: "auto" }}>
                <pre style={{ margin: 0, fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
                  {iframeSnippet}
                </pre>
              </div>

              {/* Iframe Configuration Toggles */}
              <div
                style={{
                  marginTop: 16,
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-surface-elevated)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12
                }}
              >
                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Theme Mode</label>
                  <select
                    className="form-select"
                    style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                    value={careerSettings.iframeConfig?.theme || "light"}
                    onChange={(e) =>
                      updateCareerSettings({
                        iframeConfig: { ...careerSettings.iframeConfig, theme: e.target.value }
                      })
                    }
                  >
                    <option value="light">Day Mode (Clean White)</option>
                    <option value="dark">Dark Mode</option>
                    <option value="auto">System Auto</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Border Radius</label>
                  <select
                    className="form-select"
                    style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                    value={careerSettings.iframeConfig?.borderRadius || "12px"}
                    onChange={(e) =>
                      updateCareerSettings({
                        iframeConfig: { ...careerSettings.iframeConfig, borderRadius: e.target.value }
                      })
                    }
                  >
                    <option value="0px">Sharp Corners (0px)</option>
                    <option value="8px">Subtle (8px)</option>
                    <option value="12px">Rounded (12px)</option>
                    <option value="20px">Curved Modern (20px)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Brand Customizer */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Palette size={18} color="var(--primary)" />
                <h3 style={{ fontSize: "1.05rem" }}>Branding, Copy & Culture</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerSettings.companyName}
                  onChange={(e) => updateCareerSettings({ companyName: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Primary Brand Color</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="color"
                      value={careerSettings.brandColor || "#4f46e5"}
                      onChange={(e) => updateCareerSettings({ brandColor: e.target.value })}
                      style={{ width: 38, height: 38, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={careerSettings.brandColor || "#4f46e5"}
                      onChange={(e) => updateCareerSettings({ brandColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Accent Highlight Color</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="color"
                      value={careerSettings.accentColor || "#0284c7"}
                      onChange={(e) => updateCareerSettings({ accentColor: e.target.value })}
                      style={{ width: 38, height: 38, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={careerSettings.accentColor || "#0284c7"}
                      onChange={(e) => updateCareerSettings({ accentColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hero Headline</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerSettings.heroHeadline}
                  onChange={(e) => updateCareerSettings({ heroHeadline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={careerSettings.heroDescription}
                  onChange={(e) => updateCareerSettings({ heroDescription: e.target.value })}
                />
              </div>

              {/* Perks List */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company Perks & Benefits (India)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                  {careerSettings.perks?.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-surface-elevated)",
                        fontSize: "0.825rem"
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>&bull; {p}</span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        style={{ padding: 4 }}
                        onClick={() => handleRemovePerk(idx)}
                      >
                        <Trash2 size={13} color="#dc2626" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddPerk} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="e.g. Annual Goa Team Retreat, PF match..."
                    className="form-input"
                    value={newPerk}
                    onChange={(e) => setNewPerk(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                    <Plus size={14} /> Add
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div>
            <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Eye size={18} color="#059669" />
                  <h3 style={{ fontSize: "1.05rem" }}>Live Career Site Preview (Day Mode)</h3>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveRole("iframe_simulator")}
                >
                  <span>See Embedded View</span>
                </button>
              </div>

              <div
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: careerSettings.iframeConfig?.borderRadius || "12px",
                  overflow: "hidden",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 700,
                  overflowY: "auto",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {/* Simulated Mini Hero with Cover Image & Custom Logo */}
                <div
                  style={{
                    position: "relative",
                    minHeight: 140,
                    overflow: "hidden",
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "28px 20px 20px",
                    background: "var(--bg-surface)"
                  }}
                >
                  {(company.coverBannerUrl || company.coverImage) && (
                    <img
                      src={company.coverBannerUrl || company.coverImage}
                      alt="Cover"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.2,
                        filter: "blur(0.5px)"
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(247, 245, 240, 0.6) 0%, var(--bg-surface) 100%)"
                    }}
                  />

                  <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: company.brandColor || careerSettings.brandColor || "#4f46e5",
                        margin: "0 auto 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        color: "#fff",
                        fontSize: "0.95rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        overflow: "hidden"
                      }}
                    >
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                      ) : (
                        company.name ? company.name.substring(0, 2).toUpperCase() : "TS"
                      )}
                    </div>

                    <h3 style={{ fontSize: "1.2rem", marginBottom: 6, fontWeight: 800, color: "var(--text-primary)" }}>
                      {careerSettings.heroHeadline || `Careers at ${company.name}`}
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 12px" }}>
                      {careerSettings.heroDescription || company.tagline}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                    {careerSettings.perks?.slice(0, 3).map((p, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.7rem",
                          background: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border-subtle)",
                          padding: "3px 8px",
                          borderRadius: 9999,
                          fontWeight: 600
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated Job Postings List */}
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                      Open Positions ({jobs.filter((j) => j.status === "active").length})
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                      {(company?.domain || "company.com") + "/careers"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {jobs.filter((j) => j.status === "active").slice(0, 3).map((j) => (
                      <div
                        key={j.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 8,
                          background: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border-subtle)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                            {j.title}
                          </div>
                          <div style={{ fontSize: "0.725rem", color: "var(--text-secondary)", marginTop: 2 }}>
                            {j.location} &bull; <strong style={{ color: "var(--primary)" }}>{j.salary}</strong>
                          </div>
                        </div>

                        <button
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: "0.72rem", padding: "4px 10px" }}
                          onClick={() => setActiveRole("public_careers")}
                        >
                          Apply Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
