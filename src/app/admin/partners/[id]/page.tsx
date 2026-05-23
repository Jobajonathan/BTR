import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import PartnerForm from "../PartnerForm";

export default async function EditPartnerPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: partner } = await supabase
    .from("partners")
    .select("*")
    .eq("id", id)
    .single();

  if (!partner) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h1>Edit Partner</h1>
      </div>
      <div className="admin-content">
        <PartnerForm
          partner={{
            id: partner.id,
            name: partner.name ?? "",
            description: partner.description ?? "",
            logo_url: partner.logo_url ?? "",
            website_url: partner.website_url ?? "",
            category: partner.category ?? "",
            featured: partner.featured ?? false,
            order_index: partner.order_index ?? 0
          }}
        />
      </div>
    </>
  );
}
