import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageShell } from "@/components/page-shell";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("custom_pages")
    .select("title, seo_title, seo_description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return {};
  return {
    title: data.seo_title ?? data.title,
    description: data.seo_description ?? undefined,
  };
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("custom_pages")
    .select("title, content")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) notFound();

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--paper)" }}>
        <h1>{data.title}</h1>
      </section>
      <section className="section" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div
          style={{ maxWidth: 760, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: data.content ?? "" }}
        />
      </section>
    </PageShell>
  );
}
