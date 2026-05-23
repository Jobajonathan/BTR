import { createAdminClient } from "@/lib/supabase/admin";
import StoryForm from "../StoryForm";

export default async function NewStoryPage() {
  const supabase = createAdminClient();
  const [{ data: authors }, { data: categories }] = await Promise.all([
    supabase.from("authors").select("id, name").order("name"),
    supabase.from("categories").select("id, title").order("title")
  ]);

  const blank = {
    title: "",
    slug: "",
    excerpt: "",
    cover_image_url: "",
    author_id: "",
    category_id: "",
    body: "",
    published_at: "",
    featured: false,
    instagram_url: "",
    seo_title: "",
    seo_description: ""
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>New Story</h1>
      </div>
      <div className="admin-content">
        <StoryForm
          story={blank}
          authors={authors ?? []}
          categories={categories ?? []}
        />
      </div>
    </>
  );
}
