import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DialoguesPage() {
  const supabase = createAdminClient();
  const { data: dialogues } = await supabase
    .from("dialogues")
    .select("id, title, slug, summary, date, guest, meta, cover_image_url")
    .order("date", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero dark-page-hero">
        <p className="eyebrow" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
          Dialogues
        </p>
        <h1>Conversations we were never taught to have.</h1>
        <p>
          Live sessions, community questions, and panel conversations that make mental health feel
          speakable.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 72 }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            paddingLeft: "clamp(24px,6vw,88px)",
            paddingRight: "clamp(24px,6vw,88px)"
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 16 }}>Conversation archive</p>
          <h2 style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 48, marginTop: 12 }}>
            From comments to care.
          </h2>

          {dialogues && dialogues.length > 0 ? (
            <div className="dialogues-grid">
              {dialogues.map((d) => (
                <article className="dialogue-listing-card" key={d.id}>
                  <div className="dialogue-card-visual">
                    {d.cover_image_url ? (
                      <Image
                        src={d.cover_image_url}
                        alt={d.title}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
                      <div className="dialogue-card-placeholder" />
                    )}
                    {d.meta && <span className="dialogue-card-meta">{d.meta}</span>}
                  </div>
                  <div className="dialogue-card-body">
                    {d.date && (
                      <p className="dialogue-card-date">
                        {new Date(d.date).toLocaleDateString("en-GB", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </p>
                    )}
                    <h3>{d.title}</h3>
                    {d.guest && (
                      <p className="dialogue-card-guest">Guest: {d.guest}</p>
                    )}
                    {d.summary && <p className="dialogue-card-summary">{d.summary}</p>}
                    <Link href={`/dialogues/${d.slug}`} className="dialogue-card-link">
                      Read recap →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "72px 0", color: "var(--muted)" }}>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Dialogues coming soon.
              </p>
              <p>
                We&apos;re building our conversation archive. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
