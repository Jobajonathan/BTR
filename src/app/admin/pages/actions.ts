"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function savePage(data: {
  id?: string;
  title: string;
  slug: string;
  content: string;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published";
}) {
  const supabase = createAdminClient();
  const slug = data.slug || toSlug(data.title);
  const payload = {
    title: data.title,
    slug,
    content: data.content || null,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    status: data.status,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    const { error } = await supabase.from("custom_pages").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("custom_pages").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`);
}

export async function deletePage(id: string, slug: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("custom_pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`);
}
