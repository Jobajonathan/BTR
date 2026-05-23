import { PageShell } from "@/components/page-shell";
import NewsletterForm from "./NewsletterForm";

export const metadata = {
  title: "Newsletter | Behind the Reels",
  description: "Receive stories, resources, and community notes from BTR."
};

export default function NewsletterPage() {
  return (
    <PageShell>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,480px)",
          gap: "clamp(40px,6vw,80px)",
          alignItems: "center",
          padding: "clamp(72px,9vw,120px) clamp(24px,6vw,88px)",
          background: "var(--paper)"
        }}
      >
        <div>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Newsletter</p>
          <h1 style={{ fontSize: "clamp(36px,5vw,62px)", lineHeight: 1.03, margin: "0 0 22px" }}>
            Stories, resources, and notes you can actually use.
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "var(--muted)", lineHeight: 1.55, margin: 0, maxWidth: 520 }}>
            The BTR newsletter brings you stories of real experiences, practical mental health
            resources, and updates from the community — straight to your inbox.
          </p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 28, display: "grid", gap: 12 }}>
            {[
              "Real stories from the BTR community",
              "Practical guides and resources",
              "Dialogue recaps and event updates",
              "Monthly — no spam, ever"
            ].map((item) => (
              <li
                key={item}
                style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--ink)" }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    background: "var(--green-soft)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--green)",
                    fontWeight: 900,
                    fontSize: 12,
                    flexShrink: 0
                  }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <NewsletterForm />
        </div>
      </section>

      {/* Social proof strip */}
      <section
        style={{
          background: "var(--cream)",
          borderTop: "1px solid var(--line)",
          padding: "40px clamp(24px,6vw,88px)",
          textAlign: "center"
        }}
      >
        <p style={{ color: "var(--muted)", fontSize: 15, margin: 0 }}>
          Join a growing community of young Africans reading BTR.
        </p>
      </section>
    </PageShell>
  );
}
