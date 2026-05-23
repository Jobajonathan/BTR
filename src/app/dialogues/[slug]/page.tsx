import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DialoguePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: dialogue } = await supabase
    .from("dialogues")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!dialogue) notFound();

  const takeaways: string[] = Array.isArray(dialogue.key_takeaways) ? dialogue.key_takeaways : [];

  return (
    <PageShell>
      <article className="story-article">
        <header className="story-header">
          {dialogue.meta && <span className="tag">{dialogue.meta}</span>}
          <h1>{dialogue.title}</h1>
          {dialogue.summary && <p className="story-lede">{dialogue.summary}</p>}
          <p className="story-byline">
            {dialogue.guest && `Guest: ${dialogue.guest}`}
            {dialogue.guest && dialogue.date && " · "}
            {dialogue.date &&
              new Date(dialogue.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
          </p>
        </header>

        {dialogue.cover_image_url && (
          <img src={dialogue.cover_image_url} alt={dialogue.title} className="story-cover" />
        )}

        {dialogue.recording_url && (
          <div style={{ margin: "24px 0" }}>
            <a
              href={dialogue.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              Watch / Listen
            </a>
          </div>
        )}

        {takeaways.length > 0 && (
          <div style={{ margin: "32px 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Key Takeaways</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
              {takeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <Link href="/dialogues" className="button secondary">
            ← Back to Dialogues
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
