import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/lib/content";
import { getBranding, getSiteSettings } from "@/lib/supabase/cache";
import { MobileNav } from "@/components/mobile-nav";

export async function SiteHeader() {
  const [branding, settings] = await Promise.all([getBranding(), getSiteSettings()]);
  const logoUrl = branding?.logo_url ?? "/images/btr-logo.jpg";
  const ctaLabel = (settings as Record<string, unknown> | null)?.header_cta_label as string ?? "Donate";
  const ctaUrl = (settings as Record<string, unknown> | null)?.header_cta_url as string ?? "/donate";

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Behind the Reels home">
        <Image
          src={logoUrl}
          alt="Behind the Reels logo"
          width={44}
          height={44}
          priority
          unoptimized={logoUrl.startsWith("https://")}
        />
        <span>Behind the Reels</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="button primary header-cta" href={ctaUrl}>
        {ctaLabel}
      </Link>
      {/* Mobile hamburger + drawer */}
      <MobileNav />
    </header>
  );
}
