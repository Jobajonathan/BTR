"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function savePartner(data: {
  id?: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  category: string;
  featured: boolean;
  order_index: number;
}) {
  const supabase = createAdminClient();
  const payload = {
    name: data.name,
    description: data.description || null,
    logo_url: data.logo_url || null,
    website_url: data.website_url || null,
    category: data.category || null,
    featured: data.featured,
    order_index: data.order_index
  };

  if (data.id) {
    const { error } = await supabase.from("partners").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("partners").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/partners");
  revalidatePath("/partner");
}

export async function deletePartner(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
  revalidatePath("/partner");
}

export async function uploadPartnerMedia(fd: FormData): Promise<{ url: string }> {
  const supabase = createAdminClient();
  const file = fd.get("file") as File;
  if (!file) throw new Error("No file");
  const ext = file.name.split(".").pop();
  const path = `partners/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("btr-media").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("btr-media").getPublicUrl(path);
  return { url: data.publicUrl };
}
