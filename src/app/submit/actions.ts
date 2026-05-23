"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function submitStory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!title || !story || !consent) {
    return { error: "Please fill in all required fields and confirm consent." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("story_submissions").insert({
    name: name || null,
    email: email || null,
    title,
    category: category || null,
    story,
    consent
  });

  if (error) return { error: "Something went wrong. Please try again." };
  return { success: true };
}
