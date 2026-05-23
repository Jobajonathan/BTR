import { createAdminClient } from "@/lib/supabase/admin";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  const supabase = createAdminClient();
  const { data: members } = await supabase.from("team_members").select("*").order("order_index");

  return (
    <>
      <div className="admin-topbar"><h1>Team Members</h1></div>
      <div className="admin-content">
        <TeamClient members={members ?? []} />
      </div>
    </>
  );
}
