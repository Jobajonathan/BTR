import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const BASE_URL = "https://www.behindthereels.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [
    { data: stories },
    { data: blogPosts },
    { data: dialogues },
    { data: outreaches },
    { data: resources },
  ] = await Promise.all([
    supabase.from("stories").select("slug, updated_at").not("published_at", "is", null),
    supabase.from("blog_posts").select("slug, updated_at").not("published_at", "is", null),
    supabase.from("dialogues").select("slug, updated_at"),
    supabase.from("outreaches").select("slug, updated_at"),
    supabase.from("resources").select("slug, updated_at"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1, changeFrequency: "weekly" },
    { url: `${BASE_URL}/about`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/stories`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blog`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/dialogues`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/outreach`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/resources`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE_URL}/partner`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE_URL}/join`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${BASE_URL}/donate`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${BASE_URL}/volunteer`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE_URL}/submit`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE_URL}/newsletter`, priority: 0.5, changeFrequency: "yearly" },
  ];

  const storyRoutes: MetadataRoute.Sitemap = (stories ?? []).map((s) => ({
    url: `${BASE_URL}/stories/${s.slug}`,
    lastModified: s.updated_at ?? undefined,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (blogPosts ?? []).map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at ?? undefined,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const dialogueRoutes: MetadataRoute.Sitemap = (dialogues ?? []).map((d) => ({
    url: `${BASE_URL}/dialogues/${d.slug}`,
    lastModified: d.updated_at ?? undefined,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const outreachRoutes: MetadataRoute.Sitemap = (outreaches ?? []).map((o) => ({
    url: `${BASE_URL}/outreach/${o.slug}`,
    lastModified: o.updated_at ?? undefined,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = (resources ?? []).map((r) => ({
    url: `${BASE_URL}/resources/${r.slug}`,
    lastModified: r.updated_at ?? undefined,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [
    ...staticRoutes,
    ...storyRoutes,
    ...blogRoutes,
    ...dialogueRoutes,
    ...outreachRoutes,
    ...resourceRoutes,
  ];
}
