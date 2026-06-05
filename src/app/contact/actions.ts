"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type ContactResult = { error?: string };

export async function submitContactForm(data: {
  name: string;
  email: string;
  organisation: string;
  inquiry_type: string;
  message: string;
}): Promise<ContactResult> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    organisation: data.organisation || null,
    inquiry_type: data.inquiry_type,
    message: data.message,
  });

  if (error) return { error: error.message };
  return {};
}
