"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StampBadge } from "@/components/stamp-badge";
import {
  TicketCard,
  TicketCardHeader,
  TicketCardMeta,
  TicketCardHeading,
  TicketCardBody,
  TicketCardRow,
  TicketCardPerforation,
  TicketCardStub,
} from "@/components/ticket-card";
import { SpinePoint } from "@/components/home/route-spine";
import { usePrefersReducedMotion } from "@/components/home/use-prefers-reduced-motion";
import { formatDate } from "@/lib/format";
import type { DepartureRow } from "@/lib/home-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function BoardingPassCta({
  nearestBoardingPass,
}: {
  nearestBoardingPass: DepartureRow | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const card = cardRef.current;
    const stamp = stampRef.current;
    if (!card) return;

    if (reducedMotion) {
      gsap.set(card, { y: 0, opacity: 1 });
      if (stamp) gsap.set(stamp, { scale: 1, rotate: -3, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(card, { y: 40, opacity: 0 });
      if (stamp) gsap.set(stamp, { scale: 1.35, rotate: -8, opacity: 0 });

      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(card, { y: 0, opacity: 1, duration: 0.82, ease: "power3.out" });
          if (stamp) {
            gsap.to(stamp, {
              scale: 1,
              rotate: -3,
              opacity: 1,
              duration: 0.24,
              delay: 0.3,
              ease: "back.out(1.7)",
            });
          }
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <SpinePoint index="07" />
      <div className="mx-auto w-full max-w-5xl pl-12 sm:pl-16">
        <div ref={cardRef}>
          <TicketCard className="grid gap-0 sm:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-12">
              <div className="coordinate-label">Boarding Pass</div>
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-card-foreground sm:text-4xl">
                Rute sudah dipetakan.
                <br />
                Tinggal kamu yang naik.
              </h2>
              <p className="max-w-[42ch] text-sm text-muted-foreground sm:text-base">
                Pilih paket, cek kalkulator harga, dan kunci jadwalmu —
                kapasitas divalidasi langsung saat kamu submit.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/packages">
                  <Button size="lg" className="gap-2">
                    Lihat Paket Tour <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="stamp">
                    Konsultasi Gratis
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col border-t border-dashed border-card-foreground/15 sm:border-l sm:border-t-0">
              <TicketCardHeader>
                <TicketCardMeta>Keberangkatan Terdekat</TicketCardMeta>
                <TicketCardHeading>
                  {nearestBoardingPass?.packageName ?? "Segera hadir"}
                </TicketCardHeading>
              </TicketCardHeader>
              <TicketCardBody className="flex-1">
                <TicketCardRow
                  label="Destinasi"
                  value={nearestBoardingPass?.destination ?? "—"}
                />
                <TicketCardRow
                  label="Tanggal"
                  value={
                    nearestBoardingPass
                      ? formatDate(new Date(nearestBoardingPass.departureISO))
                      : "—"
                  }
                />
                <TicketCardRow
                  label="Kendaraan"
                  value={nearestBoardingPass?.vehicleName ?? "—"}
                />
                <TicketCardRow
                  label="Sisa Kursi"
                  value={nearestBoardingPass ? `${nearestBoardingPass.seatsLeft}` : "—"}
                />
              </TicketCardBody>
              <TicketCardPerforation />
              <TicketCardStub className="flex items-center justify-between">
                <span className="coordinate-label">Status</span>
                <div ref={stampRef}>
                  <StampBadge
                    variant={
                      nearestBoardingPass && nearestBoardingPass.seatsLeft <= 0
                        ? "cancelled"
                        : "confirmed"
                    }
                    size="sm"
                  >
                    {nearestBoardingPass && nearestBoardingPass.seatsLeft <= 0
                      ? "Penuh"
                      : "Siap"}
                  </StampBadge>
                </div>
              </TicketCardStub>
            </div>
          </TicketCard>
        </div>
      </div>
    </section>
  );
}
