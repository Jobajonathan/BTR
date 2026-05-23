import DialogueForm from "../DialogueForm";

export default function NewDialoguePage() {
  return (
    <>
      <div className="admin-topbar"><h1>New Dialogue</h1></div>
      <div className="admin-content">
        <DialogueForm dialogue={{ title: "", slug: "", date: "", guest: "", summary: "", cover_image_url: "", recording_url: "", key_takeaways: [], meta: "" }} />
      </div>
    </>
  );
}
