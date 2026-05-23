import { PageShell } from "@/components/page-shell";
import { getSiteSettings } from "@/lib/supabase/cache";

type SocialChannel = {
  label: string;
  key: string;
  icon: string;
  color: string;
  description: string;
};

const CHANNELS: SocialChannel[] = [
  { label: "Instagram",  key: "instagram_url",  icon: "📸", color: "#E1306C", description: "Follow our daily content and stories" },
  { label: "TikTok",     key: "tiktok_url",     icon: "🎵", color: "#010101", description: "Short videos on mental health" },
  { label: "Twitter / X",key: "twitter_url",    icon: "✕",  color: "#000000", description: "Conversations and updates" },
  { label: "Facebook",   key: "facebook_url",   icon: "f",  color: "#1877F2", description: "Community posts and events" },
  { label: "YouTube",    key: "youtube_url",    icon: "▶",  color: "#FF0000", description: "Long-form dialogues and recaps" },
  { label: "WhatsApp",   key: "whatsapp_url",   icon: "💬", color: "#25D366", description: "Join our community group" },
  { label: "Telegram",   key: "telegram_url",   icon: "✈",  color: "#229ED9", description: "Channel updates and resources" },
  { label: "LinkedIn",   key: "linkedin_url",   icon: "in", color: "#0A66C2", description: "Professional network and partnerships" }
];

export default async function JoinPage() {
  const settings = await getSiteSettings();

  const activeChannels = CHANNELS.filter(
    (c) => settings?.[c.key as keyof typeof settings]
  );

  return (
    <PageShell>
      <section className="page-hero about-hero">
        <p className="eyebrow">Community</p>
        <h1>Join the Behind the Reels community.</h1>
        <p>
          We show up across different platforms — choose the one that feels most like you.
        </p>
      </section>

      <section className="section" style={{ maxWidth: 800, margin: "0 auto" }}>
        {activeChannels.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
              padding: "0 clamp(24px,6vw,88px)"
            }}
          >
            {activeChannels.map((channel) => {
              const url = settings?.[channel.key as keyof typeof settings] as string;
              return (
                <a
                  key={channel.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    padding: "24px 22px",
                    textDecoration: "none",
                    color: "var(--ink)",
                    transition: "border-color 0.15s, box-shadow 0.15s"
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = channel.color;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px ${channel.color}22`;
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--line)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: channel.color,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 18,
                      flexShrink: 0
                    }}
                  >
                    {channel.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>{channel.label}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                      {channel.description}
                    </p>
                  </div>
                  <span style={{ fontSize: 12, color: channel.color, fontWeight: 700, marginTop: "auto" }}>
                    Follow →
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <p style={{ color: "var(--muted)", fontSize: 17, marginBottom: 24 }}>
              Our social links are being updated. Check back soon.
            </p>
            <a
              href="https://www.instagram.com/behindthereels.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              Find us on Instagram
            </a>
          </div>
        )}
      </section>
    </PageShell>
  );
}
