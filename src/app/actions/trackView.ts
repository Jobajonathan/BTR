"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function trackView(type: "story" | "blog", id: string) {
  try {
    const supabase = createAdminClient();
    if (type === "story") {
      await supabase.rpc("increment_story_views", { p_id: id });
    } else {
      await supabase.rpc("increment_blog_views", { p_id: id });
    }
  } catch {
    // Non-critical — never throw
  }
}
