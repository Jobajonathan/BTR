import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { fallbackStories } from "@/lib/content";

export default function StoriesPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Stories</p>
        <h1>Real stories for the feelings young Africans often carry quietly.</h1>
        <p>
          Essays, reflections, and educational pieces that turn hidden emotions
          into language, context, and care.
        </p>
      </section>
      <section className="section stories-section">
        <SectionIntro
          kicker="Editorial"
          title="Start with what feels familiar."
          body="These pieces are structured for readers arriving from social media who need more depth, not more noise."
        />
        <div className="card-grid wide-grid">
          {fallbackStories.map((story, index) => (
            <ContentCard
              accent={(index % 3) + 1}
              excerpt={story.excerpt}
              key={story._id}
              tag={story.category}
              title={story.title}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
