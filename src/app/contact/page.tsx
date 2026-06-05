import { PageShell } from "@/components/page-shell";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <PageShell>
      <section className="page-hero" style={{ paddingBottom: 48 }}>
        <p className="eyebrow">Get in touch</p>
        <h1>Let&apos;s build something together.</h1>
        <p>
          Whether you want to partner, collaborate, sponsor, or just ask a question — we&apos;d
          love to hear from you.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 48, maxWidth: 780, margin: "0 auto" }}>
        <ContactForm />
      </section>
    </PageShell>
  );
}
