"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/home/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Persistent layer: the big-idea spine. Renders inside `#home-route`, a relative
 * wrapper that contains all 7 sections in normal flow. The fill overlay scrubs
 * from 0 to full height against that wrapper's own scroll range, so section
 * `SpinePoint`s (placed absolutely at each section's own top-0) line up "for free"
 * without any offsetTop measurement.
 */
export function RouteSpine() {
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrapper = document.getElementById("home-route");
    const fill = fillRef.current;
    if (!wrapper || !fill) return;

    // Reduced motion: skip the scrub entirely and show the route as already
    // travelled (static end-state) instead of animating it.
    if (reducedMotion) {
      gsap.set(fill, { scaleY: 1, transformOrigin: "top center" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => gsap.set(fill, { scaleY: self.progress }),
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-6 z-0 hidden w-4 sm:left-10 md:block"
      aria-hidden="true"
    >
      <div className={cn("spine-rail spine-rail--track h-full opacity-30")} />
      <div ref={fillRef} className={cn("spine-rail spine-rail--fill absolute inset-0")} />
    </div>
  );
}

/**
 * Numbered waypoint dropped inside a section's own `relative` wrapper at
 * `top-0`. Its X aligns with RouteSpine because both sit at the same left
 * offset (left-6 / sm:left-10) relative to sibling containing blocks of equal
 * width. Lights up (route-draw pattern, persistent layer) once its section
 * reaches the middle of the viewport.
 */
export function SpinePoint({ index }: { index: string }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = dotRef.current;
    if (!el) return;

    const activate = () =>
      gsap.set(el, {
        scale: 1,
        backgroundColor: "var(--color-brass)",
        color: "var(--primary-foreground)",
      });

    if (reducedMotion) {
      // No scale-bounce under reduced motion — waypoints are simply present.
      activate();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { scale: 0.6, backgroundColor: "transparent", color: "var(--primary)" });
      ScrollTrigger.create({
        trigger: el,
        start: "top 65%",
        onEnter: () =>
          gsap.to(el, {
            scale: 1,
            backgroundColor: "var(--color-brass)",
            color: "var(--primary-foreground)",
            duration: 0.24,
            ease: "back.out(1.7)",
          }),
      });
    }, dotRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      className="absolute left-6 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:left-10 md:flex"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="flex size-8 items-center justify-center rounded-full border border-primary/60 bg-background font-mono text-[0.65rem] font-semibold text-primary"
      >
        {index}
      </div>
    </div>
  );
}
