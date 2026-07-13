import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
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
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link
        href={`/packages/${slug}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Kembali ke detail paket
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {schedule.package.name}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {formatDate(schedule.departureDate)} · {schedule.vehicle.name}
      </p>

      {seatsRemaining <= 0 ? (
        <div className="mt-6 flex items-center gap-2 rounded-xl ring-1 ring-foreground/10 p-4">
          <Badge variant="destructive">Penuh</Badge>
          <p className="text-sm text-muted-foreground">
            Kuota jadwal keberangkatan ini sudah penuh. Silakan pilih jadwal lain.
          </p>
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
