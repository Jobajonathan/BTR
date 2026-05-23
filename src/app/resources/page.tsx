import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ResourcesPage() {
  const supabase = createAdminClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, slug, excerpt, cover_image_url")
    .order("created_at", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Resources</p>
        <h1>Guides for the moments that feel heavy.</h1>
        <p>
          Practical, culturally sensitive mental health resources for young Africans and the people
          who care about them.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 72, background: "var(--paper)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Resource hub</p>
          <h2 style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 48, marginTop: 12 }}>
            Clear language, gentle direction.
          </h2>

          {resources && resources.length > 0 ? (
            <div className="resources-listing-grid">
              {resources.map((resource, i) => (
                <Link
                  href={`/resources/${resource.slug}`}
                  key={resource.id}
                  className="resource-listing-card"
                  style={{ "--accent": i % 3 === 0 ? "var(--rose)" : i % 3 === 1 ? "var(--green-soft)" : "#f1dca8" } as React.CSSProperties}
                >
                  <div className="resource-listing-visual">
                    {resource.cover_image_url ? (
                      <Image
                        src={resource.cover_image_url}
                        alt={resource.title}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
                      <div className="resource-listing-placeholder" />
                    )}
                  </div>
                  <div className="resource-listing-body">
                    <span className="tag" style={{ background: "var(--accent)", color: "var(--ink)", marginBottom: 14, fontSize: 11 }}>
                      Resource
                    </span>
                    <h3>{resource.title}</h3>
                    {resource.excerpt && <p>{resource.excerpt}</p>}
                    <span className="resource-listing-cta">Read guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "72px 0", color: "var(--muted)" }}>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Resources coming soon.</p>
              <p>We are building our resource library. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
