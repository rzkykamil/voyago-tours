import Link from "next/link";
import type { Metadata } from "next";
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
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Paket Tour — Voyago Tours",
  description: "Jelajahi katalog paket tour Voyago Tours dan jadwal keberangkatannya.",
};

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { name: "asc" },
    include: {
      schedules: {
        orderBy: { departureDate: "asc" },
        include: { vehicle: true },
      },
    },
  });

  const now = new Date();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
      {/* HEADER HALAMAN */}
      <Reveal className="space-y-3 mb-12">
        <div className="coordinate-label">
          Voyago Tours — Katalog Destinasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground">
          Pilihan Paket Tour
        </h1>
        <p className="max-w-2xl text-md text-muted-foreground leading-relaxed">
          Pilih destinasi impianmu bersama Voyago Tours. Temukan petualangan menarik dengan akomodasi dan jadwal terbaik.
        </p>
      </Reveal>

      {/* GRID KARTU PAKET */}
      <RevealStagger className="grid gap-6 sm:grid-cols-2">
        {packages.map((pkg) => {
          const upcoming = pkg.schedules.filter(
            (schedule) => schedule.departureDate >= now
          );
          const nextAvailable = upcoming.find(
            (schedule) => schedule.vehicle.capacity - schedule.seatsBooked > 0
          );
          const nextSchedule = nextAvailable ?? upcoming[0];

          return (
            <RevealItem key={pkg.id}>
            <TicketCard>
              {pkg.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pkg.imageUrl}
                  alt={pkg.name}
                  className="h-40 w-full object-cover"
                />
              )}
              <TicketCardHeader>
                <TicketCardMeta>{pkg.destination}</TicketCardMeta>
                <TicketCardHeading>{pkg.name}</TicketCardHeading>
              </TicketCardHeader>

              <TicketCardBody>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {pkg.description}
                </p>
                <div className="space-y-2 pt-2">
                  <TicketCardRow
                    label={<Clock className="inline h-3 w-3 mr-1" />}
                    value={`${pkg.durationDays} Hari`}
                  />
                  {nextSchedule && (
                    <TicketCardRow
                      label={<Calendar className="inline h-3 w-3 mr-1" />}
                      value={formatDate(nextSchedule.departureDate)}
                    />
                  )}
                </div>
              </TicketCardBody>

              <TicketCardPerforation />

              <TicketCardStub className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {!nextSchedule
                    ? "Belum ada jadwal"
                    : nextAvailable
                      ? "Tersedia"
                      : "Penuh"}
                </div>
                <Link href={`/packages/${pkg.slug}`}>
                  <Button size="sm" variant="ghost" className="gap-1 h-6">
                    <ArrowRight className="h-3 w-3" />
                    Lihat
                  </Button>
                </Link>
              </TicketCardStub>
            </TicketCard>
            </RevealItem>
          );
        })}
      </RevealStagger>
    </div>
  );
}