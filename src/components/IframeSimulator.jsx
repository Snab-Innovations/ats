import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import { PublicCareerPage } from "./PublicCareerPage";
import {
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  Check,
  Code2,
  Lock,
  RotateCw,
  Sparkles
} from "lucide-react";

export const IframeSimulator = () => {
  const { company, careerSettings, setActiveRole } = useAts();

  const [deviceWidth, setDeviceWidth] = useState("100%");
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://experthire.io/embed/${company.domain.replace(/\./g, "-")}`;
  const iframeSnippet = `<iframe src="${embedUrl}" width="100%" height="760px" frameborder="0" style="border-radius:12px; border:none; width:100%;" title="${careerSettings.companyName} Careers"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: "var(--bg-app)", minHeight: "100vh", padding: "20px 24px 60px" }}>
      {/* Top Demo Bar */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="kpi-icon-wrap" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", width: 32, height: 32 }}>
              <Code2 size={18} />
            </div>
            <h1 style={{ fontSize: "1.3rem" }}>Website Iframe Embed Simulator (Day Mode)</h1>
          </div>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Demonstrating how the ExpertHire career widget embeds seamlessly into a corporate website in India
          </p>
        </div>

        {/* Device controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-full)",
              padding: "3px"
            }}
          >
            <button
              className={`demo-role-btn ${deviceWidth === "100%" ? "active" : ""}`}
              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
              onClick={() => setDeviceWidth("100%")}
              title="Desktop 100% Width"
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button
              className={`demo-role-btn ${deviceWidth === "768px" ? "active" : ""}`}
              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
              onClick={() => setDeviceWidth("768px")}
              title="Tablet 768px Width"
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
            <button
              className={`demo-role-btn ${deviceWidth === "430px" ? "active" : ""}`}
              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
              onClick={() => setDeviceWidth("430px")}
              title="Mobile 430px Width"
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied HTML!" : "Copy Iframe HTML"}</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveRole("company_admin")}
          >
            &larr; Return to Employer ATS
          </button>
        </div>
      </div>

      {/* Simulated Browser Frame */}
      <div
        className="host-browser-frame"
        style={{
          width: deviceWidth,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        {/* Browser Address Bar */}
        <div className="browser-bar">
          <div className="browser-dots">
            <div className="browser-dot dot-red"></div>
            <div className="browser-dot dot-yellow"></div>
            <div className="browser-dot dot-green"></div>
          </div>

          <div className="browser-address-bar">
            <Lock size={12} color="#059669" />
            <span>https://www.{company.domain}/careers</span>
          </div>

          <RotateCw size={13} color="#94a3b8" style={{ cursor: "pointer" }} />
        </div>

        {/* Corporate Website Content */}
        <div style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}>
          {/* Host Navbar */}
          <nav className="host-company-navbar" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "#fff",
                  fontSize: "0.85rem"
                }}
              >
                BS
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {careerSettings.companyName}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <span>Cloud Infrastructure</span>
              <span>AI Core</span>
              <span>Enterprise Solutions</span>
              <span style={{ color: "var(--primary)", fontWeight: 700 }}>Careers (India)</span>
              <span>Bengaluru HQ</span>
            </div>

            <button className="btn btn-primary btn-sm" style={{ padding: "6px 14px" }}>
              Sign In
            </button>
          </nav>

          {/* Host Explanation Banner */}
          <div
            style={{
              padding: "16px 32px",
              background: "rgba(79, 70, 229, 0.05)",
              borderBottom: "1px solid rgba(79, 70, 229, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: "0.825rem", color: "var(--text-primary)" }}>
                <strong>Zero-Collision Iframe Widget:</strong> The embedded ExpertHire ATS runs within an isolated sandbox with custom fonts and colors matching your brand.
              </span>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <code>&lt;iframe src="{embedUrl}" ...&gt;</code>
            </div>
          </div>

          {/* Embedded ATS Content */}
          <div
            style={{
              padding: "24px",
              background: "var(--bg-app)"
            }}
          >
            <div
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: careerSettings.iframeConfig?.borderRadius || "12px",
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
                background: "var(--bg-surface)"
              }}
            >
              <PublicCareerPage isEmbedded={true} />
            </div>
          </div>

          {/* Host Footer */}
          <footer
            style={{
              padding: "28px",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#64748b"
            }}
          >
            &copy; 2026 {careerSettings.companyName} Technologies Pvt. Ltd. Bengaluru & Mumbai. Powered by ExpertHire ATS Engine.
          </footer>
        </div>
      </div>
    </div>
  );
};
