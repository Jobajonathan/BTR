import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import BlogForm from "../BlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: post }, { data: authors }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).single(),
    supabase.from("authors").select("id, name").order("name"),
    supabase.from("categories").select("id, title").order("title")
  ]);

  if (!post) notFound();

  const publishedAt = post.published_at
    ? new Date(post.published_at).toISOString().slice(0, 16)
    : "";

  return (
    <>
      <div className="admin-topbar"><h1>Edit Blog Post</h1></div>
      <div className="admin-content">
        <BlogForm
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            cover_image_url: post.cover_image_url ?? "",
            author_id: post.author_id ?? "",
            category_id: post.category_id ?? "",
            body: (post.body as { html?: string } | null)?.html ?? "",
            published_at: publishedAt,
            featured: post.featured ?? false,
            show_in_resources: post.show_in_resources ?? false,
            seo_title: post.seo_title ?? "",
            seo_description: post.seo_description ?? ""
          }}
          authors={authors ?? []}
          categories={categories ?? []}
        />
      </div>
    </>
  );
}
