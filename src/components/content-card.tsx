import Image from "next/image";
import Link from "next/link";

export function ContentCard({
  title,
  excerpt,
  tag,
  href = "#",
  accent = 1,
  cta = "Read the story",
  image
}: {
  title: string;
  excerpt?: string;
  tag?: string;
  href?: string;
  accent?: number;
  cta?: string;
  image?: string;
}) {
  return (
    <article className="story-card">
      {image ? (
        <div className="card-image" style={{ position: "relative", overflow: "hidden" }}>
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className={`card-image accent-${accent}`} />
      )}
      {tag ? <span className="tag">{tag}</span> : null}
      <h3>{title}</h3>
      {excerpt ? <p>{excerpt}</p> : null}
      <Link href={href}>{cta}</Link>
    </article>
  );
}
