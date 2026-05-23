import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DialoguesPage() {
  const supabase = createAdminClient();
  const { data: dialogues } = await supabase
    .from("dialogues")
    .select("id, title, summary, date, guest, meta")
    .order("date", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero dark-page-hero">
        <p className="eyebrow">Dialogues</p>
        <h1>Conversations we were never taught to have.</h1>
        <p>
          Live sessions, community questions, and panel conversations that make mental health feel
          speakable.
        </p>
      </section>
      <section className="section">
        <SectionIntro
          kicker="Conversation archive"
          title="From comments to care."
          body="Each dialogue holds a recap, guest details, and key takeaways from the conversation."
        />
        <div className="feature-list">
          {dialogues && dialogues.length > 0 ? (
            dialogues.map((dialogue) => (
              <article className="feature-row" key={dialogue.id}>
                {dialogue.meta && <span className="tag">{dialogue.meta}</span>}
                <h2>{dialogue.title}</h2>
                {dialogue.summary && <p>{dialogue.summary}</p>}
                {dialogue.guest && (
                  <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                    Guest: {dialogue.guest}
                  </p>
                )}
              </article>
            ))
          ) : (
            <p style={{ color: "var(--muted)" }}>Dialogues coming soon.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
