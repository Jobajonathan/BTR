import { defineField, defineType } from "sanity";

export const dialogue = defineType({
  name: "dialogue",
  title: "Dialogue",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "date", title: "Date", type: "datetime" }),
    defineField({ name: "guest", title: "Guest or speaker", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4 }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({ name: "recordingUrl", title: "Recording URL", type: "url" }),
    defineField({ name: "takeaways", title: "Key takeaways", type: "array", of: [{ type: "string" }] })
  ]
});
