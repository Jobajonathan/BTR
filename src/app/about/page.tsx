import { PageShell } from "@/components/page-shell";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="page-hero about-hero">
        <p className="eyebrow">About</p>
        <h1>Behind the Reels exists for the stories people hide behind being fine.</h1>
        <p>
          We are building a youth-led mental health community for Africans
          through storytelling, dialogues, and outreaches.
        </p>
      </section>
      <section className="section mission-grid">
        <article>
          <span className="tag">Our idea</span>
          <h2>Behind every reel is a real person.</h2>
          <p>
            Social media shows fragments. Behind the Reels creates space for the
            emotions, pressure, family stories, identity questions, and healing
            journeys behind those fragments.
          </p>
        </article>
        <article>
          <span className="tag">Our work</span>
          <h2>Storytelling, dialogues, outreaches.</h2>
          <p>
            The website turns the Instagram movement into a deeper home for
            stories, practical resources, partner work, and community action.
          </p>
        </article>
      </section>
    </PageShell>
  );
}
