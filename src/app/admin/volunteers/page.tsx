import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function VolunteersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("volunteer_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Volunteer Applications</h1>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{data?.length ?? 0} total</span>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state"><p>No volunteer applications yet.</p></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Availability</th>
                  <th>Skills</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.map((v) => (
                  <tr key={v.id}>
                    <td><strong>{v.name}</strong></td>
                    <td><a href={`mailto:${v.email}`} style={{ color: "var(--green)" }}>{v.email}</a></td>
                    <td>{v.city ?? "—"}</td>
                    <td>{v.availability ?? "—"}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.skills ?? "—"}</td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--muted)", fontSize: 13 }}>
                      {new Date(v.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
