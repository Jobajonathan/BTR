import { PageShell } from "@/components/page-shell";

export default function PartnerPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Partner</p>
        <h1>Support mental health conversations for young Africans.</h1>
        <p>
          Partner on outreaches, campaigns, school programs, content series, or
          community care initiatives.
        </p>
      </section>
      <section className="section mission-grid">
        <article>
          <span className="tag">Schools</span>
          <h2>Bring dialogues into student communities.</h2>
          <p>Host listening circles, mental health days, and moderated panels.</p>
        </article>
        <article>
          <span className="tag">Organizations</span>
          <h2>Fund campaigns and practical support.</h2>
          <p>Help the movement reach more young Africans online and offline.</p>
        </article>
      </section>
    </PageShell>
  );
}
