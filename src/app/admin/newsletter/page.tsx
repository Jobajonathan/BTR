import { createAdminClient } from "@/lib/supabase/admin";
import NewsletterClient from "./NewsletterClient";

export default async function AdminNewsletterPage() {
  const supabase = createAdminClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, source, confirmed, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-topbar">
        <h1>Newsletter</h1>
        <div className="topbar-actions">
          <a href="/newsletter" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            View signup page ↗
          </a>
        </div>
      </div>
      <div className="admin-content">
        <NewsletterClient
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subscribers={(subscribers ?? []) as any}
          total={count ?? 0}
        />
      </div>
    </>
  );
}
