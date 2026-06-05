"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveBlogPost(data: {
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
  show_in_resources: boolean;
  seo_title: string;
  seo_description: string;
}) {
  const supabase = createAdminClient();
  const payload = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    cover_image_url: data.cover_image_url || null,
    author_id: data.author_id || null,
    category_id: data.category_id || null,
    body: data.body ? { html: data.body } : null,
    published_at: data.published_at || null,
    featured: data.featured,
    show_in_resources: data.show_in_resources,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    updated_at: new Date().toISOString()
  };

  if (data.id) {
    const { error } = await supabase.from("blog_posts").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("blog_posts").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/resources");
  revalidatePath("/");
}

export async function deleteBlogPost(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function duplicateBlogPost(id: string): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) throw new Error("Post not found");
  const { id: _id, created_at: _ca, updated_at: _ua, view_count: _vc, ...rest } = data;
  const slug = `${rest.slug}-copy-${Date.now()}`;
  const { data: inserted, error: insertError } = await supabase
    .from("blog_posts")
    .insert({ ...rest, title: `${rest.title} (Copy)`, slug, published_at: null })
    .select("id")
    .single();
  if (insertError || !inserted) throw new Error(insertError?.message ?? "Duplicate failed");
  revalidatePath("/admin/blog");
  return inserted.id;
}
