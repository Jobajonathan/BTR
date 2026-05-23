import OutreachForm from "../OutreachForm";

export default function NewOutreachPage() {
  return (
    <>
      <div className="admin-topbar"><h1>New Outreach</h1></div>
      <div className="admin-content">
        <OutreachForm outreach={{ title: "", slug: "", location: "", date: "", summary: "", gallery: [], impact_stats: [], partners: [], testimonial: "", testimonial_author: "" }} />
      </div>
    </>
  );
}
