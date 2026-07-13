import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
// Import ikon untuk memperkaya visual data
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Paket Tour — Voyago Tours",
  description: "Jelajahi katalog paket tour Voyago Tours dan jadwal keberangkatannya.",
};

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { name: "asc" },
    include: {
      schedules: { orderBy: { departureDate: "asc" } },
    },
  });

  const now = new Date();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
      {/* HEADER HALAMAN */}
      <div className="space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-200/40">
          <Sparkles className="h-3 w-3" /> Katalog Destinasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Pilihan Paket Tour
        </h1>
        <p className="max-w-2xl text-md text-muted-foreground leading-relaxed">
          Pilih destinasi impianmu bersama Voyago Tours. Temukan petualangan menarik dengan akomodasi dan jadwal terbaik.
        </p>
      </div>

      {/* GRID KARTU PAKET */}
      <div className="grid gap-6 sm:grid-cols-2">
        {packages.map((pkg) => {
          const nextSchedule = pkg.schedules.find(
            (schedule) => schedule.departureDate >= now
          );

          return (
            <Card 
              key={pkg.id} 
              className="group relative flex flex-col justify-between overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Dekorasi Aksen Warna Atas Kartu */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 opacity-70 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* CARD HEADER */}
                <CardHeader className="pt-6 pb-4">
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    {pkg.destination}
                  </CardDescription>
                </CardHeader>

                {/* CARD CONTENT */}
                <CardContent className="flex flex-col gap-5 pb-6">
                  <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </p>
                  
                  {/* Badges dengan Ikon Terstruktur */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary" className="flex items-center gap-1 py-1 px-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {pkg.durationDays} Hari
                    </Badge>
                    
                    {nextSchedule ? (
                      <Badge variant="outline" className="flex items-center gap-1 py-1 px-2.5 rounded-md border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        Berangkat: {formatDate(nextSchedule.departureDate)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 py-1 px-2.5 rounded-md text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-950 bg-amber-50/40">
                        <Calendar className="h-3.5 w-3.5" />
                        Belum ada jadwal
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </div>

              {/* CARD FOOTER */}
              <CardFooter className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 py-4 group-hover:bg-indigo-50/20 dark:group-hover:bg-indigo-950/10 transition-colors">
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                >
                  Lihat Detail &amp; Jadwal
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardFooter>

            </Card>
          );
        })}
      </div>
    </div>
  );
}