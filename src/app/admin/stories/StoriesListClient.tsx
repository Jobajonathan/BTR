"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { deleteStory } from "./actions";

type Story = {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  published_at: string | null;
  view_count: number | null;
  categories: { title: string } | null;
};

export default function StoriesListClient({
  stories,
  totalCount,
  currentPage,
  totalPages,
  initialQ,
  initialStatus
}: {
  stories: Story[];
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
      await deleteStory(id);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      {/* Search + filter toolbar */}
      <form onSubmit={handleSearch} className="list-toolbar">
        <input
          type="search"
          placeholder="Search stories…"
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
          {totalCount} {totalCount === 1 ? "story" : "stories"}
        </span>
      </form>

      {!stories.length ? (
        <div className="empty-state">
          <p>{q || status ? "No stories match your filters." : "No stories yet."}</p>
          {!q && !status && (
            <Link href="/admin/stories/new" className="btn-primary">
              Write the first story
            </Link>
          )}
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stories.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.title}</strong>
                  <span>/stories/{s.slug}</span>
                </td>
                <td>
                  {/* @ts-expect-error supabase join */}
                  {s.categories?.title ?? <span style={{ color: "#aaa" }}>—</span>}
                </td>
                <td>
                  {s.published_at ? (
                    <span className="badge badge-green">
                      {new Date(s.published_at) > new Date() ? "Scheduled" : "Published"}
                    </span>
                  ) : (
                    <span className="badge badge-gray">Draft</span>
                  )}
                  {s.featured && (
                    <span className="badge badge-yellow" style={{ marginLeft: 6 }}>Featured</span>
                  )}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>
                  {s.view_count ?? 0}
                </td>
                <td>
                  <div className="table-actions">
                    <Link href={`/admin/stories/${s.id}`} className="btn-edit">Edit</Link>
                    {s.slug && (
                      <a
                        href={`/stories/${s.slug}`}
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
                      onClick={() => handleDelete(s.id, s.title)}
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

      {/* Pagination */}
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
