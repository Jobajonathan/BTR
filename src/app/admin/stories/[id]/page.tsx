import { createAdminClient } from "@/lib/supabase/admin";
import StoryForm from "../StoryForm";
import { notFound } from "next/navigation";

export default async function EditStoryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: story }, { data: authors }, { data: categories }] =
    await Promise.all([
      supabase.from("stories").select("*").eq("id", id).single(),
      supabase.from("authors").select("id, name").order("name"),
      supabase.from("categories").select("id, title").order("title")
    ]);

  if (!story) notFound();

  const storyData = {
    id: story.id,
    title: story.title ?? "",
    slug: story.slug ?? "",
    excerpt: story.excerpt ?? "",
    cover_image_url: story.cover_image_url ?? "",
    author_id: story.author_id ?? "",
    category_id: story.category_id ?? "",
    body: story.body?.html ?? "",
    published_at: story.published_at
      ? new Date(story.published_at).toISOString().slice(0, 16)
      : "",
    featured: story.featured ?? false,
    instagram_url: story.instagram_url ?? "",
    seo_title: story.seo_title ?? "",
    seo_description: story.seo_description ?? ""
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Edit Story</h1>
      </div>
      <div className="admin-content">
        <StoryForm
          story={storyData}
          authors={authors ?? []}
          categories={categories ?? []}
        />
      </div>
    </>
  );
}
