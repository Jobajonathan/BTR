import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Behind the Reels home">
        <Image
          src="/images/btr-logo.jpg"
          alt="Behind the Reels logo"
          width={44}
          height={44}
          priority
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
      <Link className="button primary header-cta" href="/join">
        Join the Community
      </Link>
    </header>
  );
}
