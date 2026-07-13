import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { calculatePrice, nightsFromDuration } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

type TransactionPageProps = {
  params: Promise<{ bookingId: string }>;
};

async function getBooking(bookingId: number) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      hotelOption: true,
      schedule: {
        include: {
          vehicle: true,
          package: { include: { activities: true } },
        },
      },
    },
  });
}

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Terkonfirmasi",
  CANCELLED: "Dibatalkan",
};

const statusVariant: Record<string, "outline" | "secondary" | "destructive"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  CANCELLED: "destructive",
};

export const metadata: Metadata = {
  title: "Detail Transaksi — Voyago Tours",
};

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { bookingId } = await params;
  const booking = await getBooking(Number(bookingId));

  if (!booking) {
    notFound();
  }

  const { schedule, hotelOption } = booking;
  const { package: pkg, vehicle } = schedule;
  const nights = nightsFromDuration(pkg.durationDays);
  const breakdown = calculatePrice({
    participantCount: booking.participantCount,
    nights,
    hotelPricePerPersonPerNight: hotelOption.pricePerPersonPerNight,
    activityPrices: pkg.activities.map((activity) => activity.pricePerPerson),
    vehiclePricePerTrip: vehicle.pricePerTrip,
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link href="/packages" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke katalog
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          Transaksi #{booking.id}
        </h1>
        <Badge variant={statusVariant[booking.status]}>
          {statusLabel[booking.status]}
        </Badge>
      </div>
      <p className="mt-1 text-muted-foreground">
        Dibuat pada {formatDate(booking.createdAt)}
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{pkg.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            {formatDate(schedule.departureDate)} · {vehicle.name}
          </p>
          <p className="text-muted-foreground">{pkg.destination}</p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Data Pemesan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nama</span>
            <span>{booking.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{booking.customerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">No. telepon</span>
            <span>{booking.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jumlah peserta</span>
            <span>{booking.participantCount} orang</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Opsi hotel</span>
            <span>{hotelOption.name}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Rincian Harga</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                Hotel ({nights} malam × {booking.participantCount} orang)
              </dt>
              <dd>{formatCurrency(breakdown.hotelTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                Aktivitas ({booking.participantCount} orang)
              </dt>
              <dd>{formatCurrency(breakdown.activitiesTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Kendaraan (per trip)</dt>
              <dd>{formatCurrency(breakdown.vehicleTotal)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <dt>Total Dibayar</dt>
              <dd>{formatCurrency(booking.totalPrice)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
