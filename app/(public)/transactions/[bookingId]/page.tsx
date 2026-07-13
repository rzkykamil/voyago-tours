import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  TicketCard,
  TicketCardHeader,
  TicketCardHeading,
  TicketCardMeta,
  TicketCardBody,
  TicketCardRow,
  TicketCardPerforation,
  TicketCardStub,
} from "@/components/ticket-card";
import { StampBadge } from "@/components/stamp-badge";
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

  const stampVariant: "available" | "confirmed" | "pending" | "cancelled" =
    booking.status === "CONFIRMED" ? "confirmed" :
    booking.status === "CANCELLED" ? "cancelled" :
    "pending";

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 space-y-8">
      {/* NAVIGATION BACK */}
      <div>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke katalog
        </Link>
      </div>

      {/* TICKET / PERMIT */}
      <TicketCard className="relative">
        <div className="absolute top-6 right-6 z-10">
          <StampBadge variant={stampVariant} size="default">
            {stampVariant === "confirmed" ? "✓\nOKE" :
             stampVariant === "cancelled" ? "✗\nBATAL" :
             "⏱\nNGG"}
          </StampBadge>
        </div>

        <TicketCardHeader>
          <TicketCardMeta>PERMIT / TIKET KEBERANGKATAN</TicketCardMeta>
          <TicketCardHeading>{pkg.name}</TicketCardHeading>
        </TicketCardHeader>

        <TicketCardBody className="pr-20">
          <TicketCardRow
            label="Tujuan"
            value={pkg.destination}
          />
          <TicketCardRow
            label="Keberangkatan"
            value={formatDate(schedule.departureDate)}
          />
          <TicketCardRow
            label="Armada"
            value={vehicle.name}
          />
          <TicketCardRow
            label="Peserta"
            value={`${booking.participantCount} orang`}
          />
          <TicketCardRow
            label="Hotel"
            value={hotelOption.name}
          />
        </TicketCardBody>

        <TicketCardPerforation />

        <TicketCardStub>
          <div className="space-y-3 w-full">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
              Pemesan
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs">{booking.customerName}</div>
              <div className="font-mono text-xs text-muted-foreground">{booking.customerEmail}</div>
              <div className="font-mono text-xs text-muted-foreground">{booking.customerPhone}</div>
            </div>
          </div>
        </TicketCardStub>
      </TicketCard>

      {/* RINCIAN HARGA / MANIFEST */}
      <div className="rounded-none bg-card border border-border p-6">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-card-foreground mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          Rincian Harga
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between items-center pb-2">
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Hotel ({nights} × {booking.participantCount})
            </dt>
            <dd className="font-mono font-semibold text-card-foreground">{formatCurrency(breakdown.hotelTotal)}</dd>
          </div>
          <div className="flex justify-between items-center pb-2">
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Aktivitas ({booking.participantCount})
            </dt>
            <dd className="font-mono font-semibold text-card-foreground">{formatCurrency(breakdown.activitiesTotal)}</dd>
          </div>
          <div className="flex justify-between items-center pb-2">
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Kendaraan</dt>
            <dd className="font-mono font-semibold text-card-foreground">{formatCurrency(breakdown.vehicleTotal)}</dd>
          </div>
          <div className="flex justify-between items-center border-t-2 border-dashed border-card-foreground/20 pt-3 font-bold">
            <dt className="font-mono uppercase tracking-widest text-card-foreground">Total</dt>
            <dd className="font-mono text-lg text-primary">{formatCurrency(booking.totalPrice)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
