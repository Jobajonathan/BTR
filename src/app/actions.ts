"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function subscribeToNewsletter(
  _prev: { ok: boolean; error?: string },
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const name  = (formData.get("name")  as string | null)?.trim();
  const source = (formData.get("source") as string | null) ?? "website";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").upsert(
    { email, name: name || null, source, confirmed: false },
    { onConflict: "email", ignoreDuplicates: true }
  );

  if (error) {
    // Duplicate email → treat as success (already subscribed)
    if (error.code === "23505") return { ok: true };
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
