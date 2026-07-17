import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("donate_headline, donate_copy, donate_amounts, donate_bank_name, donate_account_name, donate_account_number, donate_sort_code, donate_payment_link")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single();

  const headline = settings?.donate_headline ?? "Support the movement.";
  const copy = settings?.donate_copy ?? "Your gift funds mental health outreaches, stories, and community dialogues for young Africans who need to be heard.";
  const amounts: number[] = Array.isArray(settings?.donate_amounts)
    ? settings.donate_amounts
    : [5, 10, 25, 50];
  const bankName = settings?.donate_bank_name as string | null ?? null;
  const accountName = settings?.donate_account_name as string | null ?? null;
  const accountNumber = settings?.donate_account_number as string | null ?? null;
  const sortCode = settings?.donate_sort_code as string | null ?? null;
  const paymentLink = settings?.donate_payment_link as string | null ?? null;

  const hasBankDetails = bankName || accountName || accountNumber;

  return (
    <PageShell>
      {/* Hero */}
      <section className="page-hero" style={{ background: "var(--green)", color: "var(--white)" }}>
        <p className="eyebrow" style={{ color: "var(--yellow)" }}>Donate</p>
        <h1 style={{ color: "var(--white)" }}>{headline}</h1>
        <p style={{ color: "rgba(255,255,255,0.85)" }}>{copy}</p>
      </section>

      {/* Why donate */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 72, background: "var(--paper)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}>
          <div className="impact-strip" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 64 }}>
            {[
              { value: "Stories", body: "Fund personal essays and mental health content that reach millions of young Africans." },
              { value: "Outreaches", body: "Bring mental health support directly to schools, campuses, and communities." },
              { value: "Dialogues", body: "Host open conversations that help young people name what they're carrying." },
            ].map((item) => (
              <div key={item.value} style={{ background: "var(--cream)", borderRadius: 16, padding: "32px 28px" }}>
                <p style={{ fontWeight: 800, fontSize: 20, marginBottom: 10, color: "var(--green)" }}>{item.value}</p>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Suggested amounts */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Make a difference</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", marginBottom: 8 }}>Choose an amount</h2>
            <p style={{ color: "var(--muted)", marginBottom: 36 }}>Every contribution, big or small, keeps the movement going.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 32 }}>
              {amounts.map((amount) => (
                <div key={amount} style={{
                  border: "2px solid var(--green)",
                  borderRadius: 12,
                  padding: "16px 32px",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--green)",
                  background: "var(--white)",
                  minWidth: 100,
                  textAlign: "center"
                }}>
                  ${amount}
                </div>
              ))}
            </div>
            {paymentLink && (
              <Link
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary"
                style={{ fontSize: 17, padding: "16px 40px" }}
              >
                Donate now →
              </Link>
            )}
          </div>

          {/* Bank transfer */}
          {hasBankDetails && (
            <div style={{
              background: "var(--cream)",
              border: "1px solid var(--line)",
              borderRadius: 16,
              padding: "40px",
              maxWidth: 560,
              margin: "0 auto"
            }}>
              <p className="eyebrow" style={{ marginBottom: 8 }}>Bank transfer</p>
              <h3 style={{ fontSize: 20, marginBottom: 24 }}>Send directly to our account</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, borderBottom: sortCode ? "1px solid var(--line)" : "none" }}>
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
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 20 }}>
                Please email <a href="mailto:info@behindthereels.com" style={{ color: "var(--green)" }}>info@behindthereels.com</a> after sending so we can acknowledge your gift.
              </p>
            </div>
          )}

          {/* Fallback if no bank details yet */}
          {!hasBankDetails && !paymentLink && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ color: "var(--muted)", fontSize: 17 }}>
                Donation details coming soon. In the meantime, reach out at{" "}
                <a href="mailto:info@behindthereels.com" style={{ color: "var(--green)", fontWeight: 600 }}>
                  info@behindthereels.com
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section dark-section" style={{ textAlign: "center", padding: "80px 24px" }}>
        <p className="eyebrow" style={{ color: "var(--yellow)" }}>Other ways to help</p>
        <h2 style={{ fontSize: "clamp(24px,3vw,36px)", color: "var(--white)", marginBottom: 16 }}>
          Not in a position to give financially?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: "0 auto 32px" }}>
          Share our content, volunteer your skills, or simply tell someone about Behind the Reels.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/volunteer" className="button primary">Volunteer with us</Link>
          <Link href="/partner" className="button" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "var(--white)" }}>
            Partner with us
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
