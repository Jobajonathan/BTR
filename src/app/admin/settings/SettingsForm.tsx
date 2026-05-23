"use client";

import { useState, useTransition } from "react";
import { saveSettings, type HomepageSection } from "./actions";

type Stat = { value: string; label: string };

type Settings = {
  hero_headline: string;
  hero_copy: string;
  hero_primary_cta_label: string;
  hero_primary_cta_url: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_url: string;
  impact_stats: Stat[];
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
  youtube_url: string;
  whatsapp_url: string;
  telegram_url: string;
  facebook_url: string;
  linkedin_url: string;
  footer_tagline: string;
  homepage_sections: HomepageSection[];
};

const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: "stories",   label: "Stories",   visible: true, order: 1 },
  { id: "dialogues", label: "Dialogues", visible: true, order: 2 },
  { id: "outreach",  label: "Outreach",  visible: true, order: 3 },
  { id: "resources", label: "Resources", visible: true, order: 4 }
];

export default function SettingsForm({ data }: { data: Settings }) {
  const [form, setForm] = useState<Settings>({
    ...data,
    homepage_sections:
      Array.isArray(data.homepage_sections) && data.homepage_sections.length
        ? [...data.homepage_sections].sort((a, b) => a.order - b.order)
        : DEFAULT_SECTIONS
  });
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function set(key: keyof Settings, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setStat(i: number, field: keyof Stat, value: string) {
    setForm((f) => {
      const stats = [...f.impact_stats];
      stats[i] = { ...stats[i], [field]: value };
      return { ...f, impact_stats: stats };
    });
  }

  function moveSectionUp(id: string) {
    setForm((f) => {
      const sections = [...f.homepage_sections].sort((a, b) => a.order - b.order);
      const idx = sections.findIndex((s) => s.id === id);
      if (idx <= 0) return f;
      const next = sections.map((s, i) => {
        if (i === idx - 1) return { ...s, order: sections[idx].order };
        if (i === idx)     return { ...s, order: sections[idx - 1].order };
        return s;
      });
      return { ...f, homepage_sections: next };
    });
  }

  function moveSectionDown(id: string) {
    setForm((f) => {
      const sections = [...f.homepage_sections].sort((a, b) => a.order - b.order);
      const idx = sections.findIndex((s) => s.id === id);
      if (idx >= sections.length - 1) return f;
      const next = sections.map((s, i) => {
        if (i === idx)     return { ...s, order: sections[idx + 1].order };
        if (i === idx + 1) return { ...s, order: sections[idx].order };
        return s;
      });
      return { ...f, homepage_sections: next };
    });
  }

  function toggleSection(id: string) {
    setForm((f) => ({
      ...f,
      homepage_sections: f.homepage_sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    }));
  }

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await saveSettings(form);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } catch {
        setStatus("error");
      }
    });
  }

  const sortedSections = [...form.homepage_sections].sort((a, b) => a.order - b.order);

  return (
    <>
      {status === "saved" && <div className="alert alert-success">Settings saved.</div>}
      {status === "error" && <div className="alert alert-error">Failed to save. Please try again.</div>}

      {/* Hero */}
      <div className="admin-card">
        <p className="admin-card-title">Hero Section</p>
        <div className="admin-field">
          <label>Headline</label>
          <input type="text" value={form.hero_headline} onChange={(e) => set("hero_headline", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Supporting copy</label>
          <textarea value={form.hero_copy} onChange={(e) => set("hero_copy", e.target.value)} rows={3} />
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Primary CTA label</label>
            <input type="text" value={form.hero_primary_cta_label} onChange={(e) => set("hero_primary_cta_label", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Primary CTA URL</label>
            <input type="text" value={form.hero_primary_cta_url} onChange={(e) => set("hero_primary_cta_url", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Secondary CTA label</label>
            <input type="text" value={form.hero_secondary_cta_label} onChange={(e) => set("hero_secondary_cta_label", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Secondary CTA URL</label>
            <input type="text" value={form.hero_secondary_cta_url} onChange={(e) => set("hero_secondary_cta_url", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Impact stats */}
      <div className="admin-card">
        <p className="admin-card-title">Impact Statistics</p>
        <div className="stats-list">
          {form.impact_stats.map((stat, i) => (
            <div className="stat-row" key={i}>
              <input type="text" placeholder="e.g. 1M+" value={stat.value} onChange={(e) => setStat(i, "value", e.target.value)} />
              <input type="text" placeholder="Label" value={stat.label} onChange={(e) => setStat(i, "label", e.target.value)} />
              <button className="btn-danger" onClick={() => setForm((f) => ({ ...f, impact_stats: f.impact_stats.filter((_, j) => j !== i) }))}>Remove</button>
            </div>
          ))}
        </div>
        <button className="btn-ghost" onClick={() => setForm((f) => ({ ...f, impact_stats: [...f.impact_stats, { value: "", label: "" }] }))}>
          + Add stat
        </button>
      </div>

      {/* Homepage sections */}
      <div className="admin-card">
        <p className="admin-card-title">Homepage Sections</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          Control which sections appear on the homepage and in what order.
        </p>
        <div className="sections-list">
          {sortedSections.map((section, idx) => (
            <div className="section-row" key={section.id}>
              <input
                type="checkbox"
                checked={section.visible}
                onChange={() => toggleSection(section.id)}
                style={{ width: 16, height: 16, accentColor: "var(--green)", cursor: "pointer" }}
              />
              <span className="section-row-label">{section.label}</span>
              <div className="section-order-btns">
                <button
                  onClick={() => moveSectionUp(section.id)}
                  disabled={idx === 0}
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveSectionDown(section.id)}
                  disabled={idx === sortedSections.length - 1}
                  title="Move down"
                >
                  ▼
                </button>
              </div>
              <span className="badge badge-gray" style={{ fontSize: 11 }}>
                {section.visible ? "Visible" : "Hidden"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social channels */}
      <div className="admin-card">
        <p className="admin-card-title">Community & Social Links</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          These appear on the <strong>/join</strong> community page. Leave blank to hide a platform.
        </p>
        <div className="admin-grid-2">
          {[
            ["Instagram",   "instagram_url",  "https://instagram.com/..."],
            ["Twitter / X", "twitter_url",    "https://x.com/..."],
            ["TikTok",      "tiktok_url",     "https://tiktok.com/@..."],
            ["YouTube",     "youtube_url",    "https://youtube.com/@..."],
            ["WhatsApp",    "whatsapp_url",   "https://wa.me/..."],
            ["Telegram",    "telegram_url",   "https://t.me/..."],
            ["Facebook",    "facebook_url",   "https://facebook.com/..."],
            ["LinkedIn",    "linkedin_url",   "https://linkedin.com/in/..."]
          ].map(([label, key, placeholder]) => (
            <div className="admin-field" key={key}>
              <label>{label}</label>
              <input
                type="url"
                value={(form as unknown as Record<string, string>)[key] ?? ""}
                onChange={(e) => set(key as keyof Settings, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="admin-card">
        <p className="admin-card-title">Footer</p>
        <div className="admin-field">
          <label>Footer tagline</label>
          <input type="text" value={form.footer_tagline} onChange={(e) => set("footer_tagline", e.target.value)} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </>
  );
}
