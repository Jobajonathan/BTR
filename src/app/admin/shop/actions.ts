"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveProduct(data: {
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
}) {
  const supabase = createAdminClient();
  const payload = {
    title: data.title,
    description: data.description || null,
    price: data.price ?? null,
    currency: data.currency,
    product_type: data.product_type,
    cover_image_url: data.cover_image_url || null,
    buy_link: data.buy_link || null,
    status: data.status,
    order_index: data.order_index,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    const { error } = await supabase.from("products").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/shop");
  revalidatePath("/shop");
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
}
