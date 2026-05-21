import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { outreachItems } from "@/lib/content";

export default function OutreachPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Outreach</p>
        <h1>Mental health work that leaves the screen.</h1>
        <p>
          A home for school visits, youth gatherings, partner campaigns, impact
          reports, and community care moments.
        </p>
      </section>
      <section className="section outreach-page-section">
        <SectionIntro
          kicker="Impact"
          title="Proof that the movement is real."
          body="Outreach pages should make it easy for partners and supporters to understand the work, see the people served, and get involved."
        />
        <div className="resource-grid">
          {outreachItems.map((item) => (
            <article className="resource-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
