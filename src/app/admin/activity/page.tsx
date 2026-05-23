import { createAdminClient } from "@/lib/supabase/admin";

export default async function ActivityLogPage() {
  const supabase = createAdminClient();

  const { data: logs } = await supabase
    .from("activity_log")
    .select("id, user_email, action, entity_type, entity_id, entity_title, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const ACTION_LABELS: Record<string, string> = {
    created: "Created",
    updated: "Updated",
    deleted: "Deleted",
    published: "Published",
    unpublished: "Unpublished",
    duplicated: "Duplicated"
  };

  const ENTITY_LABELS: Record<string, string> = {
    story: "Story",
    blog_post: "Blog post",
    dialogue: "Dialogue",
    outreach: "Outreach",
    resource: "Resource",
    partner: "Partner",
    team_member: "Team member"
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Activity Log</h1>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!logs?.length ? (
            <div className="empty-state">
              <p>No activity recorded yet.</p>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                Admin actions will appear here automatically.
              </p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>Action</th>
                  <th>Content</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 13, color: "var(--muted)" }}>
                      {log.user_email ?? "System"}
                    </td>
                    <td>
                      <span className={`badge ${
                        log.action === "deleted" ? "badge-red" :
                        log.action === "published" ? "badge-green" :
                        "badge-gray"
                      }`}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: 14 }}>
                        {log.entity_title ?? log.entity_id ?? "—"}
                      </strong>
                      {log.entity_type && (
                        <span style={{ fontSize: 12, color: "var(--muted)", display: "block" }}>
                          {ENTITY_LABELS[log.entity_type] ?? log.entity_type}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>
                      {new Date(log.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
