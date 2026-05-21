import { defineField, defineType } from "sanity";

export const outreach = defineType({
  name: "outreach",
  title: "Outreach",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4 }),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "impactStats", title: "Impact stats", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "partners", title: "Partner organizations", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "testimonial", title: "Testimonial quote", type: "text", rows: 3 })
  ]
});
