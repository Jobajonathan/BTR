"use client";

interface CharacterCountProps {
  value: string;
  max: number;
}

/** Shows "42 / 60" and turns red when over limit. */
export default function CharacterCount({ value, max }: CharacterCountProps) {
  const count = value?.length ?? 0;
  const over = count > max;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: over ? "#c0392b" : count > max * 0.85 ? "#e67e22" : "var(--muted)",
        marginLeft: "auto",
        flexShrink: 0
      }}
    >
      {count} / {max}
    </span>
  );
}
