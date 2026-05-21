import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function JoinPage() {
  return (
    <PageShell>
      <section className="page-hero form-hero">
        <p className="eyebrow">Community</p>
        <h1>Join the Behind the Reels community.</h1>
        <p>
          This page will connect to your newsletter, WhatsApp, Telegram, or
          community platform when you choose the final channel.
        </p>
        <Link className="button primary" href="https://www.instagram.com/behindthereels.co/">
          Continue on Instagram
        </Link>
      </section>
    </PageShell>
  );
}
