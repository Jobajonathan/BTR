import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import PartnersListClient from "./PartnersListClient";

export default async function AdminPartnersPage() {
  const supabase = createAdminClient();
  const { data: partners } = await supabase
    .from("partners")
    .select("id, name, category, featured, order_index, website_url, logo_url")
    .order("order_index", { ascending: true });

  return (
    <>
      <div className="admin-topbar">
        <h1>Partners</h1>
        <div className="topbar-actions">
          <a href="/partner" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            View page ↗
          </a>
          <Link href="/admin/partners/new" className="btn-primary">
            + Add partner
          </Link>
        </div>
      </div>
      <div className="admin-content">
        <PartnersListClient partners={partners ?? []} />
      </div>
    </>
  );
}
