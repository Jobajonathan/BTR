import Link from "next/link";
import { navItems } from "@/lib/content";
import { getSiteSettings } from "@/lib/supabase/cache";

const SOCIAL_LINKS = [
  { key: "instagram_url", label: "Instagram" },
  { key: "twitter_url",   label: "Twitter / X" },
  { key: "tiktok_url",    label: "TikTok" },
  { key: "youtube_url",   label: "YouTube" },
  { key: "facebook_url",  label: "Facebook" },
  { key: "whatsapp_url",  label: "WhatsApp" },
  { key: "telegram_url",  label: "Telegram" },
  { key: "linkedin_url",  label: "LinkedIn" }
];

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const tagline = settings?.footer_tagline ?? "Behind every reel is a real story.";

  const activeSocials = SOCIAL_LINKS.filter(
    (s) => settings?.[s.key as keyof typeof settings]
  );

  return (
    <footer className="site-footer">
      <div>
        <strong>Behind the Reels</strong>
        <p>{tagline}</p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <nav aria-label="Community links">
        <Link href="/submit">Submit your story</Link>
        <Link href="/partner">Partner with us</Link>
        <Link href="/join">Community</Link>
        {activeSocials.map((s) => (
          <Link
            key={s.key}
            href={settings![s.key as keyof typeof settings] as string}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
