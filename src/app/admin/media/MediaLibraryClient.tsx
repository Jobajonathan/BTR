"use client";

import { useState } from "react";

type MediaItem = {
  name: string;
  url: string;
  size: number;
  created_at: string;
};

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"];

function isImage(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTS.includes(ext);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryClient({ items }: { items: MediaItem[] }) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <div className="admin-card" style={{ marginBottom: 0 }}>
        <div className="list-toolbar">
          <input
            type="search"
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="list-search"
          />
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
            {filtered.length} file{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {!filtered.length ? (
        <div className="admin-card">
          <div className="empty-state">
            <p>{search ? "No files match your search." : "No media files yet."}</p>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Files appear here automatically when uploaded through story, blog, or outreach forms.
            </p>
          </div>
        </div>
      ) : (
        <div className="media-grid">
          {filtered.map((item) => (
            <div key={item.name} className="media-item" onClick={() => setPreview(item)}>
              {isImage(item.name) ? (
                <img src={item.url} alt={item.name} className="media-thumb" />
              ) : (
                <div className="media-thumb media-thumb-file">
                  <span>{item.name.split(".").pop()?.toUpperCase()}</span>
                </div>
              )}
              <div className="media-item-info">
                <span className="media-item-name" title={item.name}>
                  {item.name.length > 22 ? item.name.slice(0, 20) + "…" : item.name}
                </span>
                <span className="media-item-size">{formatBytes(item.size)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="media-modal-backdrop" onClick={() => setPreview(null)}>
          <div className="media-modal" onClick={(e) => e.stopPropagation()}>
            <button className="media-modal-close" onClick={() => setPreview(null)}>✕</button>
            {isImage(preview.name) ? (
              <img src={preview.url} alt={preview.name} className="media-modal-img" />
            ) : (
              <div className="media-thumb-file" style={{ width: 120, height: 120, borderRadius: 8 }}>
                <span style={{ fontSize: 24 }}>{preview.name.split(".").pop()?.toUpperCase()}</span>
              </div>
            )}
            <p style={{ fontWeight: 700, marginTop: 16, wordBreak: "break-all" }}>{preview.name}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              {formatBytes(preview.size)}
              {preview.created_at && ` · ${new Date(preview.created_at).toLocaleDateString("en-GB")}`}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                className="btn-primary"
                onClick={() => copyUrl(preview.url)}
              >
                {copied === preview.url ? "Copied!" : "Copy URL"}
              </button>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Open ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
