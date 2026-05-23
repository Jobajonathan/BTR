"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { type AdminRole } from "@/lib/supabase/roles";
import { revalidatePath } from "next/cache";

export async function inviteAdminUser(email: string, role: AdminRole) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://btr.theryters.com"}/admin/login`
  });

  if (error) throw new Error(error.message);

  await supabase.from("admin_roles").upsert({
    user_id: data.user.id,
    email,
    role
  });

  revalidatePath("/admin/users");
}

export async function updateUserRole(userId: string, role: AdminRole) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("admin_roles")
    .update({ role })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function removeAdminUser(userId: string) {
  const supabase = createAdminClient();
  await supabase.from("admin_roles").delete().eq("user_id", userId);
  revalidatePath("/admin/users");
}

export async function listAdminUsers() {
  const supabase = createAdminClient();
  const { data: roles } = await supabase
    .from("admin_roles")
    .select("user_id, email, role, created_at")
    .order("created_at");

  // Also pull any authenticated users not yet in admin_roles
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const roleMap = new Map(roles?.map((r) => [r.user_id, r]) ?? []);

  return (authUsers?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    role: (roleMap.get(u.id)?.role as AdminRole) ?? "super_admin",
    created_at: u.created_at
  }));
}
