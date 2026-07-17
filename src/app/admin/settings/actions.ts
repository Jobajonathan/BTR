"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

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
  header_cta_label: string;
  header_cta_url: string;
  volunteer_headline: string;
  volunteer_copy: string;
  donate_headline: string;
  donate_copy: string;
  donate_amounts: string;
  donate_bank_name: string;
  donate_account_name: string;
  donate_account_number: string;
  donate_sort_code: string;
  donate_payment_link: string;
}) {
  const supabase = createAdminClient();

  // Parse donate_amounts from comma-separated string to JSON array
  const donate_amounts_parsed = data.donate_amounts
    .split(",")
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n));

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: SETTINGS_ID,
      ...data,
      donate_amounts: donate_amounts_parsed.length ? donate_amounts_parsed : [5, 10, 25, 50],
      updated_at: new Date().toISOString()
    });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/join");
  revalidatePath("/volunteer");
  revalidatePath("/donate");
  revalidatePath("/admin/settings");
}
