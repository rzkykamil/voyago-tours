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
import { StampBadge } from "@/components/stamp-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

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
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Voyago Tours — Katalog Destinasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground">
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
            <TicketCard key={pkg.id}>
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
                  {nextSchedule ? "Tersedia" : "Belum ada jadwal"}
                </div>
                <Link href={`/packages/${pkg.slug}`}>
                  <Button size="sm" variant="ghost" className="gap-1 h-6">
                    <ArrowRight className="h-3 w-3" />
                    Lihat
                  </Button>
                </Link>
              </TicketCardStub>
            </TicketCard>
          );
        })}
      </div>
    </div>
  );
}