"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveBlogPost, deleteBlogPost, duplicateBlogPost } from "./actions";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import CharacterCount from "@/components/admin/CharacterCount";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

type Author   = { id: string; name: string };
type Category = { id: string; title: string };

type BlogPost = {
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
  seo_title: string;
  seo_description: string;
};

type PublishState = "draft" | "published" | "scheduled";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function derivePublishState(published_at: string): PublishState {
  if (!published_at) return "draft";
  return new Date(published_at) > new Date() ? "scheduled" : "published";
}

export default function BlogForm({
  post,
  authors,
  categories
}: {
  post: BlogPost;
  authors: Author[];
  categories: Category[];
}) {
  const [form, setForm] = useState<BlogPost>(post);
  const [publishState, setPublishState] = useState<PublishState>(
    derivePublishState(post.published_at)
  );
  const [showSchedule, setShowSchedule] = useState(
    derivePublishState(post.published_at) === "scheduled"
  );
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const isDirty = useRef(false);
  const router = useRouter();

  function set<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    isDirty.current = true;
    setForm((f) => ({ ...f, [key]: value }));
  }

  useUnsavedChanges(isPending ? false : isDirty.current);

  function handleTitleChange(title: string) {
    isDirty.current = true;
    setForm((f) => ({
      ...f,
      title,
      slug: f.slug === toSlug(f.title) || !f.slug ? toSlug(title) : f.slug
    }));
  }

  function handlePublishClick(state: PublishState) {
    setPublishState(state);
    if (state === "published") {
      setForm((f) => ({ ...f, published_at: new Date().toISOString().slice(0, 16) }));
      setShowSchedule(false);
    } else if (state === "draft") {
      setForm((f) => ({ ...f, published_at: "" }));
      setShowSchedule(false);
    } else {
      setShowSchedule(true);
    }
    isDirty.current = true;
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await saveBlogPost(form);
        isDirty.current = false;
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
        if (!form.id) router.push("/admin/blog");
      } catch (e) {
        setStatus("error");
        setErrorMsg(String(e));
      }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Permanently delete this blog post? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteBlogPost(form.id!);
      router.push("/admin/blog");
    });
  }

  function handleDuplicate() {
    if (!form.id || !confirm("Duplicate this post? A draft copy will be created.")) return;
    startTransition(async () => {
      const newId = await duplicateBlogPost(form.id!);
      router.push(`/admin/blog/${newId}`);
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return (
    <>
      <div className="form-topbar">
        <Link href="/admin/blog" className="back-link">← Back to Blog</Link>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {form.id && form.slug && (
            <a
              href={`${siteUrl}/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: 13 }}
            >
              View on site ↗
            </a>
          )}
          {form.id && (
            <button className="btn-ghost" onClick={handleDuplicate} disabled={isPending} style={{ fontSize: 13 }}>
              Duplicate
            </button>
          )}
        </div>
      </div>

      {status === "saved" && (
        <div className="alert alert-success">Blog post saved.</div>
      )}
      {status === "error" && (
        <div className="alert alert-error">{errorMsg || "Save failed."}</div>
      )}

      <div className="admin-card">
        <p className="admin-card-title">Post Details</p>
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
            <span className="slug-prefix">/blog/</span>
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
            <select value={form.author_id} onChange={(e) => set("author_id", e.target.value)}>
              <option value="">— Select author —</option>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Category</label>
            <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">— Select category —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
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
        <p className="admin-card-title">Content</p>
        <RichTextEditor
          value={form.body}
          onChange={(html) => set("body", html)}
          placeholder="Write the blog post here…"
        />
      </div>

      <div className="admin-card">
        <p className="admin-card-title">SEO</p>
        <div className="admin-field">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label>SEO title <span className="field-hint">(leave blank to use the post title)</span></label>
            <CharacterCount value={form.seo_title} max={60} />
          </div>
          <input type="text" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
        </div>
        <div className="admin-field">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label>SEO description</label>
            <CharacterCount value={form.seo_description} max={160} />
          </div>
          <textarea value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} rows={2} />
        </div>
      </div>

      {/* Publish panel */}
      <div className="admin-card publish-panel">
        <p className="admin-card-title">Publish</p>
        <div className="publish-toggle">
          <button
            type="button"
            className={`publish-btn${publishState === "draft" ? " active" : ""}`}
            onClick={() => handlePublishClick("draft")}
          >
            Save draft
          </button>
          <button
            type="button"
            className={`publish-btn publish-btn-green${publishState === "published" ? " active" : ""}`}
            onClick={() => handlePublishClick("published")}
          >
            Publish now
          </button>
          <button
            type="button"
            className={`publish-btn${publishState === "scheduled" ? " active" : ""}`}
            onClick={() => handlePublishClick("scheduled")}
          >
            Schedule
          </button>
        </div>

        {showSchedule && (
          <div className="admin-field" style={{ marginTop: 14 }}>
            <label>Scheduled publish date &amp; time</label>
            <input
              type="datetime-local"
              value={form.published_at}
              onChange={(e) => set("published_at", e.target.value)}
            />
          </div>
        )}

        {publishState === "published" && !showSchedule && (
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
            Will publish immediately when saved.
          </p>
        )}
        {publishState === "draft" && (
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
            Will not appear on the site until published.
          </p>
        )}
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : publishState === "draft" ? "Save draft" : "Save & publish"}
        </button>
        {form.id && (
          <button className="btn-danger" onClick={handleDelete} disabled={isPending}>
            Delete post
          </button>
        )}
      </div>
    </>
  );
}
