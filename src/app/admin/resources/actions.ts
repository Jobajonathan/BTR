"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveResource(data: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  body: string;
}) {
  const supabase = createAdminClient();
  const payload = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    cover_image_url: data.cover_image_url || null,
    body: data.body ? { html: data.body } : null,
    updated_at: new Date().toISOString()
  };

  if (data.id) {
    const { error } = await supabase.from("resources").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("resources").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/resources");
}

export async function deleteResource(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/resources");
}
