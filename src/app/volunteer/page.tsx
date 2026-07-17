import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import VolunteerForm from "./VolunteerForm";

export const dynamic = "force-dynamic";

export default async function VolunteerPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("volunteer_headline, volunteer_copy")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single();

  const headline = settings?.volunteer_headline ?? "Join the movement.";
  const copy = settings?.volunteer_copy ?? "Be part of the team bringing mental health conversations to young Africans. We welcome writers, designers, counsellors, event coordinators, and anyone who cares.";

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Volunteer</p>
        <h1>{headline}</h1>
        <p>{copy}</p>
      </section>

      <section className="section" style={{ paddingTop: 64, maxWidth: 780, margin: "0 auto" }}>
        <VolunteerForm />
      </section>
    </PageShell>
  );
}
