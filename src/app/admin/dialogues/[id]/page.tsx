import { createAdminClient } from "@/lib/supabase/admin";
import DialogueForm from "../DialogueForm";
import { notFound } from "next/navigation";

export default async function EditDialoguePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("dialogues").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <>
      <div className="admin-topbar"><h1>Edit Dialogue</h1></div>
      <div className="admin-content">
        <DialogueForm dialogue={{
          id: data.id,
          title: data.title ?? "",
          slug: data.slug ?? "",
          date: data.date ? new Date(data.date).toISOString().slice(0, 16) : "",
          guest: data.guest ?? "",
          summary: data.summary ?? "",
          cover_image_url: data.cover_image_url ?? "",
          recording_url: data.recording_url ?? "",
          key_takeaways: data.key_takeaways ?? [],
          meta: data.meta ?? ""
        }} />
      </div>
    </>
  );
}
