import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { dialogues } from "@/lib/content";

export default function DialoguesPage() {
  return (
    <PageShell>
      <section className="page-hero dark-page-hero">
        <p className="eyebrow">Dialogues</p>
        <h1>Conversations we were never taught to have.</h1>
        <p>
          Live sessions, community questions, and panel conversations that make
          mental health feel speakable.
        </p>
      </section>
      <section className="section">
        <SectionIntro
          kicker="Conversation archive"
          title="From comments to care."
          body="Each dialogue can hold a recording, guest details, recap notes, and related resources once Sanity is connected."
        />
        <div className="feature-list">
          {dialogues.map((dialogue) => (
            <article className="feature-row" key={dialogue.title}>
              <span className="tag">{dialogue.meta}</span>
              <h2>{dialogue.title}</h2>
              <p>{dialogue.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
