"use client";

import { useState } from "react";

const BASE_URL = "https://www.behindthereels.com";
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const GSC_SUBMIT = "https://search.google.com/search-console";

export default function SitemapPage() {
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(SITEMAP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const staticRoutes = [
    { path: "/", priority: "1.0", freq: "daily" },
    { path: "/stories", priority: "0.9", freq: "daily" },
    { path: "/blog", priority: "0.9", freq: "daily" },
    { path: "/dialogues", priority: "0.8", freq: "weekly" },
    { path: "/outreach", priority: "0.8", freq: "weekly" },
    { path: "/resources", priority: "0.8", freq: "weekly" },
    { path: "/about", priority: "0.7", freq: "monthly" },
    { path: "/contact", priority: "0.7", freq: "monthly" },
    { path: "/volunteer", priority: "0.7", freq: "monthly" },
    { path: "/donate", priority: "0.7", freq: "monthly" },
    { path: "/join", priority: "0.7", freq: "monthly" },
    { path: "/partner", priority: "0.7", freq: "monthly" },
    { path: "/submit", priority: "0.7", freq: "monthly" },
    { path: "/privacy", priority: "0.5", freq: "yearly" },
    { path: "/terms", priority: "0.5", freq: "yearly" },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h1>Sitemap</h1>
      </div>
      <div className="admin-content">
        {/* Sitemap URL card */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <p className="admin-card-title">Sitemap URL</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            This URL is automatically generated and always up to date. Submit it to Google Search Console to help your site get indexed faster.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <code style={{
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 14,
              fontFamily: "monospace",
              flex: 1,
              minWidth: 0,
              wordBreak: "break-all"
            }}>
              {SITEMAP_URL}
            </code>
            <button className="btn-primary" onClick={copyUrl} style={{ whiteSpace: "nowrap" }}>
              {copied ? "Copied!" : "Copy URL"}
            </button>
            <a
              href={SITEMAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ whiteSpace: "nowrap" }}
            >
              View XML →
            </a>
          </div>
        </div>

        {/* Google Search Console */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <p className="admin-card-title">Google Search Console</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Submit your sitemap directly to Google to request indexing. You only need to do this once — Google will recrawl automatically after that.
          </p>
          <div className="steps-list" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              "Open Google Search Console (link below)",
              "Select the behindthereels.com property",
              'In the left sidebar, click "Sitemaps" under Indexing',
              `Paste this URL and click Submit: ${SITEMAP_URL}`,
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--green)",
                  color: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1
                }}>{i + 1}</span>
                <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
          <a
            href={GSC_SUBMIT}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Open Google Search Console →
          </a>
        </div>

        {/* Static pages table */}
        <div className="admin-card">
          <p className="admin-card-title">Pages in Sitemap</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            These static routes are always included. Dynamic content (stories, blog posts, outreaches, dialogues) is added automatically when published.
          </p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Priority</th>
                <th>Change frequency</th>
              </tr>
            </thead>
            <tbody>
              {staticRoutes.map((r) => (
                <tr key={r.path}>
                  <td>
                    <a
                      href={`${BASE_URL}${r.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--green)", fontFamily: "monospace", fontSize: 13 }}
                    >
                      {r.path}
                    </a>
                  </td>
                  <td style={{ fontSize: 13 }}>{r.priority}</td>
                  <td style={{ fontSize: 13, color: "var(--muted)" }}>{r.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
