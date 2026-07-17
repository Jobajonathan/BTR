"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type VolunteerResult = { error?: string };

export async function submitVolunteerForm(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
  skills: string;
  availability: string;
  motivation: string;
}): Promise<VolunteerResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("volunteer_submissions").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    city: data.city || null,
    skills: data.skills || null,
    availability: data.availability || null,
    motivation: data.motivation || null,
  });
  if (error) return { error: error.message };
  return {};
}
