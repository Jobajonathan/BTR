import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { SectionIntro } from "@/components/section-intro";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createAdminClient } from "@/lib/supabase/admin";

const defaultStats = [
  { value: "1M+",    label: "people reached through stories and conversations" },
  { value: "200+",   label: "community stories shared across Africa" },
  { value: "95%",    label: "of participants report better mental health understanding" },
  { value: "34,000", label: "young people reached through direct outreaches" }
];

const DEFAULT_SECTIONS = [
  { id: "stories",   visible: true, order: 1 },
  { id: "dialogues", visible: true, order: 2 },
  { id: "outreach",  visible: true, order: 3 },
  { id: "resources", visible: true, order: 4 }
];

const WHY_BTR_PILLARS = [
  {
    icon: "🌍",
    title: "Culturally Rooted",
    body: "We speak the language of Africa's youth — local stories, local contexts, and the realities that textbooks overlook."
  },
  {
    icon: "🙋🏾",
    title: "Youth-Driven",
    body: "Built by young people, for young people. Every decision we make centres the voices of those we serve."
  },
  {
    icon: "✍🏾",
    title: "Storytelling as Healing",
    body: "We believe sharing your story is an act of courage, community, and healing. Every story creates space for the next one."
  },
  {
    icon: "📱",
    title: "Accessible Anywhere",
    body: "From Instagram to campus halls, our work meets young people exactly where they are — online and offline."
  }
];

const TESTIMONIALS = [
  {
    quote:
      "BTR gave me language for what I was feeling. I didn't know how to talk about the pressure at home until I read a story that said exactly what I had been carrying silently.",
    name: "Ogechi B.",
    role: "Community member"
  },
  {
    quote:
      "The campus dialogue changed everything for me. I walked in not knowing a single person and walked out with a community. This is what mental health looks like in real life.",
    name: "Mercy U.",
    role: "University student"
  },
  {
    quote:
      "I submitted my story expecting it to disappear. Instead it sparked a conversation that helped others. Behind the Reels makes your story matter.",
    name: "Ebere A.",
    role: "Story contributor"
  }
];


export default async function Home() {
  const supabase = createAdminClient();

  const [
    { data: settings },
    { data: featuredStories },
    { data: latestDialogue },
    { data: resources }
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
    supabase.from("resources").select("id, title, excerpt, slug").limit(4)
  ]);

  const heroHeadline =
    settings?.hero_headline ??
    "Mental Health & Behavioural Change for Young People Across Africa.";
  const heroCopy =
    settings?.hero_copy ??
    "Behind the Reels is a pioneering mental health initiative empowering young people to understand, embrace, and invest in their mental health through storytelling, authentic dialogues, and ground-level community outreaches.";
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
        body="Personal essays, honest reflections, and educational articles that make invisible emotions easier to name, share, and heal from."
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
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link className="button secondary" href="/stories">
          Read all stories
        </Link>
      </div>
    </section>
  );

  const dialoguesSection = (
    <section key="dialogues" className="dialogue-section section dark-section">
      <SectionIntro
        kicker="Dialogues"
        title="Conversations we were never taught to have."
        body="Live sessions, expert interviews, community panels, and hard questions that turn shared posts into shared understanding and real community."
        dark
      />
      <article className="dialogue-card">
        <span className="tag">Latest dialogue</span>
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
          body="Schools, communities, partners, and supporters — see what the movement is doing offline through campus visits, community circles, and partner programmes."
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
        body="Culturally sensitive mental health resources written for young Africans — and the parents, teachers, and friends who want to show up for them."
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
      <div style={{ textAlign: "center", marginTop: 36 }}>
        <Link className="button secondary" href="/resources">
          Browse all resources
        </Link>
      </div>
    </section>
  );

  const sectionMap: Record<string, React.ReactNode> = {
    stories:   storiesSection,
    dialogues: dialoguesSection,
    outreach:  outreachSection,
    resources: resourcesSection
  };

  return (
    <main>
      <SiteHeader />

      {/* ── Hero ──────────────────────────────────────────────── */}
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
            <p>Stories that make hidden emotions easier to name.</p>
          </div>
          <div className="story-panel dialogue-panel">
            <span>Dialogues</span>
            <strong>Conversations we were never taught to have</strong>
          </div>
          <div className="portrait-orb" />
        </div>
      </section>

      {/* ── Impact strip ──────────────────────────────────────── */}
      <section className="impact-strip">
        <h2>A community moving mental health conversations from timelines into real life.</h2>
        {stats.map((stat) => (
          <div className="stat" key={`${stat.value}-${stat.label}`}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ── Dynamic programme sections ────────────────────────── */}
      {sections.map((s) => sectionMap[s.id] ?? null)}

      {/* ── Why BTR ───────────────────────────────────────────── */}
      <section className="section why-btr-section">
        <SectionIntro
          kicker="Why BTR"
          title="Mental health support built for Africa's youth."
          body="We know the pressures, the silences, and the stories young Africans carry. That's why everything we do is rooted in culture, community, and lived experience."
        />
        <div className="why-btr-grid">
          {WHY_BTR_PILLARS.map((pillar) => (
            <div className="why-btr-pillar" key={pillar.title}>
              <span className="why-btr-icon" aria-hidden="true">{pillar.icon}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="testimonials-section">
        <div className="testimonials-inner">
          <p className="eyebrow" style={{ marginBottom: 18 }}>Voices from the community</p>
          <h2 className="testimonials-heading">
            Real people. Real change.
          </h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <blockquote className="testimonial-card" key={t.name}>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community CTA ─────────────────────────────────────── */}
      <section className="community-cta">
        <h2>There is a story behind what you survived.</h2>
        <p>
          Join the community, share your story, or partner with Behind the Reels to make mental
          health conversations easier to start — and impossible to ignore.
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
