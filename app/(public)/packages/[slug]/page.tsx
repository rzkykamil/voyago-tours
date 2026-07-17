import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Check,
  Calendar,
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
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke katalog
        </Link>
      </div>

      {/* 2. HERO / HEADER INFO */}
      <Reveal className="space-y-4">
        {pkg.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.imageUrl}
            alt={pkg.name}
            className="h-64 w-full rounded-lg object-cover ring-1 ring-card-foreground/10"
          />
        )}

        <div className="coordinate-label">
          {pkg.destination} — {pkg.durationDays} Hari
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground leading-tight">
          {pkg.name}
        </h1>

        <p className="text-card-foreground text-base sm:text-lg leading-relaxed pt-2 border-l-4 border-primary pl-4">
          {pkg.description}
        </p>
      </Reveal>

      {/* 3. ACTIVITIES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <TicketPercent className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground tracking-tight">
            Aktivitas Termasuk
          </h2>
        </div>

        <RevealStagger className="space-y-2 rounded-lg bg-card ring-1 ring-card-foreground/10">
          {pkg.activities.map((activity) => (
            <RevealItem
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3 text-sm border-b border-card-foreground/5 last:border-b-0 hover:bg-card-foreground/2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="font-medium text-card-foreground">{activity.name}</span>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {formatCurrency(activity.pricePerPerson)} <span className="text-muted-foreground font-normal">/ orang</span>
              </span>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {/* 4. SCHEDULES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground tracking-tight">
            Pilihan Jadwal Keberangkatannya
          </h2>
        </div>

        <RevealStagger className="grid gap-4 sm:grid-cols-2">
          {pkg.schedules.map((schedule) => {
            const seatsRemaining = schedule.vehicle.capacity - schedule.seatsBooked;
            const isFull = seatsRemaining <= 0;

            return (
              <RevealItem key={schedule.id}>
                <TicketCard className={isFull ? "opacity-60" : ""}>
                  <TicketCardHeader>
                    <TicketCardMeta>{schedule.vehicle.name}</TicketCardMeta>
                    <TicketCardHeading>{formatDate(schedule.departureDate)}</TicketCardHeading>
                  </TicketCardHeader>

                  <TicketCardBody>
                    <TicketCardRow
                      label="Kapasitas"
                      value={`${schedule.seatsBooked}/${schedule.vehicle.capacity}`}
                    />
                    <TicketCardRow
                      label="Sisa"
                      value={isFull ? "0" : `${seatsRemaining}`}
                    />
                  </TicketCardBody>

                  <TicketCardPerforation />

                  <TicketCardStub className="flex items-center justify-between">
                    <StampBadge
                      variant={isFull ? "cancelled" : "available"}
                      size="sm"
                    >
                      {isFull ? "PENUH" : "BUKA"}
                    </StampBadge>
                    {isFull ? (
                      <Button size="sm" variant="ghost" disabled>
                        Penuh
                      </Button>
                    ) : (
                      <Link href={`/packages/${pkg.slug}/book/${schedule.id}`}>
                        <Button
                          size="sm"
                          variant="stamp"
                          type="button"
                        >
                          Pesan
                        </Button>
                      </Link>
                    )}
                  </TicketCardStub>
                </TicketCard>
              </RevealItem>
            );
          })}
        </RevealStagger>

        {pkg.schedules.length === 0 && (
          <div className="text-center py-8 rounded-lg border border-dashed border-border bg-card">
            <p className="text-sm text-muted-foreground font-medium">
              Belum ada jadwal keberangkatan untuk paket ini.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}