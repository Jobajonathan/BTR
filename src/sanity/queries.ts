import { groq } from "next-sanity";

export const homepageQuery = groq`{
  "settings": *[_type == "siteSettings"][0],
  "featuredStories": *[_type == "story" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    "category": category->title
  },
  "resources": *[_type == "resource"] | order(_createdAt desc)[0...4] {
    _id,
    title,
    slug,
    excerpt
  },
  "dialogues": *[_type == "dialogue"] | order(date desc)[0...1] {
    _id,
    title,
    summary,
    date
  }
}`;
