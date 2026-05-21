import { PageShell } from "@/components/page-shell";

export default function NewsletterPage() {
  return (
    <PageShell>
      <section className="page-hero form-hero">
        <p className="eyebrow">Newsletter</p>
        <h1>Receive stories, resources, and community notes.</h1>
        <p>
          This will connect to Resend, Mailchimp, ConvertKit, or another email
          tool when the newsletter provider is chosen.
        </p>
      </section>
    </PageShell>
  );
}
