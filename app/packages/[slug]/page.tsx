import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

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
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link href="/packages" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke katalog
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{pkg.name}</h1>
      <p className="mt-1 text-muted-foreground">{pkg.destination}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary">{pkg.durationDays} hari</Badge>
      </div>

      <p className="mt-6 leading-relaxed">{pkg.description}</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Aktivitas Termasuk</h2>
        <ul className="mt-4 divide-y rounded-xl ring-1 ring-foreground/10">
          {pkg.activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <span>{activity.name}</span>
              <span className="text-muted-foreground">
                {formatCurrency(activity.pricePerPerson)} / orang
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Jadwal Keberangkatan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {pkg.schedules.map((schedule) => {
            const seatsRemaining = schedule.vehicle.capacity - schedule.seatsBooked;
            const isFull = seatsRemaining <= 0;

            return (
              <Card key={schedule.id}>
                <CardHeader>
                  <CardTitle>{formatDate(schedule.departureDate)}</CardTitle>
                  <CardDescription>{schedule.vehicle.name}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {isFull
                      ? "Kuota penuh"
                      : `${seatsRemaining} kursi tersisa dari ${schedule.vehicle.capacity}`}
                  </span>
                  <Badge variant={isFull ? "destructive" : "outline"}>
                    {isFull ? "Penuh" : "Tersedia"}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
          {pkg.schedules.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada jadwal keberangkatan untuk paket ini.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
