"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSubscriber, exportSubscribersCSV } from "./actions";

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  confirmed: boolean;
  created_at: string;
};

export default function NewsletterClient({
  subscribers,
  total
}: {
  subscribers: Subscriber[];
  total: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [exporting, setExporting] = useState(false);

  function handleDelete(id: string, email: string) {
    if (!confirm(`Remove ${email} from the newsletter list?`)) return;
    startTransition(async () => {
      await deleteSubscriber(id);
      router.refresh();
    });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const csv = await exportSubscribersCSV();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `btr-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="admin-card">
      <div className="list-toolbar">
        <span style={{ fontSize: 13, color: "var(--muted)" }}>
          {total} {total === 1 ? "subscriber" : "subscribers"} total
        </span>
        <button
          className="btn-ghost"
          style={{ marginLeft: "auto" }}
          onClick={handleExport}
          disabled={exporting || total === 0}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      {!subscribers.length ? (
        <div className="empty-state">
          <p>No subscribers yet.</p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Subscribers appear here when someone signs up via the newsletter page.
          </p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Source</th>
              <th>Confirmed</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.email}</strong></td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>{s.name ?? "—"}</td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>{s.source ?? "website"}</td>
                <td>
                  {s.confirmed ? (
                    <span className="badge badge-green">Yes</span>
                  ) : (
                    <span className="badge badge-gray">No</span>
                  )}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>
                  {new Date(s.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </td>
                <td>
                  <button
                    className="btn-danger-sm"
                    onClick={() => handleDelete(s.id, s.email)}
                    disabled={isPending}
                    title="Remove subscriber"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
