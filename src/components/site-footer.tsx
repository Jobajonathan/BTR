import Link from "next/link";
import { navItems } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Behind the Reels</strong>
        <p>Mental health storytelling, dialogues, and outreaches for young Africans.</p>
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
        <Link href="/newsletter">Newsletter</Link>
        <Link href="https://www.instagram.com/behindthereels.co/">Instagram</Link>
      </nav>
    </footer>
  );
}
