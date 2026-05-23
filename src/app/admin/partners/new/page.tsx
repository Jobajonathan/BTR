import PartnerForm from "../PartnerForm";

const EMPTY: Parameters<typeof PartnerForm>[0]["partner"] = {
  name: "",
  description: "",
  logo_url: "",
  website_url: "",
  category: "",
  featured: false,
  order_index: 0
};

export default function NewPartnerPage() {
  return (
    <>
      <div className="admin-topbar">
        <h1>Add Partner</h1>
      </div>
      <div className="admin-content">
        <PartnerForm partner={EMPTY} />
      </div>
    </>
  );
}
