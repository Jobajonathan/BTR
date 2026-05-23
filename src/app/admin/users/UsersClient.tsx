"use client";

import { useState, useTransition } from "react";
import {
  inviteAdminUser,
  resendInvitation,
  updateUserRole,
  removeAdminUser,
  type AdminUser
} from "./actions";
import { type AdminRole, ROLE_LABELS } from "@/lib/supabase/roles";

const ALL_ROLES: AdminRole[] = ["super_admin", "editor", "author", "moderator"];

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Full access — content, users, settings, branding",
  editor:      "All content — stories, blog, dialogues, outreaches, resources, submissions",
  author:      "Blog posts and media only",
  moderator:   "Review submissions only"
};

/* ── Derive invite status ──────────────────────────────────────── */
type InviteStatus = "active" | "pending" | "never_signed_in";

function getStatus(user: AdminUser): InviteStatus {
  if (user.email_confirmed_at) {
    return user.last_sign_in_at ? "active" : "never_signed_in";
  }
  return "pending";
}

const STATUS_LABELS: Record<InviteStatus, string> = {
  active:          "Active",
  pending:         "Invite pending",
  never_signed_in: "Accepted — not signed in"
};

const STATUS_CLASSES: Record<InviteStatus, string> = {
  active:          "badge badge-green",
  pending:         "badge badge-yellow",
  never_signed_in: "badge badge-gray"
};

/* ── Date helper ─────────────────────────────────────────────── */
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function fmtDateTime(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

/* ── Component ──────────────────────────────────────────────── */
export default function UsersClient({
  users: initial,
  currentUserId
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>(initial);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("editor");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [inviteError, setInviteError] = useState("");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  /* ── Stats ── */
  const total   = users.length;
  const active  = users.filter((u) => getStatus(u) === "active").length;
  const pending = users.filter((u) => getStatus(u) === "pending").length;
  const noLogin = users.filter((u) => getStatus(u) === "never_signed_in").length;

  /* ── Handlers ── */
  function handleInvite() {
    if (!inviteEmail) return;
    setInviteStatus("sending");
    setInviteError("");
    startTransition(async () => {
      try {
        await inviteAdminUser(inviteEmail, inviteRole);
        setInviteStatus("sent");
        setInviteEmail("");
        setTimeout(() => { setInviteStatus("idle"); setShowInvite(false); }, 2500);
      } catch (e) {
        setInviteStatus("error");
        setInviteError(String(e));
      }
    });
  }

  function handleResend(user: AdminUser) {
    if (!confirm(`Resend invitation email to ${user.email}?`)) return;
    setResendingId(user.id);
    startTransition(async () => {
      try {
        await resendInvitation(user.email, user.role);
      } finally {
        setResendingId(null);
      }
    });
  }

  function handleRoleChange(userId: string, role: AdminRole) {
    startTransition(async () => {
      await updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    });
  }

  function handleRemove(userId: string, email: string) {
    if (!confirm(`Remove ${email}'s admin access? They will no longer be able to log in.`)) return;
    startTransition(async () => {
      await removeAdminUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    });
  }

  /* ── Render ── */
  return (
    <div className="admin-content">

      {/* ── Summary stats ── */}
      <div className="users-stats-row">
        <div className="users-stat-card">
          <strong>{total}</strong>
          <span>Total invited</span>
        </div>
        <div className="users-stat-card users-stat-green">
          <strong>{active}</strong>
          <span>Active</span>
        </div>
        <div className="users-stat-card users-stat-yellow">
          <strong>{pending}</strong>
          <span>Invite pending</span>
        </div>
        <div className="users-stat-card users-stat-gray">
          <strong>{noLogin}</strong>
          <span>Accepted, not signed in</span>
        </div>
      </div>

      {/* ── Invite panel ── */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <p className="admin-card-title" style={{ marginBottom: 4 }}>Admin Users</p>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
              Invite team members to manage content. They receive an email to set their password.
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: "8px 16px", whiteSpace: "nowrap", flexShrink: 0 }}
            onClick={() => setShowInvite(!showInvite)}
          >
            + Invite user
          </button>
        </div>

        {showInvite && (
          <div style={{ marginTop: 20, padding: 20, background: "var(--cream)", borderRadius: 8, border: "1px solid var(--line)" }}>
            <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 14px" }}>New invitation</p>

            {inviteStatus === "sent" && (
              <div className="alert alert-success" style={{ marginBottom: 14 }}>
                ✓ Invitation sent to {inviteEmail || "user"}.
              </div>
            )}
            {inviteStatus === "error" && (
              <div className="alert alert-error" style={{ marginBottom: 14 }}>
                {inviteError || "Failed to send invitation."}
              </div>
            )}

            <div className="admin-grid-2">
              <div className="admin-field">
                <label>Email address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  placeholder="colleague@example.com"
                  autoFocus
                />
              </div>
              <div className="admin-field">
                <label>Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as AdminRole)}>
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>
                  {ROLE_DESCRIPTIONS[inviteRole]}
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={handleInvite}
                disabled={inviteStatus === "sending" || !inviteEmail}
              >
                {inviteStatus === "sending" ? "Sending…" : "Send invitation"}
              </button>
              <button className="btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Users table ── */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Invited</th>
              <th>Last sign-in</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const status = getStatus(u);
              return (
                <tr key={u.id}>
                  {/* Email + you badge */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="user-avatar-circle">
                        {u.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{u.email}</div>
                        {u.id === currentUserId && (
                          <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700 }}>You</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role — inline edit for other users */}
                  <td>
                    {u.id === currentUserId ? (
                      <span className={`role-badge role-badge-${u.role}`}>{ROLE_LABELS[u.role]}</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                        className="inline-role-select"
                      >
                        {ALL_ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* Status badge */}
                  <td>
                    <span className={STATUS_CLASSES[status]}>{STATUS_LABELS[status]}</span>
                  </td>

                  {/* Invited date */}
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>
                    {fmtDate(u.invited_at ?? u.created_at)}
                  </td>

                  {/* Last sign-in */}
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>
                    {fmtDateTime(u.last_sign_in_at)}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="table-actions">
                      {status === "pending" && u.id !== currentUserId && (
                        <button
                          className="btn-ghost"
                          style={{ fontSize: 12 }}
                          disabled={resendingId === u.id}
                          onClick={() => handleResend(u)}
                          title="Resend invitation email"
                        >
                          {resendingId === u.id ? "Sending…" : "Resend"}
                        </button>
                      )}
                      {u.id !== currentUserId && (
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleRemove(u.id, u.email)}
                          title="Remove admin access"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "32px 0" }}>
                  No users yet. Invite someone above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Role guide ── */}
      <div className="admin-card">
        <p className="admin-card-title">Role Permissions</p>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            {ALL_ROLES.map((r) => (
              <tr key={r}>
                <td><span className={`role-badge role-badge-${r}`}>{ROLE_LABELS[r]}</span></td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>{ROLE_DESCRIPTIONS[r]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
