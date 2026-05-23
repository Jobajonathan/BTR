import { createAdminClient } from "@/lib/supabase/admin";
import BrandingForm from "./BrandingForm";

const BRANDING_ID = "00000000-0000-0000-0000-000000000001";

const defaults = {
  primary_color: "#1f6b4a",
  accent_color: "#f5c84b",
  background_color: "#f7f1e7",
  text_color: "#18211e",
  heading_font: "Inter",
  body_font: "Inter",
  logo_url: "",
  favicon_url: ""
};

export default async function BrandingPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("branding")
    .select("*")
    .eq("id", BRANDING_ID)
    .single();

  const branding = { ...defaults, ...data };

  return (
    <>
      <div className="admin-topbar">
        <h1>Branding & Fonts</h1>
      </div>
      <div className="admin-content">
        <BrandingForm data={branding} />
      </div>
    </>
  );
}
