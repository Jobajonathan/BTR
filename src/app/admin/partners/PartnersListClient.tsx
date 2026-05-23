"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePartner } from "./actions";

type Partner = {
  id: string;
  name: string;
  category: string | null;
  featured: boolean;
  order_index: number;
  website_url: string | null;
  logo_url: string | null;
};

export default function PartnersListClient({ partners }: { partners: Partner[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    startTransition(async () => {
      await deletePartner(id);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      {!partners.length ? (
        <div className="empty-state">
          <p>No partners yet.</p>
          <Link href="/admin/partners/new" className="btn-primary">Add the first partner</Link>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {p.logo_url && (
                      <img src={p.logo_url} alt={p.name} height={28} style={{ objectFit: "contain", borderRadius: 3 }} />
                    )}
                    <strong>{p.name}</strong>
                  </div>
                  {p.website_url && (
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.website_url}</span>
                  )}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>{p.category ?? "—"}</td>
                <td>
                  {p.featured
                    ? <span className="badge badge-yellow">Featured</span>
                    : <span className="badge badge-gray">No</span>}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13, textAlign: "center" }}>{p.order_index}</td>
                <td>
                  <div className="table-actions">
                    <Link href={`/admin/partners/${p.id}`} className="btn-edit">Edit</Link>
                    <button
                      className="btn-danger-sm"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={isPending}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
