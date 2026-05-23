"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { savePartner, deletePartner, uploadPartnerMedia } from "./actions";

const CATEGORIES = ["School", "NGO", "Corporate", "Media", "Government", "Community", "Church"];

type Partner = {
  id?: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  category: string;
  featured: boolean;
  order_index: number;
};

export default function PartnerForm({ partner }: { partner: Partner }) {
  const [form, setForm] = useState<Partner>(partner);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Partner>(key: K, value: Partner[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadPartnerMedia(fd);
      set("logo_url", url);
    } catch { alert("Upload failed."); }
    finally { setUploading(false); e.target.value = ""; }
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await savePartner(form);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
        if (!form.id) router.push("/admin/partners");
      } catch { setStatus("error"); }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Delete this partner?")) return;
    startTransition(async () => {
      await deletePartner(form.id!);
      router.push("/admin/partners");
    });
  }

  return (
    <>
      <Link href="/admin/partners" className="back-link">← Back to Partners</Link>
      {status === "saved" && <div className="alert alert-success">Partner saved.</div>}
      {status === "error" && <div className="alert alert-error">Save failed.</div>}

      <div className="admin-card">
        <p className="admin-card-title">Partner Details</p>
        <div className="admin-field">
          <label>Organisation name</label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">— Select —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Website URL</label>
            <input type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://..." />
          </div>
          <div className="admin-field">
            <label>Display order</label>
            <input type="number" value={form.order_index} onChange={(e) => set("order_index", parseInt(e.target.value) || 0)} min={0} />
          </div>
        </div>
        <div className="admin-field">
          <div className="checkbox-row">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            <label htmlFor="featured">Feature on partner page</label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Logo</p>
        {form.logo_url && (
          <div className="upload-preview" style={{ marginBottom: 12 }}>
            <img src={form.logo_url} alt={form.name} height={60} style={{ objectFit: "contain", borderRadius: 4 }} />
            <span className="preview-label">Current logo</span>
          </div>
        )}
        <label className="upload-area">
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          {uploading ? "Uploading…" : "Click to upload logo"}
        </label>
        {form.logo_url && (
          <button
            className="btn-ghost"
            style={{ marginTop: 8, fontSize: 12 }}
            onClick={() => set("logo_url", "")}
          >
            Remove logo
          </button>
        )}
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending || uploading}>
          {isPending ? "Saving…" : "Save partner"}
        </button>
        {form.id && (
          <button className="btn-danger" onClick={handleDelete} disabled={isPending}>Delete</button>
        )}
      </div>
    </>
  );
}
