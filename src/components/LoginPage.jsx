import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAts } from "../context/AtsContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export const LoginPage = () => {
  const { login, currentUser } = useAts();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If session is already active, auto-route to designated workspace
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "super_admin") {
        navigate("/super-admin", { replace: true });
      } else if (currentUser.role === "agency_portal") {
        navigate("/agency-portal", { replace: true });
      } else {
        navigate("/employer-dashboard", { replace: true });
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your corporate email or portal ID.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsSubmitting(false);
      if (res && res.success) {
        const dest =
          res.user?.portalRoute ||
          (res.user?.role === "super_admin"
            ? "/super-admin"
            : res.user?.role === "agency_portal"
            ? "/agency-portal"
            : "/employer-dashboard");
        navigate(dest, { replace: true });
      } else {
        setErrorMsg(res?.message || "Invalid corporate credentials. Please check your email and password.");
      }
    }, 300);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Please contact your organization's IT or Workspace Administrator to reset your credentials.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-app)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          height: 60,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          zIndex: 10
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/logo-exhier.png"
            alt="ExpertHier"
            style={{
              height: 48,
              width: "auto",
              objectFit: "contain",
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
              mixBlendMode: "multiply",
              display: "block"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/career-site")}
            style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}
          >
            <span>ExpertHire Jobs Portal</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </header>

      {/* Main Login Body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
          zIndex: 10
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "var(--bg-surface)",
            borderRadius: 14,
            border: "1px solid var(--border-medium)",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
            padding: "36px 32px"
          }}
        >
          {/* Card Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Sign In to Your Workspace
            </h1>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
              Enter your corporate credentials to access your portal
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#ef4444",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 18
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Production Login Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email / Username Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "var(--text-primary)"
                }}
              >
                Corporate Email or ID
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none"
                  }}
                />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="name@company.com or Admin ID"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 36px",
                    borderRadius: 8,
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-app)",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-primary)"
                  }}
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={handleForgotPassword}
                  style={{
                    fontSize: "0.74rem",
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: 500
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none"
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 36px",
                    borderRadius: 8,
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-app)",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: 4
                  }}
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "var(--text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "var(--primary)" }}
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: "100%",
                height: 42,
                fontWeight: 700,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 6,
                background: "#4f46e5",
                border: "none"
              }}
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer
        style={{
          padding: "16px 24px",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)"
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} ExpertHire ATS. All rights reserved.</span>
      </footer>
    </div>
  );
};

