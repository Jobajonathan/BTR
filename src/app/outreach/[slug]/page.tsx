import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function OutreachPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: item } = await supabase
    .from("outreaches")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!item) notFound();

  const gallery: string[] = Array.isArray(item.gallery) ? item.gallery : [];
  const impactStats: Array<{ value: string; label: string }> = Array.isArray(item.impact_stats)
    ? item.impact_stats
    : [];
  const partners: string[] = Array.isArray(item.partners) ? item.partners : [];

  return (
    <PageShell>
      <article className="story-article">
        <header className="story-header">
          <span className="tag">Outreach</span>
          <h1>{item.title}</h1>
          {item.summary && <p className="story-lede">{item.summary}</p>}
          <p className="story-byline">
            {item.location && item.location}
            {item.location && item.date && " · "}
            {item.date &&
              new Date(item.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
          </p>
        </header>

        {impactStats.length > 0 && (
          <div className="impact-strip" style={{ margin: "32px 0", borderRadius: 8 }}>
            {impactStats.map((stat) => (
              <div className="stat" key={`${stat.value}-${stat.label}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {gallery.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
              margin: "32px 0"
            }}
          >
            {gallery.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${item.title} photo ${i + 1}`}
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 8 }}
              />
            ))}
          </div>
        )}

        {item.testimonial && (
          <blockquote
            style={{
              borderLeft: "4px solid var(--green)",
              paddingLeft: 20,
              margin: "32px 0",
              fontStyle: "italic"
            }}
          >
            <p>{item.testimonial}</p>
            {item.testimonial_author && (
              <cite style={{ fontSize: 13, color: "var(--muted)" }}>
                — {item.testimonial_author}
              </cite>
            )}
          </blockquote>
        )}

        {partners.length > 0 && (
          <div style={{ margin: "32px 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Partners</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
              {partners.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <Link href="/outreach" className="button secondary">
            ← Back to Outreach
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
