import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
// Import ikon untuk memperkuat visualisasi detail informasi
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Check, 
  Calendar, 
  Car, 
  Users, 
  TicketPercent 
} from "lucide-react";

type PackagePageProps = {
  params: Promise<{ slug: string }>;
};

async function getPackage(slug: string) {
  return prisma.package.findUnique({
    where: { slug },
    include: {
      activities: true,
      schedules: {
        orderBy: { departureDate: "asc" },
        include: { vehicle: true },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    return { title: "Paket tidak ditemukan — Voyago Tours" };
  }

  return {
    title: `${pkg.name} — Voyago Tours`,
    description: pkg.description,
  };
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 space-y-12">
      
      {/* 1. NAVIGATION BACK */}
      <div>
        <Link 
          href="/packages" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke katalog
        </Link>
      </div>

      {/* 2. HERO / HEADER INFO */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2.5 items-center">
          <Badge variant="secondary" className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 px-2.5 py-1 text-xs font-semibold rounded-md">
            <Clock className="h-3.5 w-3.5" />
            {pkg.durationDays} Hari Perjalanan
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 border-slate-200 text-slate-600 px-2.5 py-1 text-xs font-medium rounded-md">
            <MapPin className="h-3.5 w-3.5 text-indigo-500" />
            {pkg.destination}
          </Badge>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          {pkg.name}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed pt-2 border-l-2 border-indigo-500 pl-4 bg-gradient-to-r from-indigo-500/5 to-transparent py-2 rounded-r-lg">
          {pkg.description}
        </p>
      </div>

      {/* 3. ACTIVITIES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <TicketPercent className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Aktivitas Termasuk
          </h2>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm shadow-sm">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {pkg.activities.map((activity) => (
              <li
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{activity.name}</span>
                </div>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md text-xs border border-indigo-100/40 sm:self-center self-start ml-8 sm:ml-0">
                  {formatCurrency(activity.pricePerPerson)} <span className="text-slate-400 font-normal">/ orang</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. SCHEDULES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Pilihan Jadwal Keberangkatannya
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pkg.schedules.map((schedule) => {
            const seatsRemaining = schedule.vehicle.capacity - schedule.seatsBooked;
            const isFull = seatsRemaining <= 0;

            return (
              <Card 
                key={schedule.id}
                className={`group flex flex-col justify-between overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-slate-200/80 hover:shadow-md transition-all duration-300 ${
                  isFull ? 'opacity-75' : 'hover:border-indigo-300 dark:hover:border-indigo-500/50'
                }`}
              >
                <CardHeader className="space-y-1.5 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-md font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {formatDate(schedule.departureDate)}
                    </CardTitle>
                    <Badge variant={isFull ? "destructive" : "secondary"} className="text-[11px] px-2 py-0.5 rounded font-semibold">
                      {isFull ? "Penuh" : "Tersedia"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Car className="h-3.5 w-3.5 text-slate-400" />
                    Armada: {schedule.vehicle.name}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 p-2.5 border border-slate-100 dark:border-slate-800 text-xs">
                    <Users className={`h-4 w-4 shrink-0 ${isFull ? 'text-rose-500' : 'text-indigo-500'}`} />
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {isFull
                        ? "Maaf, seluruh kuota kursi sudah terpenuhi"
                        : <span>Sisa <strong className="text-slate-800 dark:text-slate-200 font-bold">{seatsRemaining} kursi</strong> lagi dari total {schedule.vehicle.capacity}</span>
                      }
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-slate-50 dark:border-slate-800/60 bg-slate-50/30 py-3 flex justify-end">
                  {isFull ? (
                    <Button size="sm" variant="ghost" disabled className="w-full sm:w-auto text-xs font-semibold">
                      Kuota Penuh
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                    >
                      <Link href={`/packages/${pkg.slug}/book/${schedule.id}`}>
                        Pesan Sekarang
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {pkg.schedules.length === 0 && (
          <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm text-muted-foreground font-medium">
              Belum ada jadwal keberangkatan untuk paket ini.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}