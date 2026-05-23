import ResourceForm from "../ResourceForm";

export default function NewResourcePage() {
  return (
    <>
      <div className="admin-topbar"><h1>New Resource</h1></div>
      <div className="admin-content">
        <ResourceForm resource={{ title: "", slug: "", excerpt: "", cover_image_url: "", body: "" }} />
      </div>
    </>
  );
}
