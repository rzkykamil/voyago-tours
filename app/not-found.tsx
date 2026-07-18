"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Home, MapPinOff, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { RoutePath } from "@/components/route-path";
import { StampBadge } from "@/components/stamp-badge";

// Rute yang mengarah ke "daerah tak dikenal".
const LOST_ROUTE = [
  { x: 20, y: 60, label: "Kamu di sini" },
  { x: 130, y: 40 },
  { x: 240, y: 78 },
  { x: 360, y: 30, label: "???" },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 text-center selection:bg-primary selection:text-primary-foreground">
      {/* Latar belakang dekoratif: angka raksasa tembus pandang */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-heading text-[34vw] font-semibold italic leading-none text-foreground/[0.035] select-none"
      >
        404
      </span>

      {/* Pita status */}
      <Reveal>
        <div className="coordinate-label mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 normal-case tracking-wider text-primary">
          <MapPinOff className="h-3.5 w-3.5" />
          HTTP 404 · NOT FOUND
        </div>
      </Reveal>

      {/* Stempel "TIDAK DITEMUKAN" */}
      <Reveal delay={0.05}>
        <div className="mb-8 flex justify-center">
          <StampBadge variant="pending" className="size-24 -rotate-6 text-[0.55rem] sm:size-28">
            <span className="flex flex-col items-center leading-tight">
              Tidak
              <span className="mt-0.5 h-px w-10 bg-secondary/40" />
              <span className="mt-1 text-[0.5rem] opacity-70">Ditemukan</span>
            </span>
          </StampBadge>
        </div>
      </Reveal>

      {/* Judul utama */}
      <Reveal delay={0.1}>
        <h1 className="font-heading text-4xl font-semibold italic tracking-tight text-card-foreground sm:text-5xl">
          Destinasi Tidak Ditemukan
        </h1>
      </Reveal>

      {/* Deskripsi */}
      <Reveal delay={0.15}>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Halaman yang kamu cari tidak ada di peta perjalanan kami. Mungkin
          tautannya salah, atau halaman ini telah dipindahkan. Mari kembali ke
          jalur yang benar.
        </p>
      </Reveal>

      {/* Rute ke daerah tak dikenal */}
      <Reveal delay={0.2} className="mt-10 w-full max-w-md">
        <RoutePath waypoints={LOST_ROUTE} className="h-20" viewBox="0 0 400 120" />
        <div className="coordinate-label mt-2 flex items-center justify-between normal-case tracking-wider">
          <span>{"N 00°00'"}</span>
          <span className="flex items-center gap-1 text-secondary">
            <Compass className="h-3 w-3" />
            Daerah Tak Dikenal
          </span>
          <span>{"E ??°??'"}</span>
        </div>
      </Reveal>

      {/* Tombol aksi */}
      <Reveal
        delay={0.25}
        className="mt-12 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
      >
        <Button size="lg" variant="outline" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            Ke Beranda
          </Button>
        </Link>
      </Reveal>

      {/* Saran navigasi */}
      <Reveal delay={0.3}>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <span className="coordinate-label normal-case tracking-wider">Atau jelajahi:</span>
          <Link href="/packages" className="text-primary underline-offset-4 hover:underline">
            Paket Tour
          </Link>
          <Link href="/about" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Tentang Kami
          </Link>
          <Link href="/contact" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Kontak
          </Link>
        </div>
      </Reveal>
    </div>
  );
}