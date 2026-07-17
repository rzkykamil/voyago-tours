import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { AccountLookup } from "./account-lookup";
import { UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Akun Saya — Voyago Tours",
  description:
    "Lihat dan kelola pesanan paket tour Anda di Voyago Tours.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 space-y-12">
      {/* HEADER */}
      <Reveal className="space-y-4">
        <div className="coordinate-label">
          Voyago Tours — Dasbor Pengguna
        </div>
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground leading-tight">
          <UserRound className="h-8 w-8 text-primary" />
          Akun Saya
        </h1>
        <p className="text-card-foreground text-base sm:text-lg leading-relaxed pt-2 border-l-4 border-primary pl-4">
          Masukkan alamat email yang Anda gunakan saat memesan untuk melihat
          seluruh tiket dan status pesanan paket tour Anda.
        </p>
      </Reveal>

      {/* LOOKUP + RESULTS */}
      <Reveal delay={0.1}>
        <AccountLookup />
      </Reveal>
    </div>
  );
}