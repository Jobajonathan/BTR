import ProjectForm from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <div className="admin-topbar"><h1>New Project</h1></div>
      <div className="admin-content">
        <ProjectForm project={{ title: "", slug: "", description: "", cover_image_url: "", status: "draft", order_index: 0 }} />
      </div>
    </>
  );
}
