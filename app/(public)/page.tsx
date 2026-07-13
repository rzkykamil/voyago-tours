import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-slate-50 text-slate-900 overflow-hidden selection:bg-indigo-500 selection:text-white">

      {/* Efek Lampu Latar Belakang (Aesthetic Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto z-10">

        {/* Badge Info */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-6 border border-indigo-200/50 shadow-sm">
          <MapPin className="h-3.5 w-3.5" />
          Jelajahi Destinasi Impianmu
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent leading-tight sm:leading-none">
          Petualangan Hebat <br className="hidden sm:inline" /> Menantimu Di Sini
        </h1>

        {/* Description */}
        <p className="max-w-xl text-md sm:text-lg text-slate-600 mb-10 leading-relaxed">
          Rencanakan perjalananmu berikutnya bersama <span className="font-medium text-slate-800">Voyago Tours</span>.
          Nikmati paket lengkap, harga transparan, dan jadwal fleksibel yang dirancang khusus untukmu.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Link href="/packages" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 px-8 py-6 text-md rounded-xl transition-all hover:scale-[1.02] font-medium">
            Lihat Paket Tour <ArrowRight className="h-4 w-4" />
          </Link>

          <Link href="/contact" className="inline-flex items-center justify-center px-8 py-6 text-md rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors">
            Konsultasi Gratis
          </Link>
        </div>
      </main>
    </div>
  );
}
