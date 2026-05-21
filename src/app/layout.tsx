import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Behind the Reels",
  description:
    "Mental health storytelling, dialogues, and outreaches for young Africans.",
  metadataBase: new URL("https://behindthereels.co")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
