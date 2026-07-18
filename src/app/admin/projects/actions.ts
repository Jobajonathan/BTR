"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function saveProject(data: {
  id?: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  status: "draft" | "published";
  order_index: number;
}) {
  const supabase = createAdminClient();
  const payload = {
    title: data.title,
    slug: data.slug || toSlug(data.title),
    description: data.description || null,
    cover_image_url: data.cover_image_url || null,
    status: data.status,
    order_index: data.order_index,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}
