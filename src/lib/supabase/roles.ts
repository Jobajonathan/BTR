import { createAdminClient } from "./admin";

export type AdminRole = "super_admin" | "editor" | "author" | "moderator";

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  author: "Author",
  moderator: "Moderator"
};

/** Permissions per role — what nav sections each role can access */
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: [
    "dashboard", "stories", "blog", "dialogues", "outreach", "resources",
    "authors", "team", "submissions", "users", "settings", "branding",
    "newsletter", "partners", "media", "activity"
  ],
  editor: [
    "dashboard", "stories", "blog", "dialogues", "outreach", "resources",
    "authors", "team", "submissions", "newsletter", "partners", "media"
  ],
  author: ["dashboard", "blog", "media"],
  moderator: ["dashboard", "submissions"]
};

export async function getUserRole(userId: string): Promise<AdminRole> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", userId)
    .single();
  // If no role row exists, treat as super_admin (initial setup)
  return (data?.role as AdminRole) ?? "super_admin";
}

export function hasPermission(role: AdminRole, section: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(section) ?? false;
}
