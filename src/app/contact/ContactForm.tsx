"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "./actions";

const INQUIRY_TYPES = [
  "School / Campus partnership",
  "Corporate / NGO sponsorship",
  "Media / Content collaboration",
  "Community outreach",
  "General enquiry",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organisation: "",
    inquiry_type: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [, startTransition] = useTransition();

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    startTransition(async () => {
      const result = await submitContactForm(form);
      if (result.error) {
        setStatus("error");
        setErrorMsg(result.error);
      } else {
        setStatus("sent");
      }
    });
  }

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "64px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Message received!</h2>
        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
          Thank you for reaching out. We will get back to you at <strong>{form.email}</strong> as
          soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {status === "error" && (
        <div className="alert alert-error">{errorMsg || "Something went wrong. Please try again."}</div>
      )}

      <div className="admin-grid-2" style={{ gap: 20 }}>
        <div className="contact-field">
          <label>Full name <span style={{ color: "var(--coral)" }}>*</span></label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div className="contact-field">
          <label>Email address <span style={{ color: "var(--coral)" }}>*</span></label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="admin-grid-2" style={{ gap: 20 }}>
        <div className="contact-field">
          <label>Organisation <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
          <input
            type="text"
            value={form.organisation}
            onChange={(e) => set("organisation", e.target.value)}
            placeholder="School, company, NGO…"
          />
        </div>
        <div className="contact-field">
          <label>Type of enquiry <span style={{ color: "var(--coral)" }}>*</span></label>
          <select
            value={form.inquiry_type}
            onChange={(e) => set("inquiry_type", e.target.value)}
            required
          >
            <option value="">Select one…</option>
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="contact-field">
        <label>Message <span style={{ color: "var(--coral)" }}>*</span></label>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us about your idea, project, or question…"
          rows={6}
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="button primary"
          disabled={status === "sending"}
          style={{ minWidth: 180 }}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
