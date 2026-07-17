import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ContactMessagesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Contact Messages</h1>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{data?.length ?? 0} total</span>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          {!data?.length ? (
            <div className="empty-state"><p>No messages yet.</p></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {data.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    padding: "20px 24px",
                    marginBottom: 12
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    <div>
                      <strong style={{ fontSize: 15 }}>{msg.name}</strong>
                      <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 12 }}>
                        <a href={`mailto:${msg.email}`} style={{ color: "var(--green)" }}>{msg.email}</a>
                      </span>
                      {msg.organisation && (
                        <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 12 }}>· {msg.organisation}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="badge badge-gray" style={{ fontSize: 12 }}>{msg.inquiry_type}</span>
                      <span style={{ color: "var(--muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                        {new Date(msg.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: "var(--body)", fontSize: 14, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{msg.message}</p>
                  <div style={{ marginTop: 12 }}>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.inquiry_type)}`}
                      className="btn-ghost"
                      style={{ fontSize: 13 }}
                    >
                      Reply by email →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
