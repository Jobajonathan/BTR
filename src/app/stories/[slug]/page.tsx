import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ViewTracker } from "@/components/ViewTracker";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: story } = await supabase
    .from("stories")
    .select("*, authors(name, bio, image_url), categories(title)")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();

  if (!story) notFound();

  const bodyHtml = (story.body as { html?: string } | null)?.html ?? "";

  return (
    <PageShell>
      <ViewTracker type="story" id={story.id} />
      <article className="story-article">
        <header className="story-header">
          {(story.categories as unknown as { title: string } | null)?.title && (
            <span className="tag">
              {(story.categories as { title: string }).title}
            </span>
          )}
          <h1>{story.title}</h1>
          {story.excerpt && <p className="story-lede">{story.excerpt}</p>}
          {(story.authors as unknown as { name: string } | null)?.name && (
            <p className="story-byline">
              By {(story.authors as { name: string }).name}
              {story.published_at &&
                ` · ${new Date(story.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          )}
        </header>

        {story.cover_image_url && (
          <img
            src={story.cover_image_url}
            alt={story.title}
            className="story-cover"
          />
        )}

        {bodyHtml ? (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p style={{ color: "var(--muted)" }}>Full story coming soon.</p>
        )}

        <div style={{ marginTop: 48 }}>
          <Link href="/stories" className="button secondary">
            ← Back to Stories
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
