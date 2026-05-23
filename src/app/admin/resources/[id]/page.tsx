import { createAdminClient } from "@/lib/supabase/admin";
import ResourceForm from "../ResourceForm";
import { notFound } from "next/navigation";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("resources").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <>
      <div className="admin-topbar"><h1>Edit Resource</h1></div>
      <div className="admin-content">
        <ResourceForm resource={{
          id: data.id,
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          cover_image_url: data.cover_image_url ?? "",
          body: data.body?.html ?? ""
        }} />
      </div>
    </>
  );
}
