"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export type HomepageSection = {
  id: string;
  label: string;
  visible: boolean;
  order: number;
};

export async function saveSettings(data: {
  hero_headline: string;
  hero_copy: string;
  hero_primary_cta_label: string;
  hero_primary_cta_url: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_url: string;
  impact_stats: Array<{ value: string; label: string }>;
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
  youtube_url: string;
  whatsapp_url: string;
  telegram_url: string;
  facebook_url: string;
  linkedin_url: string;
  footer_tagline: string;
  homepage_sections: HomepageSection[];
}) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: SETTINGS_ID, ...data, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  revalidateTag("site_settings");
  revalidatePath("/");
  revalidatePath("/join");
  revalidatePath("/admin/settings");
}
