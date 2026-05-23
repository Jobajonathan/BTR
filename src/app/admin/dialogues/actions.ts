"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveDialogue(data: {
  id?: string;
  title: string;
  slug: string;
  date: string;
  guest: string;
  summary: string;
  cover_image_url: string;
  recording_url: string;
  key_takeaways: string[];
  meta: string;
}) {
  const supabase = createAdminClient();
  const payload = {
    title: data.title,
    slug: data.slug,
    date: data.date || null,
    guest: data.guest || null,
    summary: data.summary || null,
    cover_image_url: data.cover_image_url || null,
    recording_url: data.recording_url || null,
    key_takeaways: data.key_takeaways.filter(Boolean),
    meta: data.meta || null
  };

  if (data.id) {
    const { error } = await supabase.from("dialogues").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("dialogues").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/dialogues");
}

export async function deleteDialogue(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("dialogues").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dialogues");
}
