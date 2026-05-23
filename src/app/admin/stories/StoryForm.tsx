"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveStory, deleteStory } from "./actions";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";

type Author = { id: string; name: string };
type Category = { id: string; title: string };

type Story = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  author_id: string;
  category_id: string;
  body: string;
  published_at: string;
  featured: boolean;
  instagram_url: string;
  seo_title: string;
  seo_description: string;
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function StoryForm({
  story,
  authors,
  categories
}: {
  story: Story;
  authors: Author[];
  categories: Category[];
}) {
  const [form, setForm] = useState<Story>(story);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Story>(key: K, value: Story[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: f.slug === toSlug(f.title) || !f.slug ? toSlug(title) : f.slug
    }));
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await saveStory(form);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
        if (!form.id) router.push("/admin/stories");
      } catch (e) {
        setStatus("error");
        setErrorMsg(String(e));
      }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Permanently delete this story?")) return;
    startTransition(async () => {
      await deleteStory(form.id!);
      router.push("/admin/stories");
    });
  }

  return (
    <>
      <Link href="/admin/stories" className="back-link">
        ← Back to Stories
      </Link>

      {status === "saved" && (
        <div className="alert alert-success">Story saved successfully.</div>
      )}
      {status === "error" && (
        <div className="alert alert-error">{errorMsg || "Save failed."}</div>
      )}

      <div className="admin-card">
        <p className="admin-card-title">Story Details</p>
        <div className="admin-field">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>Slug</label>
          <div className="slug-row">
            <span className="slug-prefix">/stories/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
        </div>
        <div className="admin-field">
          <label>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={3}
          />
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Author</label>
            <select
              value={form.author_id}
              onChange={(e) => set("author_id", e.target.value)}
            >
              <option value="">— Select author —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label>Category</label>
            <select
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
            >
              <option value="">— Select category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label>Published at</label>
            <input
              type="datetime-local"
              value={form.published_at}
              onChange={(e) => set("published_at", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label>Instagram URL</label>
            <input
              type="url"
              value={form.instagram_url}
              onChange={(e) => set("instagram_url", e.target.value)}
              placeholder="https://instagram.com/p/..."
            />
          </div>
        </div>
        <div className="admin-field">
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            <label htmlFor="featured">Feature on homepage</label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Cover Image</p>
        <ImageUpload
          value={form.cover_image_url}
          onChange={(url) => set("cover_image_url", url)}
          previewHeight={180}
        />
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Body Content</p>
        <RichTextEditor
          value={form.body}
          onChange={(html) => set("body", html)}
          placeholder="Write the story here…"
        />
      </div>

      <div className="admin-card">
        <p className="admin-card-title">SEO</p>
        <div className="admin-field">
          <label>SEO title <span className="field-hint">(leave blank to use the story title)</span></label>
          <input
            type="text"
            value={form.seo_title}
            onChange={(e) => set("seo_title", e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>SEO description</label>
          <textarea
            value={form.seo_description}
            onChange={(e) => set("seo_description", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save story"}
        </button>
        {form.id && (
          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete story
          </button>
        )}
      </div>
    </>
  );
}
