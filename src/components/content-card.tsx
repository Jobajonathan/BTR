import Link from "next/link";

export function ContentCard({
  title,
  excerpt,
  tag,
  href = "#",
  accent = 1,
  cta = "Read the story"
}: {
  title: string;
  excerpt?: string;
  tag?: string;
  href?: string;
  accent?: number;
  cta?: string;
}) {
  return (
    <article className="story-card">
      <div className={`card-image accent-${accent}`} />
      {tag ? <span className="tag">{tag}</span> : null}
      <h3>{title}</h3>
      {excerpt ? <p>{excerpt}</p> : null}
      <Link href={href}>{cta}</Link>
    </article>
  );
}
