import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoutePath } from "@/components/route-path";
import { Reveal } from "@/components/reveal";
import { ArrowRight, MapPin } from "lucide-react";

const HERO_ROUTE = [
  { x: 20, y: 90, label: "Origin" },
  { x: 140, y: 30 },
  { x: 260, y: 70 },
  { x: 380, y: 24, label: "Destination" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-background text-card-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto z-10">

        <Reveal>
          <div className="coordinate-label inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 !text-xs font-semibold !text-primary mb-6 border border-primary/20 shadow-sm normal-case tracking-normal">
            <MapPin className="h-3.5 w-3.5" />
            Jelajahi Destinasi Impianmu
          </div>
        </Reveal>

        {/* Heading */}
        <Reveal delay={0.1}>
          <h1 className="text-5xl sm:text-6xl font-heading italic font-semibold tracking-tight mb-6 text-card-foreground leading-tight sm:leading-none">
            Petualangan Hebat Menantimu Di Sini
          </h1>
        </Reveal>

        {/* Description */}
        <Reveal delay={0.2}>
          <p className="max-w-xl text-md sm:text-lg text-muted-foreground mb-8 leading-relaxed">
            Rencanakan perjalananmu berikutnya bersama <span className="font-medium text-card-foreground">Voyago Tours</span>.
            Nikmati paket lengkap, harga transparan, dan jadwal fleksibel yang dirancang khusus untukmu.
          </p>
        </Reveal>

        {/* Signature route line */}
        <div className="w-full max-w-md mb-8">
          <RoutePath waypoints={HERO_ROUTE} className="h-16" />
        </div>

        {/* Call to Action Buttons */}
        <Reveal delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Link href="/packages">
            <Button size="lg" className="gap-2">
              Lihat Paket Tour <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/contact">
            <Button size="lg" variant="outline">
              Konsultasi Gratis
            </Button>
          </Link>
        </Reveal>
      </main>
    </div>
  );
}
