"use client";

import { useState, useTransition } from "react";
import { updateSubmissionStatus } from "./actions";

type Submission = {
  id: string;
  name?: string;
  email?: string;
  title: string;
  category?: string;
  story: string;
  status: string;
  consent: boolean;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f5c84b",
  approved: "#1f6b4a",
  rejected: "#d86f52"
};

export default function SubmissionsClient({ submissions }: { submissions: Submission[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function setStatus(id: string, status: string) {
    startTransition(async () => {
      await updateSubmissionStatus(id, status);
      window.location.reload();
    });
  }

  return (
    <div className="admin-card">
      <p className="admin-card-title">
        Submitted stories ({submissions.length})
      </p>
      {submissions.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>No submissions yet.</p>
      )}
      <table className="admin-table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Date</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <>
              <tr key={s.id}>
                <td>
                  <strong
                    style={{ cursor: "pointer", color: "var(--green)" }}
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  >
                    {s.title}
                  </strong>
                </td>
                <td style={{ fontSize: 13 }}>
                  {s.name || <span style={{ color: "var(--muted)" }}>Anonymous</span>}
                  {s.email && (
                    <span style={{ display: "block", color: "var(--muted)", fontSize: 12 }}>
                      {s.email}
                    </span>
                  )}
                </td>
                <td style={{ fontSize: 13 }}>{s.category || "—"}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>
                  {new Date(s.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </td>
                <td>
                  <span
                    style={{
                      background: STATUS_COLORS[s.status] ?? "#ccc",
                      color: s.status === "approved" ? "#fff" : "#18211e",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-edit"
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    >
                      Read
                    </button>
                    {s.status !== "approved" && (
                      <button
                        className="btn-primary"
                        style={{ fontSize: 12, padding: "4px 10px" }}
                        onClick={() => setStatus(s.id, "approved")}
                      >
                        Approve
                      </button>
                    )}
                    {s.status !== "rejected" && (
                      <button
                        className="btn-del"
                        onClick={() => setStatus(s.id, "rejected")}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {expanded === s.id && (
                <tr key={`body-${s.id}`}>
                  <td
                    colSpan={6}
                    style={{
                      background: "#f7f1e7",
                      borderRadius: 8,
                      padding: 20,
                      whiteSpace: "pre-wrap",
                      fontSize: 14,
                      lineHeight: 1.7
                    }}
                  >
                    {s.story}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
