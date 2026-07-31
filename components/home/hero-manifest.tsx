"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpinePoint } from "@/components/home/route-spine";
import { AnimatedNumber } from "@/components/home/animated-number";
import { formatCurrency, formatDate } from "@/lib/format";
import { framerEase, duration } from "@/lib/motion-tokens";

type HeroManifestProps = {
  destinationCount: number;
  upcomingDepartureCount: number;
  nearestDepartureISO: string | null;
  startingFromPrice: number;
};

/** "line-mask" reveal: overflow-hidden line wrapper + translateY/opacity inner span. */
function MaskLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden py-[0.05em]">
      <motion.span
        className="block"
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: duration.slow, delay, ease: framerEase.entrance }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function ManifestRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <span className="coordinate-label">{label}</span>
      <span className="font-mono text-lg font-semibold text-card-foreground sm:text-xl">
        {value}
      </span>
    </div>
  );
}

export function HeroManifest({
  destinationCount,
  upcomingDepartureCount,
  nearestDepartureISO,
  startingFromPrice,
}: HeroManifestProps) {
  const today = new Date();

  return (
    <section className="relative px-6 pb-20 pt-28 sm:pb-28 sm:pt-36">
      <SpinePoint index="01" />

      <div className="mx-auto grid w-full max-w-5xl gap-10 pl-12 sm:pl-16 lg:grid-cols-12 lg:gap-6">
        {/* Left: masthead + headline + CTA */}
        <div className="min-w-0 lg:col-span-8">
          <motion.div
            className="coordinate-label mb-6 inline-flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, ease: framerEase.entrance }}
          >
            <MapPin className="h-3.5 w-3.5" />
            08°25&apos;S 115°14&apos;E — Beroperasi sejak 2018
          </motion.div>

          <h1 className="font-heading break-words text-[clamp(2.5rem,6vw,5.5rem)] font-semibold italic leading-[1.15] tracking-[-0.03em] text-card-foreground">
            <MaskLine delay={0.05}>Petualangan yang</MaskLine>
            <MaskLine delay={0.18}>sudah diperhitungkan.</MaskLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, delay: 0.4, ease: framerEase.entrance }}
            className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Voyago Tours bukan brosur harga tebak-tebakan. Setiap angka di
            halaman ini — kursi, jadwal, dan biaya — diambil langsung dari
            data operasional kami, bisa kamu cek ulang di setiap paket.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, delay: 0.55, ease: framerEase.entrance }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <Link href="/packages">
              <Button size="lg" className="gap-2">
                Lihat Paket Tour <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="/contact"
              className="group relative text-sm font-medium text-card-foreground"
            >
              Konsultasi gratis
              <span
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-[var(--duration-base)] ease-[var(--ease-drift)] group-hover:scale-x-100"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>

        {/* Right: manifest card, optically overlapping the headline baseline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, delay: 0.3, ease: framerEase.entrance }}
          className="lg:col-span-4 lg:mt-28"
        >
          <div className="rounded-lg bg-card p-6 ring-1 ring-card-foreground/10 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.45)]">
            <div className="coordinate-label mb-1 border-b border-card-foreground/10 pb-3">
              Manifest Operasional — {today.getFullYear()}
            </div>
            <ManifestRow
              label="Destinasi aktif"
              value={<AnimatedNumber value={destinationCount} />}
            />
            <ManifestRow
              label="Keberangkatan terjadwal"
              value={<AnimatedNumber value={upcomingDepartureCount} />}
            />
            <ManifestRow
              label="Berangkat terdekat"
              value={nearestDepartureISO ? formatDate(new Date(nearestDepartureISO)) : "—"}
            />
            <ManifestRow
              label="Mulai dari"
              value={
                <AnimatedNumber value={startingFromPrice} format={(n) => formatCurrency(n)} />
              }
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
