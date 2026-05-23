import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("outreaches").select("title, summary").eq("slug", slug).single();
  if (!data) return {};
  return { title: `${data.title} | BTR Outreach`, description: data.summary };
}

export default async function OutreachDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: item } = await supabase
    .from("outreaches")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!item) notFound();

  const gallery: string[] = Array.isArray(item.gallery) ? item.gallery : [];
  const impactStats: Array<{ value: string; label: string }> = Array.isArray(item.impact_stats) ? item.impact_stats : [];
  const partners: string[] = Array.isArray(item.partners) ? item.partners : [];

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,88px) clamp(24px,6vw,88px)" }}>
        <div style={{ maxWidth: 840 }}>
          <Link href="/outreach" style={{ fontSize: 13, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
            ← Back to Outreach
          </Link>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>Outreach</span>
          <h1 style={{ fontSize: "clamp(32px,5vw,58px)", lineHeight: 1.05, margin: "16px 0 20px" }}>
            {item.title}
          </h1>
          {item.summary && (
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "var(--muted)", lineHeight: 1.5, marginBottom: 24 }}>
              {item.summary}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 14, color: "var(--muted)" }}>
            {item.location && <span>📍 {item.location}</span>}
            {item.date && (
              <span>
                📅 {new Date(item.date).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Impact stats */}
      {impactStats.length > 0 && (
        <div style={{ background: "var(--green)", color: "#fff", padding: "clamp(32px,4vw,52px) clamp(24px,6vw,88px)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`, gap: 32 }}>
            {impactStats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <strong style={{ display: "block", fontSize: "clamp(36px,5vw,56px)", fontWeight: 900, lineHeight: 1 }}>
                  {stat.value}
                </strong>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 8, display: "block" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <article style={{ maxWidth: 840, margin: "0 auto", padding: "clamp(40px,5vw,64px) clamp(24px,6vw,88px)" }}>

        {/* Cover image */}
        {item.cover_image_url && !gallery.length && (
          <div style={{ position: "relative", width: "100%", height: "clamp(260px,35vw,440px)", borderRadius: 10, overflow: "hidden", marginBottom: 40 }}>
            <Image src={item.cover_image_url} alt={item.title} fill style={{ objectFit: "cover" }} unoptimized />
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px,2.5vw,28px)", marginBottom: 20 }}>Photos</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {gallery.map((url, i) => (
                <div key={i} style={{ position: "relative", height: 200, borderRadius: 8, overflow: "hidden" }}>
                  <Image
                    src={url}
                    alt={`${item.title} photo ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonial */}
        {item.testimonial && (
          <blockquote style={{
            borderLeft: "4px solid var(--green)",
            paddingLeft: 24,
            margin: "0 0 40px",
            background: "var(--paper)",
            borderRadius: "0 8px 8px 0",
            padding: "20px 20px 20px 28px"
          }}>
            <p style={{ fontStyle: "italic", fontSize: 18, lineHeight: 1.6, margin: "0 0 12px", color: "var(--ink)" }}>
              &ldquo;{item.testimonial}&rdquo;
            </p>
            {item.testimonial_author && (
              <cite style={{ fontSize: 13, color: "var(--muted)", fontStyle: "normal", fontWeight: 700 }}>
                — {item.testimonial_author}
              </cite>
            )}
          </blockquote>
        )}

        {/* Partners */}
        {partners.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(20px,2vw,24px)", marginBottom: 16 }}>Partners</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {partners.map((p, i) => (
                <span key={i} className="tag">{p}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
          <Link href="/outreach" className="button secondary">← All Outreach</Link>
        </div>
      </article>
    </PageShell>
  );
}
