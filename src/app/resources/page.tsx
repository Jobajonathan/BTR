import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ResourcesPage() {
  const supabase = createAdminClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, slug, excerpt")
    .order("created_at", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Resources</p>
        <h1>Guides for the moments that feel heavy.</h1>
        <p>
          Practical, culturally sensitive mental health resources for young Africans and the people
          who care about them.
        </p>
      </section>
      <section className="section resources-section">
        <SectionIntro
          kicker="Resource hub"
          title="Clear language, gentle direction."
          body="Each resource is a practical guide with body content, support links, and related stories."
        />
        <div className="resource-grid">
          {resources && resources.length > 0 ? (
            resources.map((resource) => (
              <article className="resource-card" key={resource.id}>
                <h3>{resource.title}</h3>
                <p>{resource.excerpt ?? "Guide · 5 min read"}</p>
              </article>
            ))
          ) : (
            <p style={{ color: "var(--muted)" }}>Resources coming soon.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
