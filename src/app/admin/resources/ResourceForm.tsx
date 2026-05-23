"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveResource, deleteResource } from "./actions";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";

type Resource = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  body: string;
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function ResourceForm({ resource }: { resource: Resource }) {
  const [form, setForm] = useState<Resource>(resource);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Resource>(key: K, value: Resource[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await saveResource(form);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
        if (!form.id) router.push("/admin/resources");
      } catch { setStatus("error"); }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Delete this resource?")) return;
    startTransition(async () => {
      await deleteResource(form.id!);
      router.push("/admin/resources");
    });
  }

  return (
    <>
      <Link href="/admin/resources" className="back-link">← Back to Resources</Link>
      {status === "saved" && <div className="alert alert-success">Saved.</div>}
      {status === "error" && <div className="alert alert-error">Save failed.</div>}

      <div className="admin-card">
        <p className="admin-card-title">Resource Details</p>
        <div className="admin-field">
          <label>Title</label>
          <input type="text" value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: f.slug === toSlug(f.title) || !f.slug ? toSlug(title) : f.slug }));
            }}
          />
        </div>
        <div className="admin-field">
          <label>Slug</label>
          <div className="slug-row">
            <span className="slug-prefix">/resources/</span>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </div>
        </div>
        <div className="admin-field">
          <label>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} />
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Cover Image</p>
        <ImageUpload value={form.cover_image_url} onChange={(url) => set("cover_image_url", url)} previewHeight={160} />
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Content</p>
        <RichTextEditor value={form.body} onChange={(html) => set("body", html)} placeholder="Write the resource guide here…" />
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>{isPending ? "Saving…" : "Save resource"}</button>
        {form.id && <button className="btn-danger" onClick={handleDelete} disabled={isPending}>Delete</button>}
      </div>
    </>
  );
}
