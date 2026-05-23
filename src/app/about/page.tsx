import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AboutPage() {
  const supabase = createAdminClient();
  const { data: team } = await supabase
    .from("team_members")
    .select("id, name, role, bio, image_url")
    .order("order_index");

  return (
    <PageShell>
      <section className="page-hero about-hero">
        <p className="eyebrow">About</p>
        <h1>Behind the Reels exists for the stories people hide behind being fine.</h1>
        <p>
          We are building a youth-led mental health community for Africans through storytelling,
          dialogues, and outreaches.
        </p>
      </section>

      <section className="section mission-grid">
        <article>
          <span className="tag">Our idea</span>
          <h2>Behind every reel is a real person.</h2>
          <p>
            Social media shows fragments. Behind the Reels creates space for the emotions,
            pressure, family stories, identity questions, and healing journeys behind those
            fragments.
          </p>
        </article>
        <article>
          <span className="tag">Our work</span>
          <h2>Storytelling, dialogues, outreaches.</h2>
          <p>
            The website turns the Instagram movement into a deeper home for stories, practical
            resources, partner work, and community action.
          </p>
        </article>
      </section>

      {team && team.length > 0 && (
        <section className="section">
          <p className="eyebrow" style={{ marginBottom: 8 }}>Team</p>
          <h2 style={{ fontSize: "clamp(28px,3vw,42px)", marginBottom: 40 }}>
            The people behind the movement.
          </h2>
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" key={member.id}>
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="team-avatar"
                    unoptimized
                  />
                ) : (
                  <div className="team-avatar-placeholder" />
                )}
                <h3>{member.name}</h3>
                {member.role && <p className="team-role">{member.role}</p>}
                {member.bio && <p className="team-bio">{member.bio}</p>}
              </article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
