import { PageShell } from "@/components/page-shell";

export default function SubmitPage() {
  return (
    <PageShell>
      <section className="page-hero form-hero">
        <p className="eyebrow">Submit your story</p>
        <h1>Your story can help someone feel less alone.</h1>
        <p>
          The final version can use Tally, Typeform, or a custom private form.
          For now, this page sets the tone and submission flow.
        </p>
      </section>
      <section className="section form-placeholder">
        <h2>Story submission form</h2>
        <p>Name, email, story title, category, consent, and story body will live here.</p>
      </section>
    </PageShell>
  );
}
