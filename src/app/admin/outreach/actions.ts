"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { uploadMedia } from "@/app/admin/branding/actions";

export async function saveOutreach(data: {
  id?: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  summary: string;
  gallery: string[];
  impact_stats: Array<{ value: string; label: string }>;
  partners: string[];
  testimonial: string;
  testimonial_author: string;
}) {
  const supabase = createAdminClient();
  const payload = {
    title: data.title,
    slug: data.slug,
    location: data.location || null,
    date: data.date || null,
    summary: data.summary || null,
    gallery: data.gallery.filter(Boolean),
    impact_stats: data.impact_stats.filter((s) => s.value),
    partners: data.partners.filter(Boolean),
    testimonial: data.testimonial || null,
    testimonial_author: data.testimonial_author || null
  };

  if (data.id) {
    const { error } = await supabase.from("outreaches").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("outreaches").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/outreach");
  revalidatePath("/outreach");
}

export async function deleteOutreach(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("outreaches").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/outreach");
  revalidatePath("/outreach");
}

export { uploadMedia };
