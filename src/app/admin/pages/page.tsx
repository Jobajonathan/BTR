import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function PagesAdminPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("custom_pages")
    .select("id, title, slug, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Custom Pages</h1>
        <div className="topbar-actions">
          <Link href="/admin/pages/new" className="btn-primary">+ New page</Link>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Create standalone pages (FAQ, events, impact reports, etc.). Published pages are accessible at{" "}
            <code>behindthereels.com/[your-slug]</code>. Do not use slugs that conflict with existing site pages (blog, stories, about…).
          </p>
        </div>
        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state">
              <p>No custom pages yet.</p>
              <Link href="/admin/pages/new" className="btn-primary">Create first page</Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Title</th><th>URL</th><th>Status</th><th>Updated</th><th></th></tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.title}</strong></td>
                    <td style={{ fontFamily: "monospace", fontSize: 13 }}>/{p.slug}</td>
                    <td>
                      <span className={p.status === "published" ? "badge badge-green" : "badge badge-gray"}>
                        {p.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--muted)" }}>
                      {new Date(p.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/pages/${p.id}`} className="btn-edit">Edit</Link>
                        {p.status === "published" && (
                          <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: 12 }}>View ↗</a>
                        )}
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
