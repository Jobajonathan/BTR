import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/roles";
import AdminNav from "./AdminNav";
import "./admin.css";

export const metadata = { title: "BTR Admin" };

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // No user = middleware should have redirected, but if on /admin/login render clean
  if (!user) {
    return <>{children}</>;
  }

  const role = await getUserRole(user.id);

  return (
    <div className="admin-shell">
      <AdminNav userEmail={user.email ?? ""} role={role} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
