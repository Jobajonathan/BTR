import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ViewTracker } from "@/components/ViewTracker";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, seo_title, seo_description, excerpt")
    .eq("slug", slug)
    .single();

  if (!post) return {};
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, authors(name, bio, image_url), categories(title)")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();

  if (!post) notFound();

  const bodyHtml = (post.body as { html?: string } | null)?.html ?? "";

  return (
    <PageShell>
      <ViewTracker type="blog" id={post.id} />
      <article className="story-article">
        <header className="story-header">
          {(post.categories as unknown as { title: string } | null)?.title && (
            <span className="tag">
              {(post.categories as { title: string }).title}
            </span>
          )}
          <h1>{post.title}</h1>
          {post.excerpt && <p className="story-lede">{post.excerpt}</p>}
          {(post.authors as unknown as { name: string } | null)?.name && (
            <p className="story-byline">
              By {(post.authors as { name: string }).name}
              {post.published_at &&
                ` · ${new Date(post.published_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}`}
            </p>
          )}
        </header>

        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="story-cover" />
        )}

        {bodyHtml ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <p style={{ color: "var(--muted)" }}>Full post coming soon.</p>
        )}

        <div style={{ marginTop: 48 }}>
          <Link href="/blog" className="button secondary">← Back to Blog</Link>
        </div>
      </article>
    </PageShell>
  );
}
