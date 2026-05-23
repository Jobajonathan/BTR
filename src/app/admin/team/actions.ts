"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveTeamMember(data: {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  order_index: number;
}) {
  const supabase = createAdminClient();
  if (data.id) {
    const { error } = await supabase.from("team_members").update(data).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { id: _id, ...insert } = data;
    const { error } = await supabase.from("team_members").insert(insert);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
}
