"use client";

import { useState, useTransition } from "react";
import { saveBranding, uploadMedia } from "./actions";

const HEADING_FONTS = [
  "Inter",
  "Playfair Display",
  "Lora",
  "DM Serif Display",
  "Cormorant Garamond",
  "Libre Baskerville",
  "Merriweather",
  "Georgia"
];

const BODY_FONTS = [
  "Inter",
  "DM Sans",
  "Nunito",
  "Lato",
  "Open Sans",
  "Roboto",
  "Source Sans 3",
  "Outfit"
];

type Branding = {
  primary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  heading_font: string;
  body_font: string;
  logo_url: string;
  favicon_url: string;
};

export default function BrandingForm({ data }: { data: Branding }) {
  const [form, setForm] = useState<Branding>(data);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);
  const [isPending, startTransition] = useTransition();

  function set(key: keyof Branding, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_url" | "favicon_url"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field === "logo_url" ? "logo" : "favicon");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadMedia(fd);
      set(field, url);
    } catch {
      alert("Upload failed. Make sure the btr-media storage bucket exists.");
    } finally {
      setUploading(null);
    }
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await saveBranding(form);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <>
      {status === "saved" && (
        <div className="alert alert-success">
          Branding saved. Changes are live on the site.
        </div>
      )}
      {status === "error" && (
        <div className="alert alert-error">
          Failed to save. Please try again.
        </div>
      )}

      <div className="admin-card">
        <p className="admin-card-title">Brand Colors</p>
        {(
          [
            ["primary_color", "Primary color (buttons, links, accents)"],
            ["accent_color", "Accent color (highlights)"],
            ["background_color", "Background color"],
            ["text_color", "Text color"]
          ] as [keyof Branding, string][]
        ).map(([key, label]) => (
          <div className="admin-field" key={key}>
            <label>{label}</label>
            <div className="color-row">
              <input
                type="color"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
              <input
                type="text"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Typography</p>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Heading font</label>
            <select
              value={form.heading_font}
              onChange={(e) => set("heading_font", e.target.value)}
            >
              {HEADING_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div
              className="font-preview"
              style={{ fontFamily: `'${form.heading_font}', serif` }}
            >
              Behind the Reels
            </div>
          </div>
          <div className="admin-field">
            <label>Body font</label>
            <select
              value={form.body_font}
              onChange={(e) => set("body_font", e.target.value)}
            >
              {BODY_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div
              className="font-preview"
              style={{
                fontFamily: `'${form.body_font}', sans-serif`,
                fontSize: 15
              }}
            >
              A fast-growing mental health community for young Africans.
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#888",
            marginTop: 8
          }}
        >
          Fonts are loaded from Google Fonts automatically when you save.
        </p>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Logo & Favicon</p>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Logo</label>
            {form.logo_url && (
              <div className="upload-preview">
                <img src={form.logo_url} alt="Logo" height={48} />
                <span className="preview-label">Current logo</span>
              </div>
            )}
            <label className="upload-area" style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, "logo_url")}
              />
              {uploading === "logo" ? "Uploading…" : "Click to upload logo"}
            </label>
          </div>
          <div className="admin-field">
            <label>
              Favicon{" "}
              <span className="field-hint">(.ico, .png, .svg — 32×32px)</span>
            </label>
            {form.favicon_url && (
              <div className="upload-preview">
                <img
                  src={form.favicon_url}
                  alt="Favicon"
                  width={32}
                  height={32}
                  style={{ borderRadius: 4 }}
                />
                <span className="preview-label">Current favicon</span>
              </div>
            )}
            <label className="upload-area" style={{ marginTop: 10 }}>
              <input
                type="file"
                accept=".ico,.png,.svg,image/*"
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, "favicon_url")}
              />
              {uploading === "favicon" ? "Uploading…" : "Click to upload favicon"}
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={isPending || uploading !== null}
        >
          {isPending ? "Saving…" : "Save branding"}
        </button>
        <span style={{ fontSize: 13, color: "#888" }}>
          Changes go live immediately across the entire site.
        </span>
      </div>
    </>
  );
}
