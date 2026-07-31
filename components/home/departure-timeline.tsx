"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SpinePoint } from "@/components/home/route-spine";
import { formatDate } from "@/lib/format";
import type { DepartureRow } from "@/lib/home-data";

// Base class always keeps native overflow-x scrolling as the fallback for
// touch devices, reduced-motion, and the instant before JS decides to animate.

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function DepartureTimeline({ departures }: { departures: DepartureRow[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!pin || !scroller || !track || departures.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        // track always sizes to its own content (w-max), so compare it
        // against the bounded scroller viewport, not against itself.
        const getDistance = () => Math.max(0, track.scrollWidth - scroller.clientWidth);
        if (getDistance() === 0) return;

        // Only switch off native horizontal scroll once we're actually driving
        // the track via scroll-linked transform.
        scroller.style.overflowX = "hidden";

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            // Exactly the horizontal distance — no extra buffer, otherwise
            // scroll keeps consuming space after the track finishes moving
            // and the section reads as a dead, empty stretch before it releases.
            end: () => `+=${getDistance()}`,
            scrub: 0.4,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          scroller.style.overflowX = "";
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    );

    return () => mm.revert();
  }, [departures.length]);

  if (departures.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28">
      <SpinePoint index="05" />

      <div
        ref={pinRef}
        className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center overflow-hidden pl-12 sm:pl-16"
      >
        <div className="mb-10 px-6">
          <div className="coordinate-label mb-2">Jadwal Keberangkatan</div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
            Rute yang sudah berjalan.
          </h2>
        </div>

        <div ref={scrollerRef} className="overflow-x-auto">
          <div ref={trackRef} className="flex w-max gap-10 pr-6 pb-4 pl-2">
            {departures.map((d) => (
              <div
                key={d.scheduleId}
                className="relative w-64 shrink-0 border-l-2 border-dashed border-secondary/50 pl-5"
              >
                <span className="absolute -left-[7px] top-0 size-3 rounded-full bg-secondary" />
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {formatDate(new Date(d.departureISO))}
                </div>
                <div className="mt-2 font-heading text-lg font-bold text-card-foreground">
                  {d.packageName}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{d.destination}</div>
                <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span>{d.vehicleName}</span>
                  <span className={d.seatsLeft <= 0 ? "text-destructive" : "text-primary"}>
                    {d.seatsLeft <= 0 ? "Penuh" : `${d.seatsLeft} kursi`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
