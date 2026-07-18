import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const CURRENCY_SYM: Record<string, string> = { GBP: "£", USD: "$", NGN: "₦", EUR: "€" };

export default async function ShopPage() {
  const supabase = createAdminClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, title, description, price, currency, product_type, cover_image_url, buy_link")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  const merch = products?.filter((p) => p.product_type === "merch") ?? [];
  const books = products?.filter((p) => p.product_type === "book") ?? [];

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--paper)" }}>
        <p className="eyebrow">Shop</p>
        <h1>Wear the movement.</h1>
        <p>Every purchase supports Behind the Reels and the young Africans who share their stories with us.</p>
      </section>

      <section className="section" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", paddingLeft: "clamp(24px,6vw,88px)", paddingRight: "clamp(24px,6vw,88px)" }}>
          {!products?.length ? (
            <div style={{ textAlign: "center", padding: "72px 0", color: "var(--muted)" }}>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Coming soon.</p>
              <p>Our shop is being set up. Check back soon for merch and books.</p>
            </div>
          ) : (
            <>
              {books.length > 0 && (
                <div style={{ marginBottom: 64 }}>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>Books</p>
                  <ProductGrid products={books} />
                </div>
              )}
              {merch.length > 0 && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>Merchandise</p>
                  <ProductGrid products={merch} />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function ProductGrid({ products }: { products: Array<{ id: string; title: string; description: string | null; price: number | null; currency: string; cover_image_url: string | null; buy_link: string | null }> }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
      {products.map((product) => {
        const sym = CURRENCY_SYM[product.currency] ?? product.currency;
        return (
          <article
            key={product.id}
            style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "var(--white)" }}
          >
            {product.cover_image_url ? (
              <div style={{ position: "relative", height: 240 }}>
                <Image src={product.cover_image_url} alt={product.title} fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            ) : (
              <div style={{ height: 240, background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 48 }}>🛍</span>
              </div>
            )}
            <div style={{ padding: "20px 20px 24px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{product.title}</h3>
              {product.description && (
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>
                  {product.description.length > 100 ? product.description.slice(0, 100) + "…" : product.description}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                {product.price && (
                  <span style={{ fontWeight: 700, fontSize: 20, color: "var(--green)" }}>
                    {sym}{Number(product.price).toLocaleString()}
                  </span>
                )}
                {product.buy_link ? (
                  <Link
                    href={product.buy_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button primary"
                    style={{ fontSize: 14, padding: "10px 20px" }}
                  >
                    Buy now →
                  </Link>
                ) : (
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>Link coming soon</span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
