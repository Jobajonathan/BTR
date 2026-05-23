import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

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

  return (
    <PageShell>
      <article className="story-article">
        <header className="story-header">
          <span className="tag">Resource</span>
          <h1>{resource.title}</h1>
          {resource.excerpt && <p className="story-lede">{resource.excerpt}</p>}
        </header>

        {resource.cover_image_url && (
          <img src={resource.cover_image_url} alt={resource.title} className="story-cover" />
        )}

        {bodyHtml ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <p style={{ color: "var(--muted)" }}>Full resource coming soon.</p>
        )}

        <div style={{ marginTop: 48 }}>
          <Link href="/resources" className="button secondary">
            ← Back to Resources
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
