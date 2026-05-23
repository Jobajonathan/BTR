"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "../actions";

const INITIAL: { ok: boolean; error?: string } = { ok: false };

export default function NewsletterForm() {
  const [state, action, isPending] = useActionState(subscribeToNewsletter, INITIAL);

  if (state.ok) {
    return (
      <div style={{
        background: "var(--green-soft)",
        border: "1px solid var(--green)",
        borderRadius: 10,
        padding: "28px 32px",
        textAlign: "center",
        maxWidth: 480
      }}>
        <p style={{ fontSize: 28 }}>🎉</p>
        <h3 style={{ fontSize: 22, fontWeight: 800, margin: "8px 0 6px", color: "var(--green)" }}>
          You&apos;re in!
        </h3>
        <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.55 }}>
          Thank you for joining. We&apos;ll send stories, resources, and notes from the BTR
          community.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="newsletter-form">
      <div className="newsletter-field">
        <label htmlFor="nl-name">Your name</label>
        <input
          type="text"
          id="nl-name"
          name="name"
          placeholder="First name"
          autoComplete="given-name"
        />
      </div>
      <div className="newsletter-field">
        <label htmlFor="nl-email">Email address <span style={{ color: "var(--green)" }}>*</span></label>
        <input
          type="email"
          id="nl-email"
          name="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>
      <input type="hidden" name="source" value="newsletter-page" />
      {state.error && (
        <p style={{ color: "#c0392b", fontSize: 14, margin: "4px 0 0" }}>{state.error}</p>
      )}
      <button type="submit" className="button primary" disabled={isPending} style={{ marginTop: 4 }}>
        {isPending ? "Subscribing…" : "Subscribe — it's free"}
      </button>
      <p style={{ fontSize: 12, color: "var(--muted)", margin: "10px 0 0" }}>
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
