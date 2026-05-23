"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type AdminRole, ROLE_LABELS, hasPermission } from "@/lib/supabase/roles";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  section: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const ALL_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "⊞", section: "dashboard" }
    ]
  },
  {
    label: "Content",
    items: [
      { href: "/admin/stories",    label: "Stories",              icon: "✦", section: "stories" },
      { href: "/admin/blog",       label: "Blog",                 icon: "✍", section: "blog" },
      { href: "/admin/dialogues",  label: "Dialogues",            icon: "◎", section: "dialogues" },
      { href: "/admin/outreach",   label: "Outreaches",           icon: "◈", section: "outreach" },
      { href: "/admin/resources",  label: "Resources",            icon: "▣", section: "resources" },
      { href: "/admin/authors",    label: "Authors & Categories", icon: "◉", section: "authors" },
      { href: "/admin/team",       label: "Team Members",         icon: "◐", section: "team" },
      { href: "/admin/submissions",label: "Submissions",          icon: "✉", section: "submissions" }
    ]
  },
  {
    label: "Community",
    items: [
      { href: "/admin/newsletter", label: "Newsletter",           icon: "◍", section: "newsletter" },
      { href: "/admin/partners",   label: "Partners",             icon: "◇", section: "partners" }
    ]
  },
  {
    label: "People",
    items: [
      { href: "/admin/users",      label: "Admin Users",          icon: "◍", section: "users" }
    ]
  },
  {
    label: "Site",
    items: [
      { href: "/admin/settings",   label: "Site Settings",        icon: "◧", section: "settings" },
      { href: "/admin/branding",   label: "Branding & Fonts",     icon: "◑", section: "branding" },
      { href: "/admin/media",      label: "Media Library",        icon: "◰", section: "media" },
      { href: "/admin/activity",   label: "Activity Log",         icon: "◴", section: "activity" }
    ]
  }
];

export default function AdminNav({
  userEmail,
  role
}: {
  userEmail: string;
  role: AdminRole;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const visibleNav: NavGroup[] = ALL_NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasPermission(role, item.section))
  })).filter((group) => group.items.length > 0);

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-dot" />
        <div>
          <strong>BTR Admin</strong>
          <span>Behind the Reels</span>
        </div>
      </div>

      {/* View site link */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="admin-view-site"
      >
        <span style={{ fontSize: 12 }}>↗</span>
        View site
      </a>

      <nav className="admin-nav">
        {visibleNav.map((group) => (
          <div key={group.label}>
            <div className="admin-nav-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? "active" : ""}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="admin-nav-divider" />
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <span title={userEmail}>{userEmail}</span>
        <span
          className={`role-badge role-badge-${role}`}
          style={{ marginBottom: 8, display: "inline-flex" }}
        >
          {ROLE_LABELS[role]}
        </span>
        <button className="admin-logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
