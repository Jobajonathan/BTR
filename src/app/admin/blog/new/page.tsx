import { createAdminClient } from "@/lib/supabase/admin";
import BlogForm from "../BlogForm";

export default async function NewBlogPostPage() {
  const supabase = createAdminClient();
  const [{ data: authors }, { data: categories }] = await Promise.all([
    supabase.from("authors").select("id, name").order("name"),
    supabase.from("categories").select("id, title").order("title")
  ]);

  return (
    <>
      <div className="admin-topbar"><h1>New Blog Post</h1></div>
      <div className="admin-content">
        <BlogForm
          post={{ title: "", slug: "", excerpt: "", cover_image_url: "", author_id: "", category_id: "", body: "", published_at: "", featured: false, show_in_resources: false, seo_title: "", seo_description: "" }}
          authors={authors ?? []}
          categories={categories ?? []}
        />
      </div>
    </>
  );
}
