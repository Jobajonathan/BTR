import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const CURRENCY_SYM: Record<string, string> = { GBP: "£", USD: "$", NGN: "₦", EUR: "€" };

export default async function ShopAdminPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, title, product_type, price, currency, status, order_index")
    .order("order_index", { ascending: true });

  return (
    <>
      <div className="admin-topbar">
        <h1>Shop & Merch</h1>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            {data?.filter((p) => p.status === "published").length ?? 0} live products
          </span>
          <Link href="/admin/shop/new" className="btn-primary">+ Add product</Link>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state">
              <p>No products yet.</p>
              <Link href="/admin/shop/new" className="btn-primary">Add first product</Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Type</th><th>Price</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.title}</strong></td>
                    <td style={{ textTransform: "capitalize", fontSize: 13 }}>{p.product_type}</td>
                    <td style={{ fontWeight: 600 }}>
                      {p.price ? `${CURRENCY_SYM[p.currency] ?? p.currency}${Number(p.price).toLocaleString()}` : "—"}
                    </td>
                    <td>
                      <span className={p.status === "published" ? "badge badge-green" : "badge badge-gray"}>
                        {p.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/shop/${p.id}`} className="btn-edit">Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
