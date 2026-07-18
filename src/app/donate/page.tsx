import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import PledgeForm from "./PledgeForm";

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("donate_headline, donate_copy, donate_amounts, donate_bank_name, donate_account_name, donate_account_number, donate_sort_code, donate_payment_link")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single();

  const headline = settings?.donate_headline ?? "Support Behind the Reels.";
  const copy = settings?.donate_copy ?? "Your gift funds mental health outreaches, stories, and community dialogues for young Africans who need to be heard.";
  const amounts: number[] = Array.isArray(settings?.donate_amounts) ? settings.donate_amounts : [5, 10, 25, 50];
  const bankName = settings?.donate_bank_name as string | null ?? null;
  const accountName = settings?.donate_account_name as string | null ?? null;
  const accountNumber = settings?.donate_account_number as string | null ?? null;
  const sortCode = settings?.donate_sort_code as string | null ?? null;
  const paymentLink = settings?.donate_payment_link as string | null ?? null;
  const hasBankDetails = !!(bankName || accountName || accountNumber);
  const currency = "£";

  return (
    <PageShell>
      {/* Hero */}
      <section className="page-hero" style={{ background: "var(--green)", color: "var(--white)" }}>
        <p className="eyebrow" style={{ color: "var(--yellow)" }}>Donate</p>
        <h1 style={{ color: "var(--white)" }}>{headline}</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", maxWidth: 600, margin: "0 auto" }}>{copy}</p>
      </section>

      {/* Impact stats */}
      <section style={{ background: "var(--paper)", padding: "48px clamp(24px,6vw,88px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Stories funded", body: "Personal essays on mental health reaching millions of young Africans." },
            { label: "Outreaches delivered", body: "Mental health support to schools, campuses, and communities." },
            { label: "Dialogues hosted", body: "Open conversations that help young people name what they carry." },
          ].map((item) => (
            <div key={item.label} style={{ background: "var(--cream)", borderRadius: 14, padding: "28px 24px" }}>
              <p style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: "var(--green)" }}>{item.label}</p>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs: One-time vs Pledge */}
      <section id="give" style={{ padding: "64px clamp(24px,6vw,88px)", background: "var(--white)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* One-time donation */}
          <div style={{ marginBottom: 64 }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>One-time gift</p>
            <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", marginBottom: 6 }}>Give once</h2>
            <p style={{ color: "var(--muted)", marginBottom: 28 }}>Every gift, big or small, keeps this movement alive.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
              {amounts.map((a) => (
                <div key={a} style={{
                  border: "2px solid var(--green)",
                  borderRadius: 10,
                  padding: "14px 28px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--green)",
                  background: "var(--white)",
                  minWidth: 90,
                  textAlign: "center",
                }}>
                  {currency}{a}
                </div>
              ))}
            </div>
            {paymentLink ? (
              <Link
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary"
                style={{ fontSize: 16, padding: "14px 36px", display: "inline-block" }}
              >
                Donate now →
              </Link>
            ) : (
              <div style={{ padding: "20px 24px", background: "var(--cream)", borderRadius: 10, fontSize: 14, color: "var(--muted)" }}>
                Online payment coming soon. Use bank transfer below or contact us at{" "}
                <a href="mailto:info@behindthereels.com" style={{ color: "var(--green)" }}>info@behindthereels.com</a>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--line)", margin: "0 0 64px" }} />

          {/* Pledge / recurring */}
          <div style={{ marginBottom: 64 }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>Periodic pledge</p>
            <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", marginBottom: 6 }}>Give regularly</h2>
            <p style={{ color: "var(--muted)", marginBottom: 28 }}>
              Register a recurring pledge and we&apos;ll send you a reminder before each gift date, plus an impact report showing what your contribution helped fund.
            </p>
            <PledgeForm currency={currency} />
          </div>

          {/* Bank transfer */}
          {hasBankDetails && (
            <>
              <div style={{ borderTop: "1px solid var(--line)", margin: "0 0 48px" }} />
              <div>
                <p className="eyebrow" style={{ marginBottom: 6 }}>Bank transfer</p>
                <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", marginBottom: 20 }}>Send directly</h2>
                <div style={{
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "32px",
                  maxWidth: 520,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14
                }}>
                  {bankName && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
                      <span style={{ color: "var(--muted)", fontSize: 14 }}>Bank</span>
                      <strong>{bankName}</strong>
                    </div>
                  )}
                  {accountName && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
                      <span style={{ color: "var(--muted)", fontSize: 14 }}>Account name</span>
                      <strong>{accountName}</strong>
                    </div>
                  )}
                  {accountNumber && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: sortCode ? 14 : 0, borderBottom: sortCode ? "1px solid var(--line)" : "none" }}>
                      <span style={{ color: "var(--muted)", fontSize: 14 }}>Account number</span>
                      <strong style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}>{accountNumber}</strong>
                    </div>
                  )}
                  {sortCode && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--muted)", fontSize: 14 }}>Sort code</span>
                      <strong style={{ fontFamily: "monospace" }}>{sortCode}</strong>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>
                  After transferring, please email <a href="mailto:info@behindthereels.com" style={{ color: "var(--green)" }}>info@behindthereels.com</a> with your name so we can acknowledge your gift.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section dark-section" style={{ textAlign: "center", padding: "72px 24px" }}>
        <p className="eyebrow" style={{ color: "var(--yellow)" }}>Other ways to help</p>
        <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", color: "var(--white)", marginBottom: 14 }}>
          Not in a position to give financially?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 480, margin: "0 auto 28px" }}>
          Share our content, volunteer your skills, or simply tell someone about Behind the Reels.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/volunteer" className="button primary">Volunteer with us</Link>
          <Link href="/partner" className="button" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "var(--white)" }}>
            Partner with us
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
