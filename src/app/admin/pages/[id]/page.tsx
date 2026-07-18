import { createAdminClient } from "@/lib/supabase/admin";
import PageForm from "../PageForm";
import { notFound } from "next/navigation";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("custom_pages").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <>
      <div className="admin-topbar"><h1>Edit Page</h1></div>
      <div className="admin-content">
        <PageForm page={{
          id: data.id,
          title: data.title ?? "",
          slug: data.slug ?? "",
          content: data.content ?? "",
          seo_title: data.seo_title ?? "",
          seo_description: data.seo_description ?? "",
          status: (data.status as "draft" | "published") ?? "draft",
        }} />
      </div>
    </>
  );
}
