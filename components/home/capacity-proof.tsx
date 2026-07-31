"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StampBadge } from "@/components/stamp-badge";
import { SpinePoint } from "@/components/home/route-spine";
import { usePrefersReducedMotion } from "@/components/home/use-prefers-reduced-motion";
import { formatDate } from "@/lib/format";
import type { CapacitySnapshot } from "@/lib/home-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** "stamp-slam" reveal: scale 1.35→1, rotate -8deg→-3deg, fast + snap easing. */
function useStampSlam<T extends HTMLElement>(reducedMotion: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      // Scale-bounce is explicitly disabled under reduced motion — land at rest.
      gsap.set(el, { scale: 1, rotate: -3, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { scale: 1.35, rotate: -8, opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () =>
          gsap.to(el, {
            scale: 1,
            rotate: -3,
            opacity: 1,
            duration: 0.24,
            ease: "back.out(1.7)",
          }),
      });
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion]);
  return ref;
}

export function CapacityProof({ snapshot }: { snapshot: CapacitySnapshot | null }) {
  const seatContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const stampRef = useStampSlam<HTMLDivElement>(reducedMotion);

  useEffect(() => {
    const container = seatContainerRef.current;
    if (!container || !snapshot) return;

    const seats = container.querySelectorAll<HTMLElement>("[data-seat]");

    if (reducedMotion) {
      gsap.set(seats, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top 75%",
        once: true,
        onEnter: () =>
          gsap.to(seats, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: { each: 0.012, from: "start" },
            ease: "power2.out",
          }),
      });
    }, container);

    return () => ctx.revert();
  }, [snapshot, reducedMotion]);

  if (!snapshot) return null;

  const seats = Array.from({ length: snapshot.capacity }, (_, i) => i < snapshot.seatsBooked);

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <SpinePoint index="04" />
      <div className="mx-auto w-full max-w-5xl pl-12 sm:pl-16">
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
          <div className="md:col-span-5">
            <div className="coordinate-label mb-2">Kapasitas Nyata</div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
              Kursi ini dihitung server-side, bukan hiasan.
            </h2>
            <p className="mt-4 max-w-[42ch] text-sm text-muted-foreground sm:text-base">
              Kapasitas kendaraan divalidasi ulang saat kamu submit booking —
              bukan cuma dicek di layar. Di bawah ini denah kursi nyata untuk{" "}
              <span className="text-card-foreground">{snapshot.packageName}</span>,
              keberangkatan {formatDate(new Date(snapshot.departureISO))} dengan{" "}
              {snapshot.vehicleName}.
            </p>
            <div className="mt-6 flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" /> Terisi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-secondary" /> Tersedia
              </span>
            </div>
          </div>

          <div className="relative md:col-span-7">
            <div
              ref={seatContainerRef}
              className="grid grid-cols-8 gap-2.5 sm:grid-cols-10"
            >
              {seats.map((booked, i) => (
                <span
                  key={i}
                  data-seat
                  className={`aspect-square scale-50 rounded-full opacity-0 ${
                    booked ? "bg-primary" : "border border-secondary/60"
                  }`}
                />
              ))}
            </div>

            {snapshot.isFull && (
              <div
                ref={stampRef}
                className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2"
              >
                <StampBadge variant="cancelled" size="default" className="text-sm">
                  Penuh
                </StampBadge>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
