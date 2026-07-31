"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { duration as durationTokens } from "@/lib/motion-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "number-roll" reveal pattern (docs/homepage-art-direction.md) — counts up once
 * when the element enters the viewport. Used in S01 (manifest stats) and S03
 * (running receipt total), never more than those two sections.
 */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toString(),
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const state = { val: 0 };
    el.textContent = format(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(state, {
            val: value,
            duration: durationTokens.cinematic,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = format(state.val);
            },
          }),
      });
    }, ref);

    return () => ctx.revert();
  }, [value, format]);

  return <span ref={ref} className={className} />;
}
