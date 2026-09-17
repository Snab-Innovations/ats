import React, { useState } from "react";
import { useAts } from "../context/AtsContext";
import {
  CalendarDays,
  Clock,
  Video,
  Plus,
  ExternalLink,
  CheckCircle,
  MessageCircle,
  X
} from "lucide-react";

export const InterviewScheduler = () => {
  const {
    interviews,
    candidates,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    schedulingCandidate,
    setSchedulingCandidate,
    scheduleInterview
  } = useAts();

  const [formData, setFormData] = useState({
    candidateId: "",
    round: "System Architecture & Low Latency Design",
    date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    time: "03:00 PM IST",
    interviewer: "Vikram Singhania (VP Engineering)",
    meetingLink: "https://meet.google.com/bs-arch-sync"
  });

  const handleOpenSchedule = (cand = null) => {
    if (cand) {
      setSchedulingCandidate(cand);
      setFormData((prev) => ({
        ...prev,
        candidateId: cand.id
      }));
    } else if (candidates.length > 0) {
      setSchedulingCandidate(candidates[0]);
      setFormData((prev) => ({
        ...prev,
        candidateId: candidates[0].id
      }));
    }
    setIsScheduleModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const candId = schedulingCandidate?.id || formData.candidateId;
    if (!candId) return;

    scheduleInterview(candId, {
      round: formData.round,
      date: formData.date,
      time: formData.time,
      interviewer: formData.interviewer,
      meetingLink: formData.meetingLink
    });

    setIsScheduleModalOpen(false);
  };

  const sendWhatsAppReminder = (item) => {
    const text = encodeURIComponent(
      `Hi ${item.candidateName}, this is a gentle reminder regarding your upcoming interview for the ${item.role} position (${item.round}) scheduled on ${item.date} at ${item.time}. Meeting link: ${item.meetingLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="admin-main">
      <header className="page-header">
        <div className="page-title-group">
          <h1>Interview Operations & Coordination</h1>
          <p>
            Coordinate technical coding rounds, system design evaluations, panel interviews, and candidate WhatsApp updates
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => handleOpenSchedule(null)}>
            <Plus size={16} />
            <span>Schedule New Interview Round</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* Upcoming interviews agenda */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: "1.1rem" }}>Confirmed Technical Rounds (IST)</h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                Automated calendar invitations & candidate WhatsApp reminder sync
              </p>
            </div>
            <span className="badge badge-active">{interviews.length} Confirmed</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {interviews.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "16px 20px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-md)",
                      background: "rgba(219, 39, 119, 0.1)",
                      color: "#db2777",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Video size={20} />
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {item.candidateName} &bull; <span style={{ color: "#db2777" }}>{item.round}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      Role: {item.role} &bull; Interviewer: <strong style={{ color: "var(--text-primary)" }}>{item.interviewer}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
                    <Clock size={15} />
                    <span>{item.date} at {item.time}</span>
                  </div>

                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <ExternalLink size={13} />
                    <span>Google Meet</span>
                  </a>

                  <button
                    className="btn btn-whatsapp btn-sm"
                    onClick={() => sendWhatsAppReminder(item)}
                    title="Send WhatsApp reminder to candidate"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Interview Modal */}
        {isScheduleModalOpen && (
          <div className="modal-overlay" onClick={() => setIsScheduleModalOpen(false)}>
            <div
              className="modal-content"
              style={{ maxWidth: 620 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CalendarDays size={20} color="var(--primary)" />
                  <h2 style={{ fontSize: "1.2rem" }}>Schedule Candidate Evaluation Round</h2>
                </div>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Candidate selection */}
                  <div className="form-group">
                    <label className="form-label">Candidate *</label>
                    <select
                      className="form-select"
                      value={schedulingCandidate?.id || formData.candidateId}
                      onChange={(e) => {
                        const cand = candidates.find((c) => c.id === e.target.value);
                        setSchedulingCandidate(cand);
                        setFormData({ ...formData, candidateId: e.target.value });
                      }}
                    >
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.role} - {c.source})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interview Round */}
                  <div className="form-group">
                    <label className="form-label">Evaluation Format / Round</label>
                    <select
                      className="form-select"
                      value={formData.round}
                      onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                    >
                      <option value="Initial Screening & Overview">Recruiter Screen & Notice Verification</option>
                      <option value="System Architecture & Low Latency Design">System Architecture & Low Latency Design</option>
                      <option value="Live DSA & Machine Coding Round">Live DSA & Machine Coding Round</option>
                      <option value="Frontend Architecture & Deep Dive">Frontend Architecture & Deep Dive</option>
                      <option value="Hiring Manager & Startup Alignment">Hiring Manager & Startup Alignment</option>
                      <option value="Founder / Leadership 1:1">Founder / Leadership 1:1</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        required
                        className="form-input"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Time & Timezone (IST)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 03:00 PM IST"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Interviewer(s)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.interviewer}
                      onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Google Meet / Zoom Meeting URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    />
                  </div>

                  <div
                    style={{
                      background: "rgba(79, 70, 229, 0.06)",
                      border: "1px solid rgba(79, 70, 229, 0.2)",
                      borderRadius: "var(--radius-md)",
                      padding: "12px 14px",
                      fontSize: "0.8rem",
                      color: "var(--text-primary)"
                    }}
                  >
                    <strong>Automated Calendar & WhatsApp Sync:</strong> Google Calendar invite with Google Meet link and automated candidate WhatsApp confirmation will be triggered upon scheduling.
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsScheduleModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle size={15} />
                    <span>Confirm & Dispatch Invite</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
