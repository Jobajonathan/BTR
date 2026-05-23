import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const getBranding = unstable_cache(
  async () => {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("branding")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();
      return data;
    } catch {
      return null;
    }
  },
  ["branding"],
  { revalidate: 30, tags: ["branding"] }
);

export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();
      return data;
    } catch {
      return null;
    }
  },
  ["site_settings"],
  { revalidate: 30, tags: ["site_settings"] }
);
