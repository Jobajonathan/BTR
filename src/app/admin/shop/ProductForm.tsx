"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveProduct, deleteProduct } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Product = {
  id?: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  product_type: "merch" | "book";
  cover_image_url: string;
  buy_link: string;
  status: "draft" | "published";
  order_index: number;
};

export default function ProductForm({ product }: { product: Product }) {
  const [form, setForm] = useState<Product>(product);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setSaveStatus("idle");
    startTransition(async () => {
      try {
        await saveProduct(form);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
        if (!form.id) router.push("/admin/shop");
      } catch { setSaveStatus("error"); }
    });
  }

  function handleDelete() {
    if (!form.id || !confirm("Delete this product?")) return;
    startTransition(async () => {
      await deleteProduct(form.id!);
      router.push("/admin/shop");
    });
  }

  return (
    <>
      <Link href="/admin/shop" className="back-link">← Back to Shop</Link>
      {saveStatus === "saved" && <div className="alert alert-success">{form.status === "published" ? "Product published." : "Draft saved."}</div>}
      {saveStatus === "error" && <div className="alert alert-error">Save failed.</div>}

      <div className="admin-card">
        <p className="admin-card-title">Product Details</p>
        <div className="admin-field">
          <label>Product name</label>
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. BTR Hoodie, Behind the Reels Journal" />
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Describe the product — size options, materials, what makes it special…" />
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Type</label>
            <select value={form.product_type} onChange={(e) => set("product_type", e.target.value as "merch" | "book")}>
              <option value="merch">Merchandise</option>
              <option value="book">Book</option>
            </select>
          </div>
          <div className="admin-field">
            <label>Currency</label>
            <select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Price</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price ?? ""}
              onChange={(e) => set("price", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
            />
          </div>
          <div className="admin-field">
            <label>Display order</label>
            <input type="number" value={form.order_index} onChange={(e) => set("order_index", parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="admin-field">
          <label>Buy link <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 12 }}>(external checkout URL)</span></label>
          <input type="url" value={form.buy_link} onChange={(e) => set("buy_link", e.target.value)} placeholder="https://paystack.com/buy/..." />
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Product Image</p>
        <ImageUpload value={form.cover_image_url} onChange={(url) => set("cover_image_url", url)} previewHeight={200} />
      </div>

      <div className="admin-card publish-panel">
        <p className="admin-card-title">Publish</p>
        <div className="publish-toggle">
          <button type="button" className={`publish-btn${form.status === "draft" ? " active" : ""}`} onClick={() => set("status", "draft")}>
            Save as draft
          </button>
          <button type="button" className={`publish-btn publish-btn-green${form.status === "published" ? " active" : ""}`} onClick={() => set("status", "published")}>
            Publish
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : form.status === "published" ? "Save & publish" : "Save draft"}
        </button>
        {form.id && <button className="btn-danger" onClick={handleDelete} disabled={isPending}>Delete</button>}
      </div>
    </>
  );
}
