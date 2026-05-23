"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const BRANDING_ID = "00000000-0000-0000-0000-000000000001";

export async function saveBranding(data: {
  primary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  heading_font: string;
  body_font: string;
  logo_url: string;
  favicon_url: string;
}) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("branding")
    .upsert({ id: BRANDING_ID, ...data, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/branding");
}

export async function uploadMedia(
  formData: FormData
): Promise<{ url: string }> {
  const supabase = createAdminClient();
  const file = formData.get("file") as File;

  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop();
  const path = `uploads/${Date.now()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabase.storage
    .from("btr-media")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("btr-media").getPublicUrl(path);
  return { url: data.publicUrl };
}
