"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveDialogue, deleteDialogue } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";

const META_OPTIONS = [
  "Community conversation",
  "Panel discussion",
  "Live session",
  "Interview"
];

type Dialogue = {
  id?: string;
  title: string;
  slug: string;
  date: string;
  guest: string;
  summary: string;
  cover_image_url: string;
  recording_url: string;
  key_takeaways: string[];
  meta: string;
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function DialogueForm({ dialogue }: { dialogue: Dialogue }) {
  const [form, setForm] = useState<Dialogue>(dialogue);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Dialogue>(key: K, value: Dialogue[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setTakeaway(i: number, val: string) {
    const t = [...form.key_takeaways];
    t[i] = val;
    set("key_takeaways", t);
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await saveDialogue(form);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
        if (!form.id) router.push("/admin/dialogues");
      } catch {
        setStatus("error");
      }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Delete this dialogue?")) return;
    startTransition(async () => {
      await deleteDialogue(form.id!);
      router.push("/admin/dialogues");
    });
  }

  return (
    <>
      <Link href="/admin/dialogues" className="back-link">← Back to Dialogues</Link>
      {status === "saved" && <div className="alert alert-success">Saved.</div>}
      {status === "error" && <div className="alert alert-error">Save failed.</div>}

      <div className="admin-card">
        <p className="admin-card-title">Dialogue Details</p>
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
            <span className="slug-prefix">/dialogues/</span>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </div>
        </div>
        <div className="admin-field">
          <label>Summary</label>
          <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={3} />
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Date</label>
            <input type="datetime-local" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Event type</label>
            <select value={form.meta} onChange={(e) => set("meta", e.target.value)}>
              <option value="">— Select —</option>
              {META_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Guest / Speaker</label>
            <input type="text" value={form.guest} onChange={(e) => set("guest", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Recording URL</label>
            <input type="url" value={form.recording_url} onChange={(e) => set("recording_url", e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Cover Image</p>
        <ImageUpload value={form.cover_image_url} onChange={(url) => set("cover_image_url", url)} previewHeight={160} />
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Key Takeaways</p>
        <div className="dynamic-list">
          {form.key_takeaways.map((t, i) => (
            <div className="dynamic-row" key={i}>
              <input type="text" value={t} onChange={(e) => setTakeaway(i, e.target.value)} placeholder={`Takeaway ${i + 1}`} />
              <button className="btn-danger" type="button" onClick={() => set("key_takeaways", form.key_takeaways.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button className="btn-ghost" type="button" onClick={() => set("key_takeaways", [...form.key_takeaways, ""])}>+ Add takeaway</button>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>{isPending ? "Saving…" : "Save dialogue"}</button>
        {form.id && <button className="btn-danger" onClick={handleDelete} disabled={isPending}>Delete</button>}
      </div>
    </>
  );
}
