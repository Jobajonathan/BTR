import { createAdminClient } from "@/lib/supabase/admin";
import ProjectForm from "../ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <>
      <div className="admin-topbar"><h1>Edit Project</h1></div>
      <div className="admin-content">
        <ProjectForm project={{
          id: data.id,
          title: data.title ?? "",
          slug: data.slug ?? "",
          description: data.description ?? "",
          cover_image_url: data.cover_image_url ?? "",
          status: (data.status as "draft" | "published") ?? "draft",
          order_index: data.order_index ?? 0,
        }} />
      </div>
    </>
  );
}
