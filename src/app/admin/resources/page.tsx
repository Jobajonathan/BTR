import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ResourcesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("resources").select("id, title, slug, excerpt").order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Resources</h1>
        <div className="topbar-actions"><Link href="/admin/resources/new" className="btn-primary">+ New resource</Link></div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state"><p>No resources yet.</p><Link href="/admin/resources/new" className="btn-primary">Add first resource</Link></div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Excerpt</th><th></th></tr></thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.title}</strong><span>/{r.slug}</span></td>
                    <td style={{ color: "#5c655f", fontSize: 13 }}>{r.excerpt?.slice(0, 70) ?? "—"}</td>
                    <td><div className="table-actions"><Link href={`/admin/resources/${r.id}`} className="btn-edit">Edit</Link></div></td>
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
