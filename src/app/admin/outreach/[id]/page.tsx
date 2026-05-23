import { createAdminClient } from "@/lib/supabase/admin";
import OutreachForm from "../OutreachForm";
import { notFound } from "next/navigation";

export default async function EditOutreachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("outreaches").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <>
      <div className="admin-topbar"><h1>Edit Outreach</h1></div>
      <div className="admin-content">
        <OutreachForm outreach={{
          id: data.id,
          title: data.title ?? "",
          slug: data.slug ?? "",
          location: data.location ?? "",
          date: data.date ?? "",
          summary: data.summary ?? "",
          gallery: data.gallery ?? [],
          impact_stats: data.impact_stats ?? [],
          partners: data.partners ?? [],
          testimonial: data.testimonial ?? "",
          testimonial_author: data.testimonial_author ?? ""
        }} />
      </div>
    </>
  );
}
