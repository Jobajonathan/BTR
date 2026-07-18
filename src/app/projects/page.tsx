import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = createAdminClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug, description, cover_image_url")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--paper)" }}>
        <p className="eyebrow">Projects</p>
        <h1>Our ongoing work.</h1>
        <p>
          Long-term initiatives, series, and campaigns that go beyond individual posts — sustained efforts to shift how young Africans relate to mental health.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}>
          {!projects?.length ? (
            <div style={{ textAlign: "center", padding: "72px 0", color: "var(--muted)" }}>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Projects coming soon.</p>
              <p>Check back to see what we&apos;re building.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
              {projects.map((project) => (
                <article
                  key={project.id}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "var(--white)",
                    transition: "box-shadow 0.15s",
                  }}
                >
                  {project.cover_image_url ? (
                    <div style={{ position: "relative", height: 200 }}>
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div style={{ height: 200, background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--green)", opacity: 0.3 }} />
                    </div>
                  )}
                  <div style={{ padding: "24px 24px 28px" }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>{project.title}</h3>
                    {project.description && (
                      <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
                        {project.description.length > 120 ? project.description.slice(0, 120) + "…" : project.description}
                      </p>
                    )}
                    {project.slug && (
                      <Link
                        href={`/projects/${project.slug}`}
                        style={{ color: "var(--green)", fontWeight: 600, fontSize: 14 }}
                      >
                        Learn more →
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
