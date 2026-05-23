import { createAdminClient } from "@/lib/supabase/admin";
import MediaLibraryClient from "./MediaLibraryClient";

export default async function AdminMediaPage() {
  const supabase = createAdminClient();

  const { data: files, error } = await supabase.storage
    .from("btr-media")
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/btr-media/`;

  const items = (files ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      url: `${baseUrl}${f.name}`,
      size: f.metadata?.size ?? 0,
      created_at: f.created_at ?? ""
    }));

  return (
    <>
      <div className="admin-topbar">
        <h1>Media Library</h1>
      </div>
      <div className="admin-content">
        {error && (
          <div className="alert alert-error">
            Could not load media. Make sure the btr-media storage bucket exists.
          </div>
        )}
        <MediaLibraryClient items={items} />
      </div>
    </>
  );
}
