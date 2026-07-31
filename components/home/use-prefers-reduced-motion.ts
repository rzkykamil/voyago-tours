"use client";

import { useEffect, useState } from "react";

/**
 * Shared gate for the homepage's `prefers-reduced-motion` rule (docs/homepage-art-direction.md):
 * parallax, scale-bounce, and pin/scrub are fully disabled; short opacity/position fades stay on.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
