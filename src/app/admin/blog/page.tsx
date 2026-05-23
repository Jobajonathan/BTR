import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminBlogPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published_at, featured, view_count, authors(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Blog</h1>
        <div className="topbar-actions">
          <Link href="/admin/blog/new" className="btn-primary">
            + New post
          </Link>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {posts && posts.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <strong>{post.title}</strong>
                      <span>/blog/{post.slug}</span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>
                      {(post.authors as unknown as { name: string } | null)?.name ?? "—"}
                    </td>
                    <td>
                      {post.published_at ? (
                        <span className="badge badge-green">Published</span>
                      ) : (
                        <span className="badge badge-gray">Draft</span>
                      )}
                      {post.featured && (
                        <span className="badge badge-yellow" style={{ marginLeft: 6 }}>Featured</span>
                      )}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>
                      {post.view_count ?? 0}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/blog/${post.id}`} className="btn-edit">Edit</Link>
                        {post.slug && (
                          <Link href={`/blog/${post.slug}`} target="_blank" className="btn-ghost" style={{ fontSize: 12 }}>
                            View ↗
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No blog posts yet.</p>
              <Link href="/admin/blog/new" className="btn-primary">Write your first post</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
