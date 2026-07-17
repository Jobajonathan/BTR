import { createAdminClient } from "@/lib/supabase/admin";
import SettingsForm from "./SettingsForm";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

const DEFAULT_SECTIONS = [
  { id: "stories",   label: "Stories",   visible: true, order: 1 },
  { id: "dialogues", label: "Dialogues", visible: true, order: 2 },
  { id: "outreach",  label: "Outreach",  visible: true, order: 3 },
  { id: "resources", label: "Resources", visible: true, order: 4 }
];

const defaults = {
  hero_headline: "Behind every reel is a real story.",
  hero_copy:
    "A fast-growing mental health community helping young Africans speak honestly about pressure, identity, family, anxiety, healing, and hope.",
  hero_primary_cta_label: "Read Stories",
  hero_primary_cta_url: "/stories",
  hero_secondary_cta_label: "Submit Your Story",
  hero_secondary_cta_url: "/submit",
  impact_stats: [
    { value: "1M+", label: "people reached through stories and conversations" },
    { value: "3", label: "core pillars: storytelling, dialogues, outreaches" },
    { value: "Africa", label: "centered voice, context, and community care" }
  ],
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
  youtube_url: "",
  whatsapp_url: "",
  telegram_url: "",
  facebook_url: "",
  linkedin_url: "",
  footer_tagline: "Behind every reel is a real story.",
  homepage_sections: DEFAULT_SECTIONS
};

export default async function SettingsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", SETTINGS_ID)
    .single();

  const settings = {
    hero_headline: data?.hero_headline ?? defaults.hero_headline,
    hero_copy: data?.hero_copy ?? defaults.hero_copy,
    hero_primary_cta_label: data?.hero_primary_cta_label ?? defaults.hero_primary_cta_label,
    hero_primary_cta_url: data?.hero_primary_cta_url ?? defaults.hero_primary_cta_url,
    hero_secondary_cta_label: data?.hero_secondary_cta_label ?? defaults.hero_secondary_cta_label,
    hero_secondary_cta_url: data?.hero_secondary_cta_url ?? defaults.hero_secondary_cta_url,
    impact_stats: data?.impact_stats?.length ? data.impact_stats : defaults.impact_stats,
    instagram_url: data?.instagram_url ?? "",
    twitter_url: data?.twitter_url ?? "",
    tiktok_url: data?.tiktok_url ?? "",
    youtube_url: data?.youtube_url ?? "",
    whatsapp_url: data?.whatsapp_url ?? "",
    telegram_url: data?.telegram_url ?? "",
    facebook_url: data?.facebook_url ?? "",
    linkedin_url: data?.linkedin_url ?? "",
    footer_tagline: data?.footer_tagline ?? defaults.footer_tagline,
    homepage_sections:
      Array.isArray(data?.homepage_sections) && data.homepage_sections.length
        ? data.homepage_sections
        : DEFAULT_SECTIONS,
    header_cta_label: data?.header_cta_label ?? "Donate",
    header_cta_url: data?.header_cta_url ?? "/donate",
    volunteer_headline: data?.volunteer_headline ?? "",
    volunteer_copy: data?.volunteer_copy ?? "",
    donate_headline: data?.donate_headline ?? "",
    donate_copy: data?.donate_copy ?? "",
    donate_amounts: Array.isArray(data?.donate_amounts) ? data.donate_amounts.join(", ") : "5, 10, 25, 50",
    donate_bank_name: data?.donate_bank_name ?? "",
    donate_account_name: data?.donate_account_name ?? "",
    donate_account_number: data?.donate_account_number ?? "",
    donate_sort_code: data?.donate_sort_code ?? "",
    donate_payment_link: data?.donate_payment_link ?? "",
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Site Settings</h1>
      </div>
      <div className="admin-content">
        <SettingsForm data={settings} />
      </div>
    </>
  );
}
