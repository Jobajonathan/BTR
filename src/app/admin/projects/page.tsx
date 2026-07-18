import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("id, title, slug, status, order_index, cover_image_url")
    .order("order_index", { ascending: true });

  return (
    <>
      <div className="admin-topbar">
        <h1>Projects</h1>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            {data?.filter((p) => p.status === "published").length ?? 0} live
          </span>
          <Link href="/admin/projects/new" className="btn-primary">+ New project</Link>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state">
              <p>No projects yet.</p>
              <Link href="/admin/projects/new" className="btn-primary">Add first project</Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Project</th><th>Status</th><th>Order</th><th></th></tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.title}</strong>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}> /projects/{p.slug}</span>
                    </td>
                    <td>
                      <span className={p.status === "published" ? "badge badge-green" : "badge badge-gray"}>
                        {p.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>{p.order_index}</td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/projects/${p.id}`} className="btn-edit">Edit</Link>
                      </div>
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
