"use client";

import { useState, useTransition } from "react";
import { updateVolunteerStatus } from "./actions";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  skills?: string | null;
  availability?: string | null;
  motivation?: string | null;
  status?: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ["new", "contacted", "accepted", "declined"];
const STATUS_STYLES: Record<string, string> = {
  new:       "badge badge-yellow",
  contacted: "badge badge-gray",
  accepted:  "badge badge-green",
  declined:  "badge badge-red",
};

export default function VolunteersClient({ volunteers: initial }: { volunteers: Volunteer[] }) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleStatus(id: string, status: string) {
    startTransition(async () => {
      await updateVolunteerStatus(id, status);
      setVolunteers((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
    });
  }

  if (!volunteers.length) {
    return (
      <div className="admin-card">
        <div className="empty-state"><p>No volunteer applications yet.</p></div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>City</th>
            <th>Availability</th>
            <th>Status</th>
            <th>Applied</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => {
            const status = v.status || "new";
            return (
              <>
                <tr key={v.id}>
                  <td>
                    <strong>{v.name}</strong>
                    <br />
                    <a href={`mailto:${v.email}`} style={{ color: "var(--green)", fontSize: 13 }}>{v.email}</a>
                    {v.phone && <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 8 }}>{v.phone}</span>}
                  </td>
                  <td>{v.city ?? "—"}</td>
                  <td>{v.availability ?? "—"}</td>
                  <td>
                    <select
                      value={status}
                      onChange={(e) => handleStatus(v.id, e.target.value)}
                      style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--line)", background: "var(--surface)" }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {new Date(v.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: 12 }}
                      onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                    >
                      {expanded === v.id ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {expanded === v.id && (
                  <tr key={`${v.id}-detail`}>
                    <td colSpan={6}>
                      <div style={{ padding: "16px 20px", background: "var(--cream)", borderRadius: 10, margin: "4px 0 8px" }}>
                        {v.skills && (
                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ fontSize: 13 }}>Skills:</strong>
                            <p style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0" }}>{v.skills}</p>
                          </div>
                        )}
                        {v.motivation && (
                          <div>
                            <strong style={{ fontSize: 13 }}>Why they want to volunteer:</strong>
                            <p style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0", whiteSpace: "pre-wrap" }}>{v.motivation}</p>
                          </div>
                        )}
                        <a
                          href={`mailto:${v.email}?subject=Re: Your BTR Volunteer Application`}
                          className="btn-ghost"
                          style={{ fontSize: 13, marginTop: 14, display: "inline-block" }}
                        >
                          Reply by email →
                        </a>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
