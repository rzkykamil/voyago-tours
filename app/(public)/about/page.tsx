import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import {
  ArrowLeft,
  Compass,
  MapPin,
  Users,
  Award,
  Heart,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami — Voyago Tours",
  description:
    "Mengenal Voyago Tours lebih dekat — perjalanan, visi, misi, dan nilai-nilai kami.",
};

const VALUES = [
  {
    icon: MapPin,
    title: "Petualangan Otentik",
    description:
      "Setiap rute dirancang untuk memberikan pengalaman mendalam, bukan sekadar foto. Kami menjelajah jauh dari keramaian turis.",
  },
  {
    icon: Users,
    title: "Kelompok Kecil",
    description:
      "Maksimum 12 orang per grup agar setiap pelancong mendapat perhatian penuh dari pemandu kami.",
  },
  {
    icon: Award,
    title: "Standar Tinggi",
    description:
      "Kami hanya bekerja sama dengan penginapan, restoran, dan operator lokal yang teruji dan tepercaya.",
  },
  {
    icon: Heart,
    title: "Dampak Lokal",
    description:
      "Setiap perjalanan mendukung ekonomi lokal — dari pemandu hingga pengrajin yang kami kunjungi.",
  },
];

const STATS = [
  { value: "12+", label: "Destinasi" },
  { value: "850+", label: "Pelancong Bahagia" },
  { value: "4.9", label: "Rating Rata-rata" },
  { value: "100%", label: "Pemandu Lokal" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 space-y-12">
      {/* NAVIGATION BACK */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke beranda
        </Link>
      </div>

      {/* HEADER */}
      <Reveal className="space-y-4">
        <div className="coordinate-label">
          Voyago Tours — Cerita Kami
        </div>
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground leading-tight">
          <Compass className="h-8 w-8 text-primary" />
          Tentang Kami
        </h1>
        <p className="text-card-foreground text-base sm:text-lg leading-relaxed pt-2 border-l-4 border-primary pl-4">
          Voyago Tours lahir dari kecintaan terhadap kepulauan Indonesia dan
          keyakinan bahwa perjalanan terbaik bukan diukur dari jarak, melainkan
          dari koneksi yang tercipta. Sejak 2018, kami merancang petualangan
          yang membawa Anda lebih dekat dengan budaya, alam, dan manusia di
          setiap sudut Nusantara.
        </p>
      </Reveal>

      {/* STATS */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-4 text-center"
            >
              <div className="font-heading text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="coordinate-label text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* VISI & MISI */}
      <Reveal delay={0.1} className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground tracking-tight">
            Visi & Misi
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-5 space-y-2">
            <div className="coordinate-label">Visi</div>
            <p className="text-sm text-card-foreground leading-relaxed">
              Menjadi penyelenggara perjalanan terpercaya yang menghubungkan
              pelancong dengan keindahan otentik Indonesia — satu rute, satu
              komunitas, pada satu waktu.
            </p>
          </div>

          <div className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-5 space-y-2">
            <div className="coordinate-label">Misi</div>
            <ul className="text-sm text-card-foreground leading-relaxed space-y-1.5">
              <li>
                — Merancang rute yang bermakna dan berkelanjutan di setiap
                destinasi.
              </li>
              <li>
                — Memberdayakan pemandu dan mitra lokal untuk tumbuh bersama.
              </li>
              <li>
                — Menjaga standar keselamatan dan kenyamanan tertinggi di setiap
                perjalanan.
              </li>
              <li>
                — Membangun komunitas pelancong yang menghargai budaya dan alam.
              </li>
            </ul>
          </div>
        </div>
      </Reveal>

      {/* NILAI-NILAI */}
      <Reveal delay={0.15} className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground tracking-tight">
            Nilai-Nilai Kami
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.05}>
              <div className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-5 space-y-3 h-full hover:ring-primary/30 transition-all">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <value.icon className="h-4 w-4" />
                </div>
                <h3 className="font-heading font-bold text-card-foreground">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal delay={0.2} className="text-center">
        <div className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-8 space-y-4">
          <h3 className="font-heading text-lg font-bold text-card-foreground">
            Siap Memulai Petualangan?
          </h3>
          <p className="text-sm text-muted-foreground">
            Jelajahi paket tour pilihan kami atau hubungi tim untuk konsultasi
            gratis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Lihat Paket Tour
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted/50 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}