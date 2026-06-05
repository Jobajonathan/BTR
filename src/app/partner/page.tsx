import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function PartnerPage() {
  const supabase = createAdminClient();
  const { data: partners } = await supabase
    .from("partners")
    .select("id, name, description, logo_url, website_url, category, featured")
    .order("order_index", { ascending: true });

  // Group partners by category
  const featured = (partners ?? []).filter((p) => p.featured);
  const byCategory = (partners ?? []).reduce<Record<string, typeof partners>>((acc, p) => {
    const cat = p.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(p);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).sort();

  return (
    <PageShell>
      {/* Hero */}
      <section className="page-hero">
        <p className="eyebrow">Partner with BTR</p>
        <h1>Support mental health conversations for young Africans.</h1>
        <p>
          Partner on outreaches, campaigns, school programs, content series, or community care
          initiatives. Together we make the conversations happen.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
          <Link href="/contact" className="button primary">
            Get in touch
          </Link>
          <Link href="/join" className="button secondary">
            Join the community
          </Link>
        </div>
      </section>

      {/* What we offer */}
      <section className="section mission-grid">
        <article>
          <span className="tag">Schools</span>
          <h2>Bring dialogues into student communities.</h2>
          <p>
            Host listening circles, mental health days, and moderated panels that help students feel
            seen, heard, and supported.
          </p>
        </article>
        <article>
          <span className="tag">Organisations</span>
          <h2>Fund campaigns and practical support.</h2>
          <p>
            Help the movement reach more young Africans online and offline through co-branded
            campaigns and community events.
          </p>
        </article>
        <article>
          <span className="tag">Media</span>
          <h2>Amplify storytelling at scale.</h2>
          <p>
            Co-produce content series, amplify stories, and help BTR reach audiences who need these
            conversations most.
          </p>
        </article>
        <article>
          <span className="tag">Corporates</span>
          <h2>Lead on employee and community wellbeing.</h2>
          <p>
            Demonstrate genuine social impact by supporting mental health literacy among young
            African professionals and communities.
          </p>
        </article>
      </section>

      {/* Featured partners */}
      {featured.length > 0 && (
        <section className="section" style={{ background: "var(--paper)", paddingTop: 72, paddingBottom: 72 }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Partners</p>
            <h2 style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 48, marginTop: 12 }}>
              Organisations we work with.
            </h2>
            <div className="partners-featured-grid">
              {featured.map((p) => (
                <a
                  key={p.id}
                  href={p.website_url ?? "#"}
                  target={p.website_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="partner-card"
                >
                  {p.logo_url ? (
                    <Image
                      src={p.logo_url}
                      alt={p.name}
                      width={120}
                      height={56}
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  ) : (
                    <span style={{ fontWeight: 800, fontSize: 18, color: "var(--green)" }}>{p.name}</span>
                  )}
                  {p.description && (
                    <p style={{ fontSize: 13, color: "var(--muted)", margin: "10px 0 0", lineHeight: 1.4 }}>
                      {p.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners by category */}
      {categories.length > 0 && (
        <section className="section" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}>
            {categories.map((cat) => (
              <div key={cat} style={{ marginBottom: 56 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
                  {cat}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {(byCategory[cat] ?? []).map((p) => (
                    <a
                      key={p.id}
                      href={p.website_url ?? "#"}
                      target={p.website_url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        borderRadius: 8,
                        padding: "10px 16px",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--ink)",
                        textDecoration: "none"
                      }}
                    >
                      {p.logo_url && (
                        <Image
                          src={p.logo_url}
                          alt={p.name}
                          width={24}
                          height={24}
                          style={{ objectFit: "contain", borderRadius: 3 }}
                          unoptimized
                        />
                      )}
                      {p.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        style={{
          background: "var(--green)",
          color: "#fff",
          textAlign: "center",
          padding: "clamp(64px,8vw,96px) clamp(24px,6vw,88px)"
        }}
      >
        <h2 style={{ fontSize: "clamp(30px,4vw,48px)", margin: "0 auto 16px", maxWidth: 680, lineHeight: 1.08 }}>
          Ready to make mental health conversations happen?
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", margin: "0 auto 32px", maxWidth: 560 }}>
          Reach out and let&apos;s find the best way to work together.
        </p>
        <Link
          href="/contact"
          className="button"
          style={{ background: "#fff", color: "var(--green)", fontWeight: 800 }}
        >
          Get in touch
        </Link>
      </section>
    </PageShell>
  );
}
