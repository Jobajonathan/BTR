import { createAdminClient } from "@/lib/supabase/admin";
import SubmissionsClient from "./SubmissionsClient";

export default async function SubmissionsPage() {
  const supabase = createAdminClient();
  const { data: submissions } = await supabase
    .from("story_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar"><h1>Story Submissions</h1></div>
      <div className="admin-content">
        <SubmissionsClient submissions={submissions ?? []} />
      </div>
    </>
  );
}
