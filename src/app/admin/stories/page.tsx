import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function StoriesPage() {
  const supabase = createAdminClient();
  const { data: stories } = await supabase
    .from("stories")
    .select("id, title, slug, featured, published_at, categories(title)")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Stories</h1>
        <div className="topbar-actions">
          <Link href="/admin/stories/new" className="btn-primary">
            + New story
          </Link>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!stories?.length ? (
            <div className="empty-state">
              <p>No stories yet.</p>
              <Link href="/admin/stories/new" className="btn-primary">
                Write the first story
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.title}</strong>
                      <span>/{s.slug}</span>
                    </td>
                    <td>
                      {/* @ts-expect-error supabase join */}
                      {s.categories?.title ?? <span style={{ color: "#aaa" }}>—</span>}
                    </td>
                    <td>
                      {s.published_at ? (
                        <span className="badge badge-green">Published</span>
                      ) : (
                        <span className="badge badge-gray">Draft</span>
                      )}
                      {s.featured && (
                        <span
                          className="badge badge-yellow"
                          style={{ marginLeft: 6 }}
                        >
                          Featured
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          href={`/admin/stories/${s.id}`}
                          className="btn-edit"
                        >
                          Edit
                        </Link>
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
