import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  const supabase = createAdminClient();
  const { data: items } = await supabase
    .from("outreaches")
    .select("id, title, slug, location, date, summary, cover_image_url, impact_stats")
    .order("date", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--paper)" }}>
        <p className="eyebrow">Outreach</p>
        <h1>Mental health work that leaves the screen.</h1>
        <p>
          School visits, youth gatherings, partner campaigns, and community care moments — proof
          that the movement is real.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 72 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Impact</p>
          <h2 style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 48, marginTop: 12 }}>
            Every outreach tells a story.
          </h2>

          {items && items.length > 0 ? (
            <div className="outreach-listing-grid">
              {items.map((item) => {
                const stats: Array<{ value: string; label: string }> = Array.isArray(item.impact_stats)
                  ? item.impact_stats.slice(0, 3)
                  : [];
                return (
                  <article key={item.id} className="outreach-listing-card">
                    <div className="outreach-listing-visual">
                      {item.cover_image_url ? (
                        <Image
                          src={item.cover_image_url}
                          alt={item.title}
                          fill
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      ) : (
                        <div className="outreach-listing-placeholder" />
                      )}
                    </div>
                    <div className="outreach-listing-body">
                      <div className="outreach-listing-meta">
                        {item.location && <span>{item.location}</span>}
                        {item.location && item.date && <span>·</span>}
                        {item.date && (
                          <span>
                            {new Date(item.date).toLocaleDateString("en-GB", {
                              month: "long", year: "numeric"
                            })}
                          </span>
                        )}
                      </div>
                      <h3>{item.title}</h3>
                      {stats.length > 0 && (
                        <div className="outreach-listing-stats">
                          {stats.map((s, i) => (
                            <div key={i} className="outreach-stat-chip">
                              <strong>{s.value}</strong>
                              <span>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.summary && (
                        <p className="outreach-listing-summary">{item.summary}</p>
                      )}
                      <Link href={`/outreach/${item.slug}`} className="outreach-listing-link">
                        Read report →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "72px 0", color: "var(--muted)" }}>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Outreach events coming soon.
              </p>
              <p>We are building our impact archive. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
