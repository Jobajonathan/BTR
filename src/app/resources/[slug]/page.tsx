import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("resources").select("title, excerpt").eq("slug", slug).single();
  if (!data) return {};
  return { title: `${data.title} | BTR Resources`, description: data.excerpt };
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!resource) notFound();

  const bodyHtml = (resource.body as { html?: string } | null)?.html ?? "";

  // Fetch 3 related resources
  const { data: related } = await supabase
    .from("resources")
    .select("id, title, slug, excerpt")
    .neq("id", resource.id)
    .limit(3)
    .order("created_at", { ascending: false });

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,88px) clamp(24px,6vw,88px) clamp(40px,5vw,56px)" }}>
        <div style={{ maxWidth: 780 }}>
          <Link href="/resources" style={{ fontSize: 13, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
            ← Back to Resources
          </Link>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>Resource</span>
          <h1 style={{ fontSize: "clamp(30px,5vw,54px)", lineHeight: 1.06, margin: "16px 0 20px" }}>
            {resource.title}
          </h1>
          {resource.excerpt && (
            <p style={{ fontSize: "clamp(16px,2vw,19px)", color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>
              {resource.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Cover image */}
      {resource.cover_image_url && (
        <div style={{ width: "100%", maxWidth: 1080, margin: "0 auto", position: "relative", height: "clamp(220px,30vw,400px)", overflow: "hidden" }}>
          <Image
            src={resource.cover_image_url}
            alt={resource.title}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
      )}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "clamp(40px,5vw,64px) clamp(24px,6vw,88px)" }}>
        {bodyHtml ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <p style={{ color: "var(--muted)", fontSize: 16 }}>Full resource content coming soon.</p>
        )}

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
          <Link href="/resources" className="button secondary">← All Resources</Link>
        </div>
      </div>

      {/* Related resources */}
      {related && related.length > 0 && (
        <section style={{ background: "var(--paper)", padding: "clamp(48px,5vw,72px) clamp(24px,6vw,88px)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(22px,2.5vw,28px)", marginBottom: 28 }}>More resources</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.slug}`}
                  style={{
                    background: "var(--cream)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: "20px 22px",
                    display: "block"
                  }}
                >
                  <span className="tag" style={{ fontSize: 11, marginBottom: 12, display: "inline-flex" }}>Resource</span>
                  <h3 style={{ fontSize: 18, lineHeight: 1.2, margin: "0 0 8px" }}>{r.title}</h3>
                  {r.excerpt && <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>{r.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
