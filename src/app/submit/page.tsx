import { PageShell } from "@/components/page-shell";
import SubmitForm from "./SubmitForm";

export default function SubmitPage() {
  return (
    <PageShell>
      <section className="page-hero form-hero">
        <p className="eyebrow">Submit your story</p>
        <h1>Your story can help someone feel less alone.</h1>
        <p>
          Share what you have been carrying — pressure, identity, family, faith, healing, or
          anything in between. Anonymous submissions are welcome.
        </p>
      </section>
      <section className="section" style={{ maxWidth: 760, paddingTop: 0 }}>
        <SubmitForm />
      </section>
    </PageShell>
  );
}
