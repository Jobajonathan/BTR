import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { SectionIntro } from "@/components/section-intro";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createAdminClient } from "@/lib/supabase/admin";

const defaultStats = [
  { value: "1M+", label: "people reached through stories and conversations" },
  { value: "3", label: "core pillars: storytelling, dialogues, outreaches" },
  { value: "Africa", label: "centered voice, context, and community care" }
];

const DEFAULT_SECTIONS = [
  { id: "stories",   visible: true, order: 1 },
  { id: "dialogues", visible: true, order: 2 },
  { id: "outreach",  visible: true, order: 3 },
  { id: "resources", visible: true, order: 4 },
  { id: "projects",  visible: true, order: 5 }
];

export default async function Home() {
  const supabase = createAdminClient();

  const [
    { data: settings },
    { data: featuredStories },
    { data: latestDialogue },
    { data: resources },
    { data: projects }
  ] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single(),
    supabase
      .from("stories")
      .select("id, title, slug, excerpt, cover_image_url, categories(title)")
      .eq("featured", true)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("dialogues")
      .select("id, title, summary")
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("resources").select("id, title, excerpt, slug").limit(4),
    supabase
      .from("projects")
      .select("id, title, slug, description, cover_image_url")
      .eq("status", "published")
      .order("order_index", { ascending: true })
      .limit(4)
  ]);

  const heroHeadline = settings?.hero_headline ?? "Behind every reel is a real story.";
  const heroCopy =
    settings?.hero_copy ??
    "A fast-growing mental health community helping young Africans speak honestly about pressure, identity, family, anxiety, healing, and hope.";
  const primaryCtaLabel = settings?.hero_primary_cta_label ?? "Read Stories";
  const primaryCtaUrl = settings?.hero_primary_cta_url ?? "/stories";
  const secondaryCtaLabel = settings?.hero_secondary_cta_label ?? "Submit Your Story";
  const secondaryCtaUrl = settings?.hero_secondary_cta_url ?? "/submit";

  const stats: Array<{ value: string; label: string }> =
    Array.isArray(settings?.impact_stats) && settings.impact_stats.length
      ? settings.impact_stats
      : defaultStats;

  const rawSections =
    Array.isArray(settings?.homepage_sections) && settings.homepage_sections.length
      ? settings.homepage_sections
      : DEFAULT_SECTIONS;

  const sections = [...rawSections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible);

  const storiesSection = (
    <section key="stories" className="section stories-section">
      <SectionIntro
        kicker="Stories"
        title="Read what young Africans are carrying."
        body="Personal essays, reflections, and educational articles that make invisible emotions easier to understand."
      />
      <div className="card-grid">
        {featuredStories && featuredStories.length > 0 ? (
          featuredStories.map((story, index) => (
            <ContentCard
              accent={(index % 3) + 1}
              excerpt={story.excerpt ?? undefined}
              href={story.slug ? `/stories/${story.slug}` : "/stories"}
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
  );

  const dialoguesSection = (
    <section key="dialogues" className="dialogue-section section dark-section">
      <SectionIntro
        kicker="Dialogues"
        title="Conversations we were never taught to have."
        body="Live sessions, interviews, panels, and community questions that turn shared posts into shared understanding."
        dark
      />
      <article className="dialogue-card">
        <span className="tag">Next conversation</span>
        <h3>
          {latestDialogue?.title ??
            "Pressure, parents, and the version of yourself you perform online"}
        </h3>
        <p>
          {latestDialogue?.summary ??
            "A community dialogue on expectation, identity, and choosing honesty when everyone expects you to be fine."}
        </p>
        <Link className="button primary" href="/dialogues">
          View Dialogues
        </Link>
      </article>
    </section>
  );

  const outreachSection = (
    <section key="outreach" className="section outreach-section">
      <div className="outreach-collage" aria-hidden="true">
        <div>Campus dialogue</div>
        <div>Community circle</div>
        <div>Partner outreach</div>
      </div>
      <div>
        <SectionIntro
          kicker="Outreach"
          title="Mental health work that leaves the screen."
          body="Schools, communities, partners, and supporters — see what the movement is doing offline through recaps, galleries, and impact reports."
        />
        <Link className="button primary" href="/outreach">
          Explore Impact
        </Link>
      </div>
    </section>
  );

  const resourcesSection = (
    <section key="resources" className="section resources-section">
      <SectionIntro
        kicker="Resources"
        title="Practical guides for the moments that feel heavy."
        body="Culturally sensitive mental health resources written for young Africans and the people who care about them."
      />
      <div className="resource-grid">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Link
              className="resource-card"
              href={resource.slug ? `/resources/${resource.slug}` : "/resources"}
              key={resource.id}
            >
              <h3>{resource.title}</h3>
              <p>{resource.excerpt ?? "Guide · 5 min read"}</p>
              <span className="resource-card-cta">Read more →</span>
            </Link>
          ))
        ) : (
          <p style={{ color: "var(--muted)" }}>Resources coming soon.</p>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 36 }}>
        <Link className="button secondary" href="/resources">
          Browse all resources
        </Link>
      </div>
    </section>
  );

  const projectsSection = projects && projects.length > 0 ? (
    <section key="projects" className="section" style={{ background: "var(--cream)" }}>
      <SectionIntro
        kicker="Projects"
        title="Our ongoing work."
        body="Long-term initiatives, series, and campaigns that go beyond individual posts."
      />
      <div className="card-grid">
        {projects.map((project, index) => (
          <ContentCard
            accent={(index % 3) + 1}
            excerpt={project.description ?? undefined}
            href={project.slug ? `/projects/${project.slug}` : "/projects"}
            image={project.cover_image_url ?? undefined}
            key={project.id}
            tag="Project"
            title={project.title}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link className="button secondary" href="/projects">View all projects</Link>
      </div>
    </section>
  ) : null;

  const sectionMap: Record<string, React.ReactNode> = {
    stories: storiesSection,
    dialogues: dialoguesSection,
    outreach: outreachSection,
    resources: resourcesSection,
    projects: projectsSection
  };

  return (
    <main>
      <SiteHeader />

      <section className="hero section">
        <div className="hero-copy">
          <p className="eyebrow">Mental health for young Africans</p>
          <h1>{heroHeadline}</h1>
          <p className="hero-lede">{heroCopy}</p>
          <div className="actions">
            <Link className="button primary" href={primaryCtaUrl}>
              {primaryCtaLabel}
            </Link>
            <Link className="button secondary" href={secondaryCtaUrl}>
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="story-panel family-panel">
            <span>Family &amp; Silence</span>
            <strong>The things we never said at home</strong>
          </div>
          <div className="story-panel dialogue-panel">
            <span>Dialogues</span>
            <strong>Conversations we were never taught to have</strong>
          </div>
          <div className="portrait-orb" />
        </div>
      </section>

      <section className="impact-strip">
        <h2>A community moving mental health conversations from timelines into real life.</h2>
        {stats.map((stat) => (
          <div className="stat" key={`${stat.value}-${stat.label}`}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {sections.map((s) => sectionMap[s.id] ?? null)}

      <section className="community-cta">
        <h2>There is a story behind what you survived.</h2>
        <p>
          Join the community, share your story, or partner with Behind the Reels to make mental health
          conversations easier to start.
        </p>
        <div className="actions">
          <Link className="button light" href="/join">
            Join the Community
          </Link>
          <Link className="button light" href="/partner">
            Partner With Us
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
