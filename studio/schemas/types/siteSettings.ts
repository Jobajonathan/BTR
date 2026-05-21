import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site title", type: "string", initialValue: "Behind the Reels" }),
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string", initialValue: "Behind every reel is a real story." }),
    defineField({
      name: "heroCopy",
      title: "Hero copy",
      type: "text",
      rows: 3,
      initialValue:
        "A fast-growing mental health community helping young Africans speak honestly about pressure, identity, family, anxiety, healing, and hope."
    }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({
      name: "impactStats",
      title: "Impact stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Value", type: "string" },
            { name: "label", title: "Label", type: "string" }
          ]
        }
      ]
    })
  ]
});
