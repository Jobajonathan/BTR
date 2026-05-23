import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
import { SectionIntro } from "@/components/section-intro";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function BlogPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, categories(title)")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">Blog</p>
        <h1>Thoughts, guides, and conversations from the BTR team.</h1>
        <p>
          Editorial pieces, mental health guides, and updates from Behind the Reels.
        </p>
      </section>
      <section className="section stories-section">
        <SectionIntro
          kicker="Latest"
          title="Read what we have been writing."
          body="Culturally grounded pieces on mental health, community, and healing for young Africans."
        />
        <div className="card-grid wide-grid">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <ContentCard
                accent={(index % 3) + 1}
                excerpt={post.excerpt ?? undefined}
                href={post.slug ? `/blog/${post.slug}` : "#"}
                image={post.cover_image_url ?? undefined}
                key={post.id}
                tag={(post.categories as unknown as { title: string } | null)?.title ?? "Blog"}
                title={post.title}
              />
            ))
          ) : (
            <p style={{ color: "var(--muted)" }}>Blog posts coming soon.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
