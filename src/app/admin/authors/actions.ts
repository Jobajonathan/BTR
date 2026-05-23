"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveAuthor(data: {
  id?: string;
  name: string;
  slug: string;
  bio: string;
  image_url: string;
}) {
  const supabase = createAdminClient();
  if (data.id) {
    const { error } = await supabase
      .from("authors")
      .update({ name: data.name, slug: data.slug, bio: data.bio, image_url: data.image_url })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("authors")
      .insert({ name: data.name, slug: data.slug, bio: data.bio, image_url: data.image_url });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/authors");
}

export async function deleteAuthor(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/authors");
}

export async function saveCategory(data: {
  id?: string;
  title: string;
  slug: string;
  description: string;
}) {
  const supabase = createAdminClient();
  if (data.id) {
    const { error } = await supabase
      .from("categories")
      .update({ title: data.title, slug: data.slug, description: data.description })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("categories")
      .insert({ title: data.title, slug: data.slug, description: data.description });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/authors");
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/authors");
}
