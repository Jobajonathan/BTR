import { createAdminClient } from "@/lib/supabase/admin";
import AuthorsClient from "./AuthorsClient";

export default async function AuthorsPage() {
  const supabase = createAdminClient();
  const [{ data: authors }, { data: categories }] = await Promise.all([
    supabase.from("authors").select("*").order("name"),
    supabase.from("categories").select("*").order("title")
  ]);

  return (
    <>
      <div className="admin-topbar">
        <h1>Authors & Categories</h1>
      </div>
      <div className="admin-content">
        <AuthorsClient
          authors={authors ?? []}
          categories={categories ?? []}
        />
      </div>
    </>
  );
}
