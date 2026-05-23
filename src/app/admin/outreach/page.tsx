import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function OutreachPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("outreaches").select("id, title, slug, location, date").order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Outreaches</h1>
        <div className="topbar-actions"><Link href="/admin/outreach/new" className="btn-primary">+ New outreach</Link></div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state"><p>No outreaches yet.</p><Link href="/admin/outreach/new" className="btn-primary">Add first outreach</Link></div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Location</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {data.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.title}</strong><span>/{o.slug}</span></td>
                    <td>{o.location ?? "—"}</td>
                    <td>{o.date ?? "—"}</td>
                    <td><div className="table-actions"><Link href={`/admin/outreach/${o.id}`} className="btn-edit">Edit</Link></div></td>
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
