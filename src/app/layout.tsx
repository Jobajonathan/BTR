import type { Metadata } from "next";
import { getBranding } from "@/lib/supabase/cache";
import "./globals.css";

export const metadata: Metadata = {
  title: "Behind the Reels",
  description:
    "Mental health storytelling, dialogues, and outreaches for young Africans.",
  metadataBase: new URL("https://btr.theryters.com")
};

function buildGoogleFontsUrl(heading: string, body: string): string {
  const system = new Set(["Inter", "Georgia", "system-ui"]);
  const fonts = [...new Set([heading, body])].filter((f) => !system.has(f));
  if (fonts.length === 0) return "";
  const params = fonts
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;600;700;800`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const branding = await getBranding();

  const primary = branding?.primary_color ?? "#1f6b4a";
  const accent = branding?.accent_color ?? "#f5c84b";
  const bg = branding?.background_color ?? "#f7f1e7";
  const ink = branding?.text_color ?? "#18211e";
  const headingFont = branding?.heading_font ?? "Inter";
  const bodyFont = branding?.body_font ?? "Inter";
  const faviconUrl = branding?.favicon_url ?? null;
  const logoUrl = branding?.logo_url ?? null;

  const googleFontsUrl = buildGoogleFontsUrl(headingFont, bodyFont);

  const cssVars = `
    :root {
      --ink: ${ink};
      --muted: #5c655f;
      --cream: ${bg};
      --paper: #fffcf5;
      --green: ${primary};
      --green-soft: color-mix(in srgb, ${primary} 15%, white);
      --yellow: ${accent};
      --coral: #d86f52;
      --rose: #f0c7b7;
      --line: #e5d9c8;
      --white: #ffffff;
      --body-font: '${bodyFont}', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      --heading-font: '${headingFont}', ui-sans-serif, system-ui, -apple-system, sans-serif;
    }
    html { font-family: var(--body-font); }
    h1,h2,h3,h4,h5,h6 { font-family: var(--heading-font); }
  `;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {googleFontsUrl && (
          <link rel="stylesheet" href={googleFontsUrl} />
        )}
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
        {logoUrl && (
          <meta name="btr-logo" content={logoUrl} />
        )}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
