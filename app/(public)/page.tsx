import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-background text-card-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto z-10">

        {/* Badge Info */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-6 border border-primary/20 shadow-sm">
          <MapPin className="h-3.5 w-3.5" />
          Jelajahi Destinasi Impianmu
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-heading font-bold tracking-tight mb-6 text-card-foreground leading-tight sm:leading-none">
          Petualangan Hebat Menantimu Di Sini
        </h1>

        {/* Description */}
        <p className="max-w-xl text-md sm:text-lg text-muted-foreground mb-10 leading-relaxed">
          Rencanakan perjalananmu berikutnya bersama <span className="font-medium text-card-foreground">Voyago Tours</span>.
          Nikmati paket lengkap, harga transparan, dan jadwal fleksibel yang dirancang khusus untukmu.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
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
        </div>
      </main>
    </div>
  );
}
