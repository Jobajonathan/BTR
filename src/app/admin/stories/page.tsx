import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import StoriesListClient from "./StoriesListClient";

export default async function StoriesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page } = await searchParams;
  const supabase = createAdminClient();

  const pageSize = 20;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("stories")
    .select("id, title, slug, featured, published_at, view_count, categories(title)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) query = query.ilike("title", `%${q}%`);
  if (status === "published") query = query.not("published_at", "is", null);
  if (status === "draft") query = query.is("published_at", null);

  const { data: stories, count } = await query;

  const totalPages = Math.ceil((count ?? 0) / pageSize);

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
        <StoriesListClient
          stories={stories ?? []}
          totalCount={count ?? 0}
          currentPage={currentPage}
          totalPages={totalPages}
          initialQ={q ?? ""}
          initialStatus={status ?? ""}
        />
      </div>
    </>
  );
}
