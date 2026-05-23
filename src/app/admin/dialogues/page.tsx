import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DialoguesPage() {
  const supabase = createAdminClient();
  const { data: dialogues } = await supabase
    .from("dialogues")
    .select("id, title, slug, date, meta")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Dialogues</h1>
        <div className="topbar-actions">
          <Link href="/admin/dialogues/new" className="btn-primary">+ New dialogue</Link>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!dialogues?.length ? (
            <div className="empty-state">
              <p>No dialogues yet.</p>
              <Link href="/admin/dialogues/new" className="btn-primary">Add first dialogue</Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Type</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {dialogues.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.title}</strong><span>/{d.slug}</span></td>
                    <td>{d.meta ?? <span style={{ color: "#aaa" }}>—</span>}</td>
                    <td>{d.date ? new Date(d.date).toLocaleDateString() : <span style={{ color: "#aaa" }}>—</span>}</td>
                    <td><div className="table-actions"><Link href={`/admin/dialogues/${d.id}`} className="btn-edit">Edit</Link></div></td>
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
