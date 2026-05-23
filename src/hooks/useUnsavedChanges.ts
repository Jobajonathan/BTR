"use client";

import { useEffect } from "react";

/**
 * Fires a browser beforeunload warning when the user tries to leave the page
 * with unsaved changes. Pass `isDirty = true` to activate.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      // Modern browsers show their own generic message; the returnValue is kept
      // for legacy support.
      e.returnValue = "You have unsaved changes. Leave anyway?";
    }

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}
