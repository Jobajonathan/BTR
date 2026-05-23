"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { type AdminRole } from "@/lib/supabase/roles";
import { revalidatePath } from "next/cache";

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
  invited_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
};

export type ActionResult = { error?: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://btr.theryters.com";

export async function listAdminUsers(): Promise<AdminUser[]> {
  const supabase = createAdminClient();

  const [{ data: roles }, { data: authData }] = await Promise.all([
    supabase.from("admin_roles").select("user_id, email, role, created_at").order("created_at"),
    supabase.auth.admin.listUsers({ perPage: 1000 })
  ]);

  const roleMap = new Map(roles?.map((r) => [r.user_id, r]) ?? []);

  return (authData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    role: (roleMap.get(u.id)?.role as AdminRole) ?? "super_admin",
    created_at: u.created_at,
    invited_at: (u as unknown as Record<string, unknown>).invited_at as string | null ?? null,
    email_confirmed_at: u.email_confirmed_at ?? null,
    last_sign_in_at: u.last_sign_in_at ?? null
  }));
}

export async function inviteAdminUser(email: string, role: AdminRole): Promise<ActionResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/admin/login`
  });

  // "User already registered" — their Auth record exists but has no admin role.
  // Look them up and restore the role so they can sign in again.
  if (error) {
    if (error.message.toLowerCase().includes("already") || error.status === 422) {
      const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const existing = list?.users.find((u) => u.email === email);
      if (!existing) return { error: error.message };

      const { error: roleError } = await supabase.from("admin_roles").upsert({
        user_id: existing.id,
        email,
        role
      });
      if (roleError) return { error: roleError.message };

      // Send a password-reset email so they can get back in
      await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo: `${SITE_URL}/admin/login` }
      });

      revalidatePath("/admin/users");
      return {};
    }
    return { error: error.message };
  }

  const { error: roleError } = await supabase.from("admin_roles").upsert({
    user_id: data.user.id,
    email,
    role
  });

  if (roleError) return { error: roleError.message };

  revalidatePath("/admin/users");
  return {};
}

export async function resendInvitation(email: string, role: AdminRole): Promise<ActionResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/admin/login`
  });

  if (error) return { error: error.message };

  const { error: roleError } = await supabase.from("admin_roles").upsert({
    user_id: data.user.id,
    email,
    role
  });

  if (roleError) return { error: roleError.message };

  revalidatePath("/admin/users");
  return {};
}

export async function updateUserRole(userId: string, role: AdminRole): Promise<ActionResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("admin_roles")
    .update({ role })
    .eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return {};
}

export async function removeAdminUser(userId: string): Promise<ActionResult> {
  const supabase = createAdminClient();

  // Remove role record first
  const { error: roleError } = await supabase
    .from("admin_roles")
    .delete()
    .eq("user_id", userId);
  if (roleError) return { error: roleError.message };

  // Delete from Supabase Auth so the email can be re-invited cleanly later
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) return { error: authError.message };

  revalidatePath("/admin/users");
  return {};
}
