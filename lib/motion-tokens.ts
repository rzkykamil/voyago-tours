/**
 * Single source of truth for homepage motion values (docs/homepage-art-direction.md).
 * Components must reference these tokens — never hardcode easing/duration/stagger values.
 * Mirrored as CSS custom properties in app/globals.css for hover transitions.
 */

export const easing = {
  /** Entrances: reveals, mask wipes, spine draw. */
  entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Exits: elements leaving the viewport. */
  exit: "cubic-bezier(0.7, 0, 0.84, 0)",
  /** Stamps / badges slamming into place. */
  snap: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Slow ambient movement: timelines, ledger hovers. */
  drift: "cubic-bezier(0.33, 1, 0.68, 1)",
} as const;

/** GSAP-compatible easing aliases (gsap accepts cubic-bezier via CustomEase-less string form). */
export const gsapEase = {
  entrance: "power3.out",
  exit: "power3.in",
  snap: "back.out(1.7)",
  drift: "sine.inOut",
} as const;

/** framer-motion requires the bezier as a 4-number tuple, not a CSS string. */
export const framerEase = {
  entrance: [0.16, 1, 0.3, 1] as [number, number, number, number],
  exit: [0.7, 0, 0.84, 0] as [number, number, number, number],
  snap: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  drift: [0.33, 1, 0.68, 1] as [number, number, number, number],
} as const;

export const duration = {
  instant: 0.12,
  fast: 0.24,
  base: 0.42,
  slow: 0.82,
  cinematic: 1.4,
} as const;

export const stagger = {
  row: 0.06,
  card: 0.09,
  note: 0.12,
  /** Hard cap — see motion-system rule: no more than 8 elements per stagger group. */
  maxItems: 8,
} as const;

/** Lenis smooth-scroll config, scoped to the homepage only. */
export const lenisConfig = {
  duration: 1.1,
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
} as const;
