"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { savePage, deletePage } from "./actions";

type Page = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published";
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function PageForm({ page }: { page: Page }) {
  const [form, setForm] = useState<Page>(page);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Page>(key: K, value: Page[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setSaveStatus("idle");
    startTransition(async () => {
      try {
        await savePage(form);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
        if (!form.id) router.push("/admin/pages");
      } catch { setSaveStatus("error"); }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Delete this page permanently?")) return;
    startTransition(async () => {
      await deletePage(form.id!, form.slug);
      router.push("/admin/pages");
    });
  }

  return (
    <>
      <Link href="/admin/pages" className="back-link">← Back to Pages</Link>
      {saveStatus === "saved" && <div className="alert alert-success">{form.status === "published" ? "Page published." : "Draft saved."}</div>}
      {saveStatus === "error" && <div className="alert alert-error">Save failed.</div>}

      <div className="admin-card">
        <p className="admin-card-title">Page Details</p>
        <div className="admin-field">
          <label>Page title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: f.slug === toSlug(f.title) || !f.slug ? toSlug(title) : f.slug }));
            }}
            placeholder="e.g. FAQ, Impact Report, Events"
          />
        </div>
        <div className="admin-field">
          <label>URL slug</label>
          <div className="slug-row">
            <span className="slug-prefix">behindthereels.com/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="e.g. faq"
            />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Don&apos;t use slugs that already exist (blog, stories, about, etc.)
          </p>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Page Content</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
          Write the page content in HTML. You can use headings, paragraphs, links, lists, and basic formatting tags.
        </p>
        <div className="admin-field">
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={20}
            placeholder={`<h2>Section heading</h2>\n<p>Your content here...</p>\n\n<h3>Sub-section</h3>\n<p>More content...</p>`}
            style={{ fontFamily: "monospace", fontSize: 13 }}
          />
        </div>
        <div style={{ marginTop: 12, padding: "12px 16px", background: "var(--cream)", borderRadius: 8, fontSize: 13, color: "var(--muted)" }}>
          <strong>Quick reference:</strong>
          {" "}<code>&lt;h2&gt;</code> heading,
          {" "}<code>&lt;p&gt;</code> paragraph,
          {" "}<code>&lt;strong&gt;</code> bold,
          {" "}<code>&lt;em&gt;</code> italic,
          {" "}<code>&lt;ul&gt;&lt;li&gt;</code> list,
          {" "}<code>&lt;a href=&quot;...&quot;&gt;</code> link
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">SEO</p>
        <div className="admin-field">
          <label>SEO title <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 12 }}>(leave blank to use page title)</span></label>
          <input type="text" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} maxLength={60} />
        </div>
        <div className="admin-field">
          <label>SEO description</label>
          <textarea value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} rows={2} maxLength={160} />
        </div>
      </div>

      <div className="admin-card publish-panel">
        <p className="admin-card-title">Publish</p>
        <div className="publish-toggle">
          <button type="button" className={`publish-btn${form.status === "draft" ? " active" : ""}`} onClick={() => set("status", "draft")}>
            Save as draft
          </button>
          <button type="button" className={`publish-btn publish-btn-green${form.status === "published" ? " active" : ""}`} onClick={() => set("status", "published")}>
            Publish
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
          {form.status === "published"
            ? `Live at behindthereels.com/${form.slug}`
            : "Draft — not visible to visitors."}
        </p>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : form.status === "published" ? "Save & publish" : "Save draft"}
        </button>
        {form.id && <button className="btn-danger" onClick={handleDelete} disabled={isPending}>Delete page</button>}
      </div>
    </>
  );
}
