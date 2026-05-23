import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import BlogListClient from "./BlogListClient";

export default async function AdminBlogPage({
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
    .from("blog_posts")
    .select("id, title, slug, published_at, featured, view_count, authors(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) query = query.ilike("title", `%${q}%`);
  if (status === "published") query = query.not("published_at", "is", null);
  if (status === "draft") query = query.is("published_at", null);

  const { data: posts, count } = await query;

  const totalPages = Math.ceil((count ?? 0) / pageSize);

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
        <BlogListClient
          posts={(posts ?? []) as Parameters<typeof BlogListClient>[0]["posts"]}
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
