import { createAdminClient } from "@/lib/supabase/admin";
import ProductForm from "../ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <>
      <div className="admin-topbar"><h1>Edit Product</h1></div>
      <div className="admin-content">
        <ProductForm product={{
          id: data.id,
          title: data.title ?? "",
          description: data.description ?? "",
          price: data.price ?? null,
          currency: data.currency ?? "GBP",
          product_type: (data.product_type as "merch" | "book") ?? "merch",
          cover_image_url: data.cover_image_url ?? "",
          buy_link: data.buy_link ?? "",
          status: (data.status as "draft" | "published") ?? "draft",
          order_index: data.order_index ?? 0,
        }} />
      </div>
    </>
  );
}
