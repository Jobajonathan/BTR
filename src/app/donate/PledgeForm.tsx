"use client";

import { useState, useTransition } from "react";
import { submitPledge } from "./actions";

const FREQUENCIES = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "annually", label: "Annually" },
];

export default function PledgeForm({ currency }: { currency: string }) {
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [, startTransition] = useTransition();

  const presetAmounts = [5, 10, 25, 50];
  const finalAmount = amount === "custom" ? parseFloat(customAmount) : (amount as number);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) return;
    setStatus("sending");
    startTransition(async () => {
      const result = await submitPledge({ name, email, amount: finalAmount, currency, frequency, message, honeypot });
      if (result.error) { setStatus("error"); setErrorMsg(result.error); }
      else setStatus("sent");
    });
  }

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h3 style={{ fontSize: 24, marginBottom: 8 }}>Pledge registered!</h3>
        <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto" }}>
          Thank you, <strong>{name}</strong>. We&apos;ve recorded your pledge of <strong>{currency}{finalAmount}/{frequency}</strong>
          {" "}and will send impact reports to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {status === "error" && <div className="alert alert-error">{errorMsg}</div>}

      {/* Honeypot */}
      <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <div className="admin-field">
        <label style={{ fontWeight: 600 }}>Pledge amount ({currency})</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
          {presetAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              style={{
                border: `2px solid ${amount === a ? "var(--green)" : "var(--line)"}`,
                background: amount === a ? "var(--green)" : "var(--white)",
                color: amount === a ? "var(--white)" : "var(--body)",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {currency}{a}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount("custom")}
            style={{
              border: `2px solid ${amount === "custom" ? "var(--green)" : "var(--line)"}`,
              background: amount === "custom" ? "var(--green)" : "var(--white)",
              color: amount === "custom" ? "var(--white)" : "var(--body)",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Custom
          </button>
        </div>
        {amount === "custom" && (
          <input
            type="number"
            min={1}
            step="0.01"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder={`Enter amount (${currency})`}
            style={{ marginTop: 10 }}
            autoFocus
            required
          />
        )}
      </div>

      <div className="admin-field">
        <label style={{ fontWeight: 600 }}>How often?</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFrequency(f.id)}
              style={{
                border: `2px solid ${frequency === f.id ? "var(--green)" : "var(--line)"}`,
                background: frequency === f.id ? "var(--green)" : "var(--white)",
                color: frequency === f.id ? "var(--white)" : "var(--body)",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="contact-field">
          <label>Full name <span style={{ color: "var(--coral)" }}>*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        </div>
        <div className="contact-field">
          <label>Email <span style={{ color: "var(--coral)" }}>*</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
      </div>

      <div className="contact-field">
        <label>Message (optional)</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Why does this work matter to you?" rows={3} />
      </div>

      <button
        type="submit"
        className="button primary"
        disabled={status === "sending" || !finalAmount || !name || !email}
        style={{ fontSize: 16, padding: "16px 32px", width: "100%" }}
      >
        {status === "sending" ? "Registering pledge…" : `Pledge ${currency}${finalAmount || "…"}/${frequency}`}
      </button>

      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
        This registers your intent to give. We will send you a reminder and bank details before each scheduled gift.
      </p>
    </form>
  );
}
