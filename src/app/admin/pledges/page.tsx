import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const CURRENCY_SYMBOLS: Record<string, string> = { GBP: "£", USD: "$", NGN: "₦", EUR: "€" };

export default async function PledgesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("donation_pledges")
    .select("*")
    .order("created_at", { ascending: false });

  const total = data?.length ?? 0;
  const active = data?.filter((p) => p.status === "active").length ?? 0;
  const monthlyTotal = data
    ?.filter((p) => p.frequency === "monthly" && p.status === "active")
    .reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

  return (
    <>
      <div className="admin-topbar">
        <h1>Donation Pledges</h1>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{total} total · {active} active</span>
        </div>
      </div>
      <div className="admin-content">
        {/* Stats */}
        <div className="users-stats-row" style={{ marginBottom: 24 }}>
          <div className="users-stat-card"><strong>{total}</strong><span>Total pledges</span></div>
          <div className="users-stat-card users-stat-green"><strong>{active}</strong><span>Active</span></div>
          <div className="users-stat-card users-stat-yellow">
            <strong>£{monthlyTotal.toLocaleString()}</strong><span>Monthly pipeline</span>
          </div>
        </div>

        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state"><p>No pledges yet. They will appear here when donors submit the pledge form on the donate page.</p></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Frequency</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => {
                  const sym = CURRENCY_SYMBOLS[p.currency] ?? p.currency;
                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                        <br />
                        <a href={`mailto:${p.email}`} style={{ color: "var(--green)", fontSize: 13 }}>{p.email}</a>
                      </td>
                      <td style={{ fontWeight: 700 }}>{sym}{Number(p.amount).toLocaleString()}</td>
                      <td style={{ textTransform: "capitalize" }}>{p.frequency}</td>
                      <td>
                        <span className={p.status === "active" ? "badge badge-green" : "badge badge-gray"} style={{ textTransform: "capitalize" }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ maxWidth: 200, fontSize: 13, color: "var(--muted)" }}>
                        {p.message ? (
                          <span title={p.message}>{p.message.length > 60 ? p.message.slice(0, 60) + "…" : p.message}</span>
                        ) : "—"}
                      </td>
                      <td style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>
                        {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
