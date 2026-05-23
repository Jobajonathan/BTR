import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function OutreachPage() {
  const supabase = createAdminClient();
  const { data: items } = await supabase
    .from("outreaches")
    .select("id, title, slug, location, date, summary")
    .order("date", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Outreach</p>
        <h1>Mental health work that leaves the screen.</h1>
        <p>
          A home for school visits, youth gatherings, partner campaigns, impact reports, and
          community care moments.
        </p>
      </section>
      <section className="section outreach-page-section">
        <SectionIntro
          kicker="Impact"
          title="Proof that the movement is real."
          body="Outreach pages make it easy for partners and supporters to see the work, the people served, and how to get involved."
        />
        <div className="resource-grid">
          {items && items.length > 0 ? (
            items.map((item) => (
              <article className="resource-card" key={item.id}>
                <h3>{item.title}</h3>
                {item.location && (
                  <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                    {item.location}{item.date ? ` · ${new Date(item.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}` : ""}
                  </p>
                )}
                {item.summary && <p>{item.summary}</p>}
              </article>
            ))
          ) : (
            <p style={{ color: "var(--muted)" }}>Outreach events coming soon.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
