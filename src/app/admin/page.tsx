import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

async function getDashboardData() {
  const supabase = createAdminClient();
  const [stories, blogs, dialogues, outreaches, resources, submissions, topStories, topBlogs] =
    await Promise.all([
      supabase.from("stories").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("dialogues").select("id", { count: "exact", head: true }),
      supabase.from("outreaches").select("id", { count: "exact", head: true }),
      supabase.from("resources").select("id", { count: "exact", head: true }),
      supabase
        .from("story_submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("stories")
        .select("id, title, view_count, slug")
        .not("published_at", "is", null)
        .order("view_count", { ascending: false })
        .limit(5),
      supabase
        .from("blog_posts")
        .select("id, title, view_count, slug")
        .not("published_at", "is", null)
        .order("view_count", { ascending: false })
        .limit(5)
    ]);

  return {
    counts: {
      stories: stories.count ?? 0,
      blogs: blogs.count ?? 0,
      dialogues: dialogues.count ?? 0,
      outreaches: outreaches.count ?? 0,
      resources: resources.count ?? 0,
      submissions: submissions.count ?? 0
    },
    topStories: topStories.data ?? [],
    topBlogs: topBlogs.data ?? []
  };
}

export default async function AdminDashboard() {
  const { counts, topStories, topBlogs } = await getDashboardData();

  const maxStoryViews = topStories[0]?.view_count ?? 1;
  const maxBlogViews = topBlogs[0]?.view_count ?? 1;

  return (
    <>
      <div className="admin-topbar">
        <h1>Dashboard</h1>
      </div>
      <div className="admin-content">

        {/* Stats grid */}
        <div className="admin-dashboard-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="dashboard-stat">
            <strong>{counts.stories}</strong>
            <span>Stories published</span>
          </div>
          <div className="dashboard-stat">
            <strong>{counts.blogs}</strong>
            <span>Blog posts</span>
          </div>
          <div className="dashboard-stat">
            <strong>{counts.dialogues}</strong>
            <span>Dialogues</span>
          </div>
          <div className="dashboard-stat">
            <strong>{counts.outreaches}</strong>
            <span>Outreach events</span>
          </div>
          <div className="dashboard-stat">
            <strong>{counts.resources}</strong>
            <span>Resources</span>
          </div>
          <div className="dashboard-stat">
            <strong style={{ color: counts.submissions > 0 ? "var(--green)" : undefined }}>
              {counts.submissions}
            </strong>
            <span>Pending submissions</span>
          </div>
        </div>

        {/* Top stories */}
        {topStories.length > 0 && (
          <div className="admin-card">
            <p className="admin-card-title">Top Stories by Views</p>
            <table className="analytics-table">
              <tbody>
                {topStories.map((s) => (
                  <tr key={s.id}>
                    <td style={{ paddingRight: 16 }}>
                      <Link
                        href={`/admin/stories/${s.id}`}
                        style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}
                      >
                        {s.title}
                      </Link>
                    </td>
                    <td style={{ width: 140 }}>
                      <div className="analytics-bar-wrap">
                        <div
                          className="analytics-bar"
                          style={{ width: `${Math.round(((s.view_count ?? 0) / maxStoryViews) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "right", color: "var(--muted)", fontSize: 13, paddingLeft: 12 }}>
                      {s.view_count ?? 0} views
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top blog posts */}
        {topBlogs.length > 0 && (
          <div className="admin-card">
            <p className="admin-card-title">Top Blog Posts by Views</p>
            <table className="analytics-table">
              <tbody>
                {topBlogs.map((b) => (
                  <tr key={b.id}>
                    <td style={{ paddingRight: 16 }}>
                      <Link
                        href={`/admin/blog/${b.id}`}
                        style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}
                      >
                        {b.title}
                      </Link>
                    </td>
                    <td style={{ width: 140 }}>
                      <div className="analytics-bar-wrap">
                        <div
                          className="analytics-bar"
                          style={{ width: `${Math.round(((b.view_count ?? 0) / maxBlogViews) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "right", color: "var(--muted)", fontSize: 13, paddingLeft: 12 }}>
                      {b.view_count ?? 0} views
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quick actions */}
        <p style={{ fontWeight: 800, fontSize: 12, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Quick Actions
        </p>
        <div className="dashboard-quick-links">
          <Link href="/admin/blog/new" className="dashboard-link">
            <div className="dashboard-link-icon">✍</div>
            Write a blog post
          </Link>
          <Link href="/admin/stories/new" className="dashboard-link">
            <div className="dashboard-link-icon">✦</div>
            Add a story
          </Link>
          <Link href="/admin/submissions" className="dashboard-link">
            <div className="dashboard-link-icon">✉</div>
            Review submissions
            {counts.submissions > 0 && (
              <span className="badge badge-yellow" style={{ marginLeft: "auto" }}>
                {counts.submissions}
              </span>
            )}
          </Link>
          <Link href="/admin/settings" className="dashboard-link">
            <div className="dashboard-link-icon">◧</div>
            Site settings
          </Link>
          <Link href="/admin/branding" className="dashboard-link">
            <div className="dashboard-link-icon">◑</div>
            Branding & fonts
          </Link>
          <Link href="/admin/users" className="dashboard-link">
            <div className="dashboard-link-icon">◍</div>
            Manage admin users
          </Link>
        </div>

      </div>
    </>
  );
}
