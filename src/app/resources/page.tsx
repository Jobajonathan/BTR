import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { fallbackResources } from "@/lib/content";

export default function ResourcesPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Resources</p>
        <h1>Guides for the moments that feel heavy.</h1>
        <p>
          Practical, culturally sensitive mental health resources for young
          Africans and the people who care about them.
        </p>
      </section>
      <section className="section resources-section">
        <SectionIntro
          kicker="Resource hub"
          title="Clear language, gentle direction."
          body="Each resource can later become a Sanity-managed guide with body content, support links, and related stories."
        />
        <div className="resource-grid">
          {fallbackResources.map((resource) => (
            <article className="resource-card" key={resource._id}>
              <h3>{resource.title}</h3>
              <p>{resource.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
