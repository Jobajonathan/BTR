"use client";

import { useState, useTransition } from "react";
import { submitVolunteerForm } from "./actions";

const AVAILABILITY_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Evenings only",
  "Flexible",
  "Once-off events only",
];

export default function VolunteerForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "",
    skills: "", availability: "", motivation: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [, startTransition] = useTransition();

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.motivation) return;
    setStatus("sending");
    startTransition(async () => {
      const result = await submitVolunteerForm(form);
      if (result.error) { setStatus("error"); setErrorMsg(result.error); }
      else setStatus("sent");
    });
  }

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "64px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Application received!</h2>
        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
          Thank you, <strong>{form.name}</strong>. We will be in touch at <strong>{form.email}</strong> when there is an opportunity that fits your skills.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {status === "error" && (
        <div className="alert alert-error">{errorMsg || "Something went wrong. Please try again."}</div>
      )}

      <div className="admin-grid-2" style={{ gap: 20 }}>
        <div className="contact-field">
          <label>Full name <span style={{ color: "var(--coral)" }}>*</span></label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" required />
        </div>
        <div className="contact-field">
          <label>Email address <span style={{ color: "var(--coral)" }}>*</span></label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" required />
        </div>
      </div>

      <div className="admin-grid-2" style={{ gap: 20 }}>
        <div className="contact-field">
          <label>Phone number <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
          <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" />
        </div>
        <div className="contact-field">
          <label>City / Location</label>
          <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Lagos, Nairobi, London" />
        </div>
      </div>

      <div className="contact-field">
        <label>Skills & experience</label>
        <textarea value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="e.g. Social media, graphic design, counselling, event coordination, writing…" rows={3} />
      </div>

      <div className="contact-field">
        <label>Availability</label>
        <select value={form.availability} onChange={(e) => set("availability", e.target.value)}>
          <option value="">Select one…</option>
          {AVAILABILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className="contact-field">
        <label>Why do you want to volunteer? <span style={{ color: "var(--coral)" }}>*</span></label>
        <textarea value={form.motivation} onChange={(e) => set("motivation", e.target.value)} placeholder="Tell us what draws you to this cause and how you hope to contribute…" rows={5} required />
      </div>

      <div>
        <button type="submit" className="button primary" disabled={status === "sending"} style={{ minWidth: 200 }}>
          {status === "sending" ? "Submitting…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}
