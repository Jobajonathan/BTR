"use client";

import { useEffect } from "react";
import { trackView } from "@/app/actions/trackView";

export function ViewTracker({ type, id }: { type: "story" | "blog"; id: string }) {
  useEffect(() => {
    trackView(type, id).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
