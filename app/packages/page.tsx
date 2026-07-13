import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

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
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Paket Tour</h1>
      <p className="mt-2 text-muted-foreground">
        Pilih destinasi impianmu bersama Voyago Tours.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {packages.map((pkg) => {
          const nextSchedule = pkg.schedules.find(
            (schedule) => schedule.departureDate >= now
          );

          return (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.destination}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {pkg.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{pkg.durationDays} hari</Badge>
                  {nextSchedule ? (
                    <Badge variant="outline">
                      Berangkat {formatDate(nextSchedule.departureDate)}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Belum ada jadwal</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Lihat detail &amp; jadwal →
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
