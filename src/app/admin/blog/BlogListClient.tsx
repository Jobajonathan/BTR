"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { deleteBlogPost } from "./actions";

type Post = {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  published_at: string | null;
  view_count: number | null;
  // Supabase returns joined rows as an array
  authors: { name: string }[] | null;
};

export default function BlogListClient({
  posts,
  totalCount,
  currentPage,
  totalPages,
  initialQ,
  initialStatus
}: {
  posts: Post[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  initialQ: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  function applyFilters(newQ: string, newStatus: string, newPage = 1) {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newStatus) params.set("status", newStatus);
    if (newPage > 1) params.set("page", String(newPage));
    const search = params.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters(q, status);
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteBlogPost(id);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      <form onSubmit={handleSearch} className="list-toolbar">
        <input
          type="search"
          placeholder="Search posts…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="list-search"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); applyFilters(q, e.target.value); }}
          className="list-filter-select"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className="btn-ghost" style={{ flexShrink: 0 }}>Search</button>
        {(q || status) && (
          <button
            type="button"
            className="btn-ghost"
            style={{ flexShrink: 0 }}
            onClick={() => { setQ(""); setStatus(""); applyFilters("", ""); }}
          >
            Clear
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>
          {totalCount} {totalCount === 1 ? "post" : "posts"}
        </span>
      </form>

      {!posts.length ? (
        <div className="empty-state">
          <p>{q || status ? "No posts match your filters." : "No blog posts yet."}</p>
          {!q && !status && (
            <Link href="/admin/blog/new" className="btn-primary">Write your first post</Link>
          )}
        </div>
      ) : (
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
                  {post.authors?.[0]?.name ?? "—"}
                </td>
                <td>
                  {post.published_at ? (
                    <span className="badge badge-green">
                      {new Date(post.published_at) > new Date() ? "Scheduled" : "Published"}
                    </span>
                  ) : (
                    <span className="badge badge-gray">Draft</span>
                  )}
                  {post.featured && (
                    <span className="badge badge-yellow" style={{ marginLeft: 6 }}>Featured</span>
                  )}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>{post.view_count ?? 0}</td>
                <td>
                  <div className="table-actions">
                    <Link href={`/admin/blog/${post.id}`} className="btn-edit">Edit</Link>
                    {post.slug && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ fontSize: 12 }}
                      >
                        View ↗
                      </a>
                    )}
                    <button
                      className="btn-danger-sm"
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={isPending}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="list-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn${p === currentPage ? " active" : ""}`}
              onClick={() => applyFilters(q, status, p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
