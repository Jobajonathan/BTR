import { createAdminClient } from "@/lib/supabase/admin";
import VolunteersClient from "./VolunteersClient";

export const dynamic = "force-dynamic";

export default async function VolunteersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("volunteer_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Volunteer Applications</h1>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            {data?.filter((v) => v.status === "new" || !v.status).length ?? 0} new ·{" "}
            {data?.length ?? 0} total
          </span>
        </div>
      </div>
      <div className="admin-content">
        <VolunteersClient volunteers={data ?? []} />
      </div>
    </>
  );
}
