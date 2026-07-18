"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type PledgeResult = { error?: string };

export async function submitPledge(data: {
  name: string;
  email: string;
  amount: number;
  currency: string;
  frequency: string;
  message: string;
  honeypot: string;
}): Promise<PledgeResult> {
  if (data.honeypot) return {};

  if (!data.name || !data.email || !data.amount || !data.frequency) {
    return { error: "Please fill in all required fields." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("donation_pledges").insert({
    name: data.name,
    email: data.email,
    amount: data.amount,
    currency: data.currency,
    frequency: data.frequency,
    message: data.message || null,
  });

  if (error) return { error: error.message };
  return {};
}
