"use client";

import { useState, useTransition } from "react";
import { inviteAdminUser, updateUserRole, removeAdminUser } from "./actions";
import { type AdminRole, ROLE_LABELS } from "@/lib/supabase/roles";

type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
};

const ALL_ROLES: AdminRole[] = ["super_admin", "editor", "author", "moderator"];

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Full access — content, users, settings, branding",
  editor:      "All content (stories, blog, dialogues, outreaches, resources, submissions)",
  author:      "Blog posts only",
  moderator:   "Review submissions only"
};

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
  const [, startTransition] = useTransition();

  function handleInvite() {
    if (!inviteEmail) return;
    setInviteStatus("sending");
    setInviteError("");
    startTransition(async () => {
      try {
        await inviteAdminUser(inviteEmail, inviteRole);
        setInviteStatus("sent");
        setInviteEmail("");
        setTimeout(() => {
          setInviteStatus("idle");
          setShowInvite(false);
        }, 2000);
      } catch (e) {
        setInviteStatus("error");
        setInviteError(String(e));
      }
    });
  }

  function handleRoleChange(userId: string, role: AdminRole) {
    startTransition(async () => {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    });
  }

  function handleRemove(userId: string) {
    if (!confirm("Remove this user's admin access?")) return;
    startTransition(async () => {
      await removeAdminUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    });
  }

  return (
    <div className="admin-content">
      {/* Invite panel */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p className="admin-card-title" style={{ marginBottom: 4 }}>Admin Users</p>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 0" }}>
              Invite people to manage content. They receive an email to set their password.
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: "8px 16px", whiteSpace: "nowrap" }}
            onClick={() => setShowInvite(!showInvite)}
          >
            + Invite user
          </button>
        </div>

        {showInvite && (
          <div style={{ marginTop: 20, padding: 20, background: "var(--cream)", borderRadius: 8, border: "1px solid var(--line)" }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>New invitation</p>

            {inviteStatus === "sent" && (
              <div className="alert alert-success">Invitation sent to {inviteEmail || "user"}.</div>
            )}
            {inviteStatus === "error" && (
              <div className="alert alert-error">{inviteError || "Failed to send invitation."}</div>
            )}

            <div className="admin-grid-2">
              <div className="admin-field">
                <label>Email address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                />
              </div>
              <div className="admin-field">
                <label>Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as AdminRole)}>
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
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

      {/* Users table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.email}</strong>
                  {u.id === currentUserId && (
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>You</span>
                  )}
                </td>
                <td>
                  {u.id === currentUserId ? (
                    <span className={`role-badge role-badge-${u.role}`}>{ROLE_LABELS[u.role]}</span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                      style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit" }}
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>
                  {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td>
                  {u.id !== currentUserId && (
                    <button className="btn-del table-actions" onClick={() => handleRemove(u.id)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role guide */}
      <div className="admin-card">
        <p className="admin-card-title">Role Permissions</p>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>What they can access</th>
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
