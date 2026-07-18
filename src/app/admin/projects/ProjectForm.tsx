"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveProject, deleteProject } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Project = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  status: "draft" | "published";
  order_index: number;
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function ProjectForm({ project }: { project: Project }) {
  const [form, setForm] = useState<Project>(project);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setSaveStatus("idle");
    startTransition(async () => {
      try {
        await saveProject(form);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
        if (!form.id) router.push("/admin/projects");
      } catch { setSaveStatus("error"); }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Delete this project?")) return;
    startTransition(async () => {
      await deleteProject(form.id!);
      router.push("/admin/projects");
    });
  }

  return (
    <>
      <Link href="/admin/projects" className="back-link">← Back to Projects</Link>
      {saveStatus === "saved" && <div className="alert alert-success">{form.status === "published" ? "Project published." : "Draft saved."}</div>}
      {saveStatus === "error" && <div className="alert alert-error">Save failed.</div>}

      <div className="admin-card">
        <p className="admin-card-title">Project Details</p>
        <div className="admin-field">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: f.slug === toSlug(f.title) || !f.slug ? toSlug(title) : f.slug }));
            }}
          />
        </div>
        <div className="admin-field">
          <label>Slug</label>
          <div className="slug-row">
            <span className="slug-prefix">/projects/</span>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </div>
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="What is this project about? What impact does it have?" />
        </div>
        <div className="admin-field">
          <label>Display order</label>
          <input type="number" value={form.order_index} onChange={(e) => set("order_index", parseInt(e.target.value) || 0)} style={{ width: 100 }} />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Lower number = appears first.</p>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Cover Image</p>
        <ImageUpload value={form.cover_image_url} onChange={(url) => set("cover_image_url", url)} previewHeight={200} />
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
          {form.status === "published" ? "This project is live on the website." : "Draft — not visible to the public."}
        </p>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : form.status === "published" ? "Save & publish" : "Save draft"}
        </button>
        {form.id && <button className="btn-danger" onClick={handleDelete} disabled={isPending}>Delete</button>}
      </div>
    </>
  );
}
