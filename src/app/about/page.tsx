import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

const GOALS = [
  {
    number: "01",
    title: "Create Safe Spaces for Expression",
    body: "Build platforms — online and offline — where young Africans can share their mental health experiences without fear of judgement, stigma, or silence."
  },
  {
    number: "02",
    title: "Educate Through Storytelling",
    body: "Use personal narratives, expert conversations, and curated resources to improve mental health literacy across African youth communities."
  },
  {
    number: "03",
    title: "Drive Systemic Change",
    body: "Partner with institutions, governments, and community leaders to embed mental health support into schools, workplaces, and cultural life across Africa."
  }
];

const VALUES = [
  {
    icon: "🌱",
    title: "Authenticity",
    body: "We tell real stories, not polished versions. Authenticity is the foundation of every conversation we create."
  },
  {
    icon: "🤝",
    title: "Community First",
    body: "The people we serve are never the audience — they are the authors. Every initiative is co-created with the community."
  },
  {
    icon: "💚",
    title: "Care Without Judgement",
    body: "We hold space for every kind of struggle — grief, anxiety, family pressure, identity, burnout — without hierarchy or judgement."
  },
  {
    icon: "🔥",
    title: "African Excellence",
    body: "Our work celebrates the resilience, creativity, and depth of African young people. We are African, for Africans, by Africans."
  }
];

export default async function AboutPage() {
  const supabase = createAdminClient();
  const { data: team } = await supabase
    .from("team_members")
    .select("id, name, role, bio, image_url")
    .order("order_index");

  return (
    <PageShell>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero about-hero">
        <p className="eyebrow">About Behind the Reels</p>
        <h1>
          A pioneering mental health initiative for young people across Africa.
        </h1>
        <p>
          We exist for the stories people hide behind being fine — building a movement that
          makes mental health conversations as normal as the struggles that demand them.
        </p>
      </section>

      {/* ── Mission ───────────────────────────────────────────── */}
      <section className="section mission-grid">
        <article>
          <span className="tag">Our mission</span>
          <h2>To empower young Africans to understand, embrace, and invest in their mental health.</h2>
          <p>
            Behind the Reels was born from a simple observation: social media is full of
            highlight reels, but the real struggles — anxiety, family pressure, grief,
            burnout, identity — stay hidden. We create the space where those stories come
            out, and where healing begins.
          </p>
        </article>
        <article>
          <span className="tag">Our approach</span>
          <h2>Storytelling, dialogues, outreaches, and advocacy — all in one movement.</h2>
          <p>
            We meet young Africans where they are: on Instagram, on campus, in community
            halls, and in their own words. Through authentic stories, honest conversations,
            ground-level outreaches, and policy engagement, we are building the mental
            health infrastructure Africa's youth deserve.
          </p>
        </article>
      </section>

      {/* ── Goals ─────────────────────────────────────────────── */}
      <section className="section about-goals-section">
        <div style={{ maxWidth: 720, margin: "0 auto 52px" }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>What we are building toward</p>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.05, margin: "12px 0 18px" }}>
            Three goals driving everything we do.
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.55, margin: 0 }}>
            Every story we publish, every dialogue we host, every campus we visit is in
            service of these three outcomes.
          </p>
        </div>
        <div className="about-goals-grid">
          {GOALS.map((goal) => (
            <article className="about-goal-card" key={goal.number}>
              <span className="about-goal-number">{goal.number}</span>
              <h3>{goal.title}</h3>
              <p>{goal.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section className="section about-values-section">
        <p className="eyebrow" style={{ marginBottom: 16 }}>Our values</p>
        <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.05, margin: "12px 0 44px", maxWidth: 600 }}>
          The principles behind the movement.
        </h2>
        <div className="about-values-grid">
          {VALUES.map((value) => (
            <div className="about-value-card" key={value.title}>
              <span className="about-value-icon" aria-hidden="true">{value.icon}</span>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core message ──────────────────────────────────────── */}
      <section className="about-core-message">
        <div className="about-core-inner">
          <p className="eyebrow" style={{ marginBottom: 20 }}>Why it matters</p>
          <blockquote>
            &ldquo;Mental health is not a luxury. It is the foundation of everything — how we
            learn, how we love, how we lead, and how we grow. Young Africans deserve a
            movement that treats it that way.&rdquo;
          </blockquote>
          <p className="about-core-attribution">— Behind the Reels</p>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      {team && team.length > 0 && (
        <section className="section" style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Team</p>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", marginBottom: 48, marginTop: 12 }}>
            The people behind the movement.
          </h2>
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" key={member.id}>
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    width={88}
                    height={88}
                    className="team-avatar"
                    unoptimized
                  />
                ) : (
                  <div className="team-avatar-placeholder" />
                )}
                <div className="team-card-info">
                  <h3>{member.name}</h3>
                  {member.role && <p className="team-role">{member.role}</p>}
                  {member.bio && <p className="team-bio">{member.bio}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
