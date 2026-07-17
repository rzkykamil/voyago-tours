import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
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
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke detail paket
        </Link>
      </div>

      {/* HEADER INFO */}
      <Reveal className="space-y-4">
        <div className="flex flex-wrap gap-2.5 items-center">
          <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20/40 text-primary dark:text-primary border border-primary-100 dark:border-primary-900/50 px-2.5 py-1 text-xs font-semibold rounded-md">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(schedule.departureDate)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 border-slate-200 dark:border-slate-800 text-muted-foreground px-2.5 py-1 text-xs font-medium rounded-md">
            <Car className="h-3.5 w-3.5 text-muted-foreground" />
            {schedule.vehicle.name}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground leading-tight">
          {schedule.package.name}
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          {schedule.package.destination}
        </p>
      </Reveal>

      {/* BOOKING SECTION */}
      {seatsRemaining <= 0 ? (
        <Reveal className="flex items-start gap-3 rounded-xl bg-destructive-50 dark:bg-destructive-950/20 border border-destructive-200 dark:border-destructive-900/40 p-4">
          <div className="flex-1">
            <Badge variant="destructive" className="mb-2">Kuota Penuh</Badge>
            <p className="text-sm text-destructive-700 dark:text-destructive-300 font-medium">
              Kuota jadwal keberangkatan ini sudah penuh. Silakan pilih jadwal lain dari detail paket.
            </p>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <BookingForm
            scheduleId={schedule.id}
            durationDays={schedule.package.durationDays}
            vehiclePricePerTrip={schedule.vehicle.pricePerTrip}
            activityPrices={schedule.package.activities.map((activity) => activity.pricePerPerson)}
            hotelOptions={hotelOptions}
            seatsRemaining={seatsRemaining}
          />
        </Reveal>
      )}
    </div>
  );
}
