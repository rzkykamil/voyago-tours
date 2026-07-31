"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisConfig } from "@/lib/motion-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Homepage-only smooth scroll. Deliberately NOT mounted in the public layout —
 * booking forms and admin screens keep native scroll. Lenis is skipped entirely
 * on touch devices and under prefers-reduced-motion (see docs/homepage-art-direction.md).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReduced || isTouch) {
      return;
    }

    const lenis = new Lenis(lenisConfig);
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Display type at ~7rem shifts layout on font swap — refresh triggers once
    // webfonts have actually settled, otherwise beats land a few px off.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return <>{children}</>;
}
