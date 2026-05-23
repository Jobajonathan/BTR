"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteSubscriber(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/newsletter");
}

export async function exportSubscribersCSV(): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, name, source, confirmed, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const header = "email,name,source,confirmed,created_at";
  const rows = (data ?? []).map((r) =>
    [r.email, r.name ?? "", r.source ?? "", r.confirmed ? "yes" : "no", r.created_at].join(",")
  );
  return [header, ...rows].join("\n");
}
