"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTeamMember, deleteTeamMember } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Member = {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  order_index: number;
};

function MemberForm({ initial, onDone }: { initial?: Member; onDone: () => void }) {
  const [form, setForm] = useState<Member>({
    name: initial?.name ?? "",
    role: initial?.role ?? "",
    bio: initial?.bio ?? "",
    image_url: initial?.image_url ?? "",
    order_index: initial?.order_index ?? 0
  });
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveTeamMember({ id: initial?.id, ...form });
      onDone();
    });
  }

  return (
    <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 8, padding: 20, marginBottom: 12 }}>
      <div className="admin-grid-2">
        <div className="admin-field">
          <label>Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="admin-field">
          <label>Role / Title</label>
          <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. Co-founder" />
        </div>
      </div>
      <div className="admin-field">
        <label>Bio</label>
        <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={2} />
      </div>
      <div className="admin-field">
        <label>Photo</label>
        <ImageUpload value={form.image_url} onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} previewHeight={64} />
      </div>
      <div className="admin-field" style={{ width: 120 }}>
        <label>Order</label>
        <input type="text" value={form.order_index} onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))} />
      </div>
      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>{isPending ? "Saving…" : initial ? "Update" : "Add member"}</button>
        <button className="btn-ghost" onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

export default function TeamClient({ members: initial }: { members: Member[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    startTransition(async () => {
      await deleteTeamMember(id!);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="admin-card-title" style={{ marginBottom: 0 }}>Team Members</p>
        <button className="btn-primary" style={{ fontSize: 13, padding: "6px 14px" }} onClick={() => { setAdding(true); setEditing(null); }}>+ Add member</button>
      </div>
      <div style={{ marginTop: 16 }}>
        {adding && <MemberForm onDone={() => { setAdding(false); router.refresh(); }} />}
        {initial.length === 0 && !adding && <p style={{ color: "var(--muted)", fontSize: 14 }}>No team members yet.</p>}
        <table className="admin-table" style={{ marginTop: 8 }}>
          <tbody>
            {initial.map((m) => (
              <>
                <tr key={m.id}>
                  <td><strong>{m.name}</strong><span>{m.role}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{m.bio?.slice(0, 60) || "—"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-edit" onClick={() => setEditing(editing === m.id ? null : m.id!)}>Edit</button>
                      <button className="btn-del" onClick={() => handleDelete(m.id!)}>Delete</button>
                    </div>
                  </td>
                </tr>
                {editing === m.id && (
                  <tr key={`edit-${m.id}`}>
                    <td colSpan={3} style={{ padding: "8px 0" }}>
                      <MemberForm initial={m} onDone={() => { setEditing(null); router.refresh(); }} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
