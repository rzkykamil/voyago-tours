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
import { ArrowLeft, MapPin, Calendar, Car, User, Mail, Phone, Calculator } from "lucide-react";

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
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 space-y-8">
      {/* NAVIGATION BACK */}
      <div>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke katalog
        </Link>
      </div>

      {/* HEADER INFO */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Transaksi #{booking.id}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Dibuat pada {formatDate(booking.createdAt)}
            </p>
          </div>
          <Badge variant={statusVariant[booking.status]} className="w-fit text-sm py-2 px-4">
            {statusLabel[booking.status]}
          </Badge>
        </div>
      </div>

      {/* PAKET INFO */}
      <Card className="overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-slate-200/80 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">{pkg.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2.5 text-sm">
            <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              {formatDate(schedule.departureDate)} • {vehicle.name}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">{pkg.destination}</span>
          </div>
        </CardContent>
      </Card>

      {/* DATA PEMESAN */}
      <Card className="overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-slate-200/80 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center gap-2">
          <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Data Pemesan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Nama</span>
              <span className="text-slate-900 dark:text-slate-50 font-semibold">{booking.customerName}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                <Mail className="h-3.5 w-3.5" />
                Email
              </span>
              <span className="text-slate-900 dark:text-slate-50 font-semibold text-right break-all">{booking.customerEmail}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                <Phone className="h-3.5 w-3.5" />
                Telepon
              </span>
              <span className="text-slate-900 dark:text-slate-50 font-semibold">{booking.customerPhone}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Jumlah peserta</span>
              <span className="text-slate-900 dark:text-slate-50 font-semibold">{booking.participantCount} orang</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Opsi hotel</span>
              <span className="text-slate-900 dark:text-slate-50 font-semibold">{hotelOption.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RINCIAN HARGA */}
      <Card className="overflow-hidden bg-gradient-to-br from-indigo-50/40 to-sky-50/40 dark:from-indigo-950/20 dark:to-slate-900/40 border-indigo-100/50 dark:border-indigo-900/30">
        <CardHeader className="border-b border-indigo-100/50 dark:border-indigo-900/30 flex flex-row items-center gap-2">
          <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Rincian Harga</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2">
              <dt className="text-slate-600 dark:text-slate-400">
                Hotel ({nights} malam × {booking.participantCount} orang)
              </dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(breakdown.hotelTotal)}</dd>
            </div>
            <div className="flex justify-between items-center pb-2">
              <dt className="text-slate-600 dark:text-slate-400">
                Aktivitas ({booking.participantCount} orang)
              </dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(breakdown.activitiesTotal)}</dd>
            </div>
            <div className="flex justify-between items-center pb-2">
              <dt className="text-slate-600 dark:text-slate-400">Kendaraan (per trip)</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(breakdown.vehicleTotal)}</dd>
            </div>
            <div className="flex justify-between items-center border-t border-indigo-200/50 dark:border-indigo-900/50 pt-3 font-bold">
              <dt className="text-slate-800 dark:text-slate-100">Total Dibayar</dt>
              <dd className="text-lg text-indigo-600 dark:text-indigo-400">{formatCurrency(booking.totalPrice)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
