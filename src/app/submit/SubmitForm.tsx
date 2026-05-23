"use client";

import { useState, useTransition } from "react";
import { submitStory } from "./actions";

const categories = [
  "Family & Silence",
  "School & Work",
  "Identity & Belonging",
  "Men & Mental Health",
  "Faith & Mental Health",
  "Friendship",
  "Healing & Recovery",
  "Other"
];

export default function SubmitForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitStory(formData);
      if (result.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong.");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="submit-success">
        <h2>Thank you for sharing.</h2>
        <p>
          Your story has been received. Our team will review it and reach out if we publish
          or have questions.
        </p>
      </div>
    );
  }

  return (
    <form className="submit-form" onSubmit={handleSubmit}>
      <div className="admin-grid-2">
        <div className="admin-field">
          <label htmlFor="name">Your name <span style={{ color: "var(--muted)" }}>(optional)</span></label>
          <input id="name" name="name" type="text" placeholder="How you'd like to be credited" />
        </div>
        <div className="admin-field">
          <label htmlFor="email">Email <span style={{ color: "var(--muted)" }}>(optional)</span></label>
          <input id="email" name="email" type="email" placeholder="We'll only use this to reach you" />
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="title">Story title <span style={{ color: "var(--coral)" }}>*</span></label>
        <input id="title" name="title" type="text" required placeholder="Give your story a working title" />
      </div>

      <div className="admin-field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category">
          <option value="">Select a category (optional)</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="admin-field">
        <label htmlFor="story">Your story <span style={{ color: "var(--coral)" }}>*</span></label>
        <textarea
          id="story"
          name="story"
          required
          rows={12}
          placeholder="Write your story here. There is no minimum length — write as much or as little feels right."
        />
      </div>

      <div className="admin-field" style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <input id="consent" name="consent" type="checkbox" required style={{ marginTop: 3, width: "auto" }} />
        <label htmlFor="consent" style={{ fontWeight: 400, cursor: "pointer" }}>
          I agree to Behind the Reels using this story for editorial purposes. I understand I may
          be contacted before publication. <span style={{ color: "var(--coral)" }}>*</span>
        </label>
      </div>

      {status === "error" && (
        <p style={{ color: "var(--coral)", fontSize: 14 }}>{message}</p>
      )}

      <button className="btn-primary" type="submit" disabled={isPending} style={{ marginTop: 8 }}>
        {isPending ? "Submitting…" : "Submit my story"}
      </button>
    </form>
  );
}
