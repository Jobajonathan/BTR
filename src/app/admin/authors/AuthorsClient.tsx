"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveAuthor,
  deleteAuthor,
  saveCategory,
  deleteCategory
} from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image_url: string;
};

type Category = {
  id: string;
  title: string;
  slug: string;
  description: string;
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function AuthorForm({
  initial,
  onDone
}: {
  initial?: Author;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    bio: initial?.bio ?? "",
    image_url: initial?.image_url ?? ""
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSave() {
    startTransition(async () => {
      try {
        await saveAuthor({ id: initial?.id, ...form });
        onDone();
      } catch (e) {
        setError(String(e));
      }
    });
  }

  return (
    <div
      style={{
        background: "var(--cream)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        padding: 20,
        marginBottom: 12
      }}
    >
      {error && <div className="alert alert-error">{error}</div>}
      <div className="admin-grid-2">
        <div className="admin-field">
          <label>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({
                ...f,
                name,
                slug: f.slug === toSlug(f.name) ? toSlug(name) : f.slug
              }));
            }}
          />
        </div>
        <div className="admin-field">
          <label>Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
      </div>
      <div className="admin-field">
        <label>Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="admin-field">
        <label>Profile image</label>
        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
          previewHeight={64}
        />
      </div>
      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : initial ? "Update author" : "Add author"}
        </button>
        <button className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function CategoryForm({
  initial,
  onDone
}: {
  initial?: Category;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? ""
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSave() {
    startTransition(async () => {
      try {
        await saveCategory({ id: initial?.id, ...form });
        onDone();
      } catch (e) {
        setError(String(e));
      }
    });
  }

  return (
    <div
      style={{
        background: "var(--cream)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        padding: 20,
        marginBottom: 12
      }}
    >
      {error && <div className="alert alert-error">{error}</div>}
      <div className="admin-grid-2">
        <div className="admin-field">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                slug: f.slug === toSlug(f.title) ? toSlug(title) : f.slug
              }));
            }}
          />
        </div>
        <div className="admin-field">
          <label>Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((f) => ({ ...f, slug: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="admin-field">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={2}
        />
      </div>
      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : initial ? "Update category" : "Add category"}
        </button>
        <button className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AuthorsClient({
  authors: initialAuthors,
  categories: initialCategories
}: {
  authors: Author[];
  categories: Category[];
}) {
  const router = useRouter();
  const [authors, setAuthors] = useState(initialAuthors);
  const [categories, setCategories] = useState(initialCategories);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  const [addingAuthor, setAddingAuthor] = useState(false);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [addingCat, setAddingCat] = useState(false);
  const [, startTransition] = useTransition();

  function handleDelAuthor(id: string) {
    if (!confirm("Delete this author?")) return;
    startTransition(async () => {
      await deleteAuthor(id);
      setAuthors((a) => a.filter((x) => x.id !== id));
    });
  }

  function handleDelCat(id: string) {
    if (!confirm("Delete this category?")) return;
    startTransition(async () => {
      await deleteCategory(id);
      setCategories((c) => c.filter((x) => x.id !== id));
    });
  }

  return (
    <>
      {/* Authors */}
      <div className="admin-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <p className="admin-card-title" style={{ marginBottom: 0 }}>
            Authors
          </p>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: "6px 14px" }}
            onClick={() => {
              setAddingAuthor(true);
              setEditingAuthor(null);
            }}
          >
            + Add author
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          {addingAuthor && (
            <AuthorForm
              onDone={() => {
                setAddingAuthor(false);
                router.refresh();
              }}
            />
          )}
          {authors.length === 0 && !addingAuthor && (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No authors yet.</p>
          )}
          <table className="admin-table" style={{ marginTop: 8 }}>
            <tbody>
              {authors.map((a) => (
                <>
                  <tr key={a.id}>
                    <td>
                      <strong>{a.name}</strong>
                      <span>/{a.slug}</span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>
                      {a.bio?.slice(0, 60) || "—"}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-edit"
                          onClick={() =>
                            setEditingAuthor(
                              editingAuthor === a.id ? null : a.id
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn-del"
                          onClick={() => handleDelAuthor(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingAuthor === a.id && (
                    <tr key={`edit-${a.id}`}>
                      <td colSpan={3} style={{ padding: "8px 0" }}>
                        <AuthorForm
                          initial={a}
                          onDone={() => {
                            setEditingAuthor(null);
                            router.refresh();
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories */}
      <div className="admin-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <p className="admin-card-title" style={{ marginBottom: 0 }}>
            Story Categories
          </p>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: "6px 14px" }}
            onClick={() => {
              setAddingCat(true);
              setEditingCat(null);
            }}
          >
            + Add category
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          {addingCat && (
            <CategoryForm
              onDone={() => {
                setAddingCat(false);
                router.refresh();
              }}
            />
          )}
          {categories.length === 0 && !addingCat && (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No categories yet.</p>
          )}
          <table className="admin-table" style={{ marginTop: 8 }}>
            <tbody>
              {categories.map((c) => (
                <>
                  <tr key={c.id}>
                    <td>
                      <strong>{c.title}</strong>
                      <span>/{c.slug}</span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>
                      {c.description?.slice(0, 60) || "—"}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-edit"
                          onClick={() =>
                            setEditingCat(editingCat === c.id ? null : c.id)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn-del"
                          onClick={() => handleDelCat(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingCat === c.id && (
                    <tr key={`edit-${c.id}`}>
                      <td colSpan={3} style={{ padding: "8px 0" }}>
                        <CategoryForm
                          initial={c}
                          onDone={() => {
                            setEditingCat(null);
                            router.refresh();
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
