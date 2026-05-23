import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/roles";
import { redirect } from "next/navigation";
import { listAdminUsers } from "./actions";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const role = await getUserRole(user.id);
  if (role !== "super_admin") redirect("/admin");

  const users = await listAdminUsers();

  return (
    <>
      <div className="admin-topbar">
        <h1>Admin Users</h1>
      </div>
      <UsersClient users={users} currentUserId={user.id} />
    </>
  );
}
