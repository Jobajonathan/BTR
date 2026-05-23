import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("dialogues").select("title, summary").eq("slug", slug).single();
  if (!data) return {};
  return { title: `${data.title} | BTR Dialogues`, description: data.summary };
}

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
      {/* Hero */}
      <section
        style={{
          background: "var(--ink)",
          color: "#fff",
          padding: "clamp(56px,8vw,100px) clamp(24px,6vw,88px) clamp(40px,5vw,64px)"
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <Link href="/dialogues" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
            ← Back to Dialogues
          </Link>
          {dialogue.meta && (
            <span className="tag" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", marginBottom: 20, display: "inline-flex" }}>
              {dialogue.meta}
            </span>
          )}
          <h1 style={{ fontSize: "clamp(32px,5vw,58px)", lineHeight: 1.05, margin: "16px 0 20px" }}>
            {dialogue.title}
          </h1>
          {dialogue.summary && (
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#c5d5c9", lineHeight: 1.5, marginBottom: 24 }}>
              {dialogue.summary}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 14, color: "rgba(255,255,255,0.55)" }}>
            {dialogue.guest && <span>Guest: <strong style={{ color: "#fff" }}>{dialogue.guest}</strong></span>}
            {dialogue.date && (
              <span>
                {new Date(dialogue.date).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Cover image */}
      {dialogue.cover_image_url && (
        <div style={{ position: "relative", width: "100%", height: "clamp(280px,40vw,500px)", maxWidth: 1080, margin: "0 auto" }}>
          <Image
            src={dialogue.cover_image_url}
            alt={dialogue.title}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
      )}

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px,5vw,64px) clamp(24px,6vw,88px)" }}>

        {/* Recording link */}
        {dialogue.recording_url && (
          <div style={{ background: "var(--green-soft)", borderRadius: 10, padding: "20px 24px", marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: "var(--green)", margin: 0 }}>Recording available</p>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "2px 0 0" }}>Watch or listen to the full conversation.</p>
            </div>
            <a
              href={dialogue.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
              style={{ minHeight: 44, fontSize: 14 }}
            >
              Watch / Listen →
            </a>
          </div>
        )}

        {/* Key takeaways */}
        {takeaways.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px,2.5vw,28px)", marginBottom: 20 }}>Key Takeaways</h2>
            <ol style={{ padding: 0, listStyle: "none", display: "grid", gap: 14 }}>
              {takeaways.map((t, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: "16px 20px",
                    alignItems: "flex-start"
                  }}
                >
                  <span style={{
                    background: "var(--green)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, lineHeight: 1.5, fontSize: 16 }}>{t}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
          <Link href="/dialogues" className="button secondary">
            ← All Dialogues
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
