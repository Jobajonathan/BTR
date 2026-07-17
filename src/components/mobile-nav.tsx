"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navItems } from "@/lib/content";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Close menu on route change / scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        className="mobile-menu-btn"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`hamburger ${open ? "is-open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Full-screen overlay */}
      {open && (
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)}>
          <nav
            className="mobile-nav-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              className="button primary"
              href="/donate"
              style={{ width: "100%", textAlign: "center" }}
              onClick={() => setOpen(false)}
            >
              Donate
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
