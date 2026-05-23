import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function StoriesPage() {
  const supabase = createAdminClient();
  const { data: stories } = await supabase
    .from("stories")
    .select("id, title, slug, excerpt, cover_image_url, categories(title)")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Stories</p>
        <h1>Real stories for the feelings young Africans often carry quietly.</h1>
        <p>
          Essays, reflections, and educational pieces that turn hidden emotions into language,
          context, and care.
        </p>
      </section>
      <section className="section stories-section">
        <SectionIntro
          kicker="Editorial"
          title="Start with what feels familiar."
          body="These pieces are structured for readers arriving from social media who need more depth, not more noise."
        />
        <div className="card-grid wide-grid">
          {stories && stories.length > 0 ? (
            stories.map((story, index) => (
              <ContentCard
                accent={(index % 3) + 1}
                excerpt={story.excerpt ?? undefined}
                href={story.slug ? `/stories/${story.slug}` : "#"}
                image={story.cover_image_url ?? undefined}
                key={story.id}
                tag={(story.categories as unknown as { title: string } | null)?.title ?? "Story"}
                title={story.title}
              />
            ))
          ) : (
            <p style={{ color: "var(--muted)" }}>Stories coming soon.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
