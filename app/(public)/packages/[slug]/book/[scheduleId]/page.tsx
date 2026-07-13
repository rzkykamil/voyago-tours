import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, MapPin, Calendar, Car } from "lucide-react";
import { BookingForm } from "./booking-form";

type BookingPageProps = {
  params: Promise<{ slug: string; scheduleId: string }>;
};

async function getScheduleData(slug: string, scheduleId: number) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      vehicle: true,
      package: { include: { activities: true } },
    },
  });

  if (!schedule || schedule.package.slug !== slug) {
    return null;
  }

  const hotelOptions = await prisma.hotelOption.findMany({ orderBy: { pricePerPersonPerNight: "asc" } });

  return { schedule, hotelOptions };
}

export const metadata: Metadata = {
  title: "Booking — Voyago Tours",
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug, scheduleId } = await params;
  const data = await getScheduleData(slug, Number(scheduleId));

  if (!data) {
    notFound();
  }

  const { schedule, hotelOptions } = data;
  const seatsRemaining = schedule.vehicle.capacity - schedule.seatsBooked;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 space-y-8">
      {/* NAVIGATION BACK */}
      <div>
        <Link
          href={`/packages/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke detail paket
        </Link>
      </div>

      {/* HEADER INFO */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2.5 items-center">
          <Badge variant="secondary" className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 px-2.5 py-1 text-xs font-semibold rounded-md">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(schedule.departureDate)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 text-xs font-medium rounded-md">
            <Car className="h-3.5 w-3.5 text-slate-500" />
            {schedule.vehicle.name}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          {schedule.package.name}
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed flex items-center gap-2">
          <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
          {schedule.package.destination}
        </p>
      </div>

      {/* BOOKING SECTION */}
      {seatsRemaining <= 0 ? (
        <div className="flex items-start gap-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4">
          <div className="flex-1">
            <Badge variant="destructive" className="mb-2">Kuota Penuh</Badge>
            <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
              Kuota jadwal keberangkatan ini sudah penuh. Silakan pilih jadwal lain dari detail paket.
            </p>
          </div>
        </div>
      ) : (
        <BookingForm
          scheduleId={schedule.id}
          durationDays={schedule.package.durationDays}
          vehiclePricePerTrip={schedule.vehicle.pricePerTrip}
          activityPrices={schedule.package.activities.map((activity) => activity.pricePerPerson)}
          hotelOptions={hotelOptions}
          seatsRemaining={seatsRemaining}
        />
      )}
    </div>
  );
}
