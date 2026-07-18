import PageForm from "../PageForm";

export default function NewPagePage() {
  return (
    <>
      <div className="admin-topbar"><h1>New Page</h1></div>
      <div className="admin-content">
        <PageForm page={{ title: "", slug: "", content: "", seo_title: "", seo_description: "", status: "draft" }} />
      </div>
    </>
  );
}
