"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { StampBadge } from "@/components/stamp-badge";
import { SpinePoint } from "@/components/home/route-spine";
import { formatDate } from "@/lib/format";
import type { DestinationRow } from "@/lib/home-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATUS_LABEL: Record<DestinationRow["status"], string> = {
  available: "Tersedia",
  full: "Penuh",
  unscheduled: "Belum ada jadwal",
};

const STATUS_VARIANT: Record<DestinationRow["status"], "available" | "cancelled" | "pending"> = {
  available: "available",
  full: "cancelled",
  unscheduled: "pending",
};

/** "ledger-wipe" reveal: clip-path inset left→right, staggered per row. */
function LedgerRow({ pkg, index }: { pkg: DestinationRow; index: number }) {
  const rowRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(el, {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.42,
            delay: (index % 8) * 0.06,
            ease: "power3.out",
          }),
      });
    }, rowRef);
    return () => ctx.revert();
  }, [index]);

  return (
    <Link
      ref={rowRef}
      href={`/packages/${pkg.slug}`}
      className="group grid grid-cols-[2.5rem_1fr] items-center gap-4 border-b border-border py-5 transition-transform duration-[var(--duration-base)] ease-[var(--ease-drift)] hover:translate-x-2 sm:grid-cols-[2.5rem_2fr_1fr_auto_auto]"
    >
      <span className="font-mono text-sm text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span>
        <span className="block font-heading text-xl font-bold tracking-tight text-card-foreground">
          {pkg.name}
        </span>
        <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-secondary sm:hidden">
          {pkg.destination}
        </span>
      </span>

      <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-secondary sm:block">
        {pkg.destination}
      </span>

      <span className="hidden font-mono text-xs text-muted-foreground sm:block">
        {pkg.durationDays} hari
        {pkg.nextDepartureISO && <> · {formatDate(new Date(pkg.nextDepartureISO))}</>}
      </span>

      <span className="col-span-2 mt-2 flex items-center justify-between gap-3 sm:col-span-1 sm:mt-0 sm:justify-end">
        <StampBadge variant={STATUS_VARIANT[pkg.status]} size="xs" className="text-[0.6rem]">
          {STATUS_LABEL[pkg.status].slice(0, 3)}
        </StampBadge>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </span>
    </Link>
  );
}

export function DestinationIndex({ destinations }: { destinations: DestinationRow[] }) {
  return (
    <section className="relative px-6 py-20 sm:py-28">
      <SpinePoint index="02" />
      <div className="mx-auto w-full max-w-5xl pl-12 sm:pl-16">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="coordinate-label mb-2">Indeks Destinasi</div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
              Setiap rute, tercatat.
            </h2>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            {String(destinations.length).padStart(2, "0")} entri
          </span>
        </div>

        <div>
          {destinations.map((pkg, i) => (
            <LedgerRow key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
