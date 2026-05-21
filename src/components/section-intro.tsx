export function SectionIntro({
  kicker,
  title,
  body,
  dark = false
}: {
  kicker: string;
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "section-intro dark" : "section-intro"}>
      <p>{kicker}</p>
      <h2>{title}</h2>
      <span>{body}</span>
    </div>
  );
}
