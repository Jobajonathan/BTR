"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveOutreach, deleteOutreach, uploadMedia } from "./actions";

type Stat = { value: string; label: string };

type Outreach = {
  id?: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  summary: string;
  gallery: string[];
  impact_stats: Stat[];
  partners: string[];
  testimonial: string;
  testimonial_author: string;
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function OutreachForm({ outreach }: { outreach: Outreach }) {
  const [form, setForm] = useState<Outreach>(outreach);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Outreach>(key: K, value: Outreach[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const { url } = await uploadMedia(fd);
        return url;
      }));
      set("gallery", [...form.gallery, ...urls]);
    } catch { alert("Upload failed."); }
    finally { setUploading(false); e.target.value = ""; }
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await saveOutreach(form);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
        if (!form.id) router.push("/admin/outreach");
      } catch { setStatus("error"); }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Delete this outreach?")) return;
    startTransition(async () => {
      await deleteOutreach(form.id!);
      router.push("/admin/outreach");
    });
  }

  return (
    <>
      <Link href="/admin/outreach" className="back-link">← Back to Outreaches</Link>
      {status === "saved" && <div className="alert alert-success">Saved.</div>}
      {status === "error" && <div className="alert alert-error">Save failed.</div>}

      <div className="admin-card">
        <p className="admin-card-title">Outreach Details</p>
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
            <span className="slug-prefix">/outreach/</span>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </div>
        </div>
        <div className="admin-field">
          <label>Summary</label>
          <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={4} />
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Location</label>
            <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" />
          </div>
          <div className="admin-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Photo Gallery</p>
        {form.gallery.length > 0 && (
          <div className="gallery-grid">
            {form.gallery.map((url, i) => (
              <div className="gallery-item" key={i}>
                <img src={url} alt={`Photo ${i + 1}`} />
                <button onClick={() => set("gallery", form.gallery.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
          </div>
        )}
        <label className="upload-area">
          <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleGalleryUpload} />
          {uploading ? "Uploading…" : "Click to add photos (multiple allowed)"}
        </label>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Impact Statistics</p>
        <div className="stats-list">
          {form.impact_stats.map((s, i) => (
            <div className="stat-row" key={i}>
              <input type="text" placeholder="e.g. 200+" value={s.value} onChange={(e) => { const st = [...form.impact_stats]; st[i] = { ...st[i], value: e.target.value }; set("impact_stats", st); }} />
              <input type="text" placeholder="Label" value={s.label} onChange={(e) => { const st = [...form.impact_stats]; st[i] = { ...st[i], label: e.target.value }; set("impact_stats", st); }} />
              <button className="btn-danger" onClick={() => set("impact_stats", form.impact_stats.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button className="btn-ghost" onClick={() => set("impact_stats", [...form.impact_stats, { value: "", label: "" }])}>+ Add stat</button>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Partners & Testimonial</p>
        <div className="admin-field">
          <label>Partner organizations</label>
          <div className="dynamic-list">
            {form.partners.map((p, i) => (
              <div className="dynamic-row" key={i}>
                <input type="text" value={p} onChange={(e) => { const pt = [...form.partners]; pt[i] = e.target.value; set("partners", pt); }} placeholder="Partner name" />
                <button className="btn-danger" onClick={() => set("partners", form.partners.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
          </div>
          <button className="btn-ghost" onClick={() => set("partners", [...form.partners, ""])}>+ Add partner</button>
        </div>
        <div className="admin-field">
          <label>Testimonial quote</label>
          <textarea value={form.testimonial} onChange={(e) => set("testimonial", e.target.value)} rows={3} />
        </div>
        <div className="admin-field">
          <label>Testimonial author</label>
          <input type="text" value={form.testimonial_author} onChange={(e) => set("testimonial_author", e.target.value)} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending || uploading}>{isPending ? "Saving…" : "Save outreach"}</button>
        {form.id && <button className="btn-danger" onClick={handleDelete} disabled={isPending}>Delete</button>}
      </div>
    </>
  );
}
