"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveStory(data: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  author_id: string;
  category_id: string;
  body: string;
  published_at: string;
  featured: boolean;
  instagram_url: string;
  seo_title: string;
  seo_description: string;
}) {
  const supabase = createAdminClient();
  const payload = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    cover_image_url: data.cover_image_url || null,
    author_id: data.author_id || null,
    category_id: data.category_id || null,
    body: data.body ? { html: data.body } : null,
    published_at: data.published_at || null,
    featured: data.featured,
    instagram_url: data.instagram_url || null,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    updated_at: new Date().toISOString()
  };

  if (data.id) {
    const { error } = await supabase
      .from("stories")
      .update(payload)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("stories").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/stories");
  revalidatePath("/");
}

export async function deleteStory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("stories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/stories");
  revalidatePath("/");
}
