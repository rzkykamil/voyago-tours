import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { DeletePackageButton } from "./delete-package-button";

export const metadata: Metadata = {
  title: "Kelola Paket — Voyago Admin",
};

async function getPackages() {
  return prisma.package.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { schedules: true, activities: true } } },
  });
}

export default async function AdminPackagesPage() {
  const packages = await getPackages();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Kelola Paket</h1>
        <Button render={<Link href="/admin/packages/new" />}>Tambah Paket</Button>
      </div>

      <div className="mt-6 rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Destinasi</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Aktivitas</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.name}</TableCell>
                <TableCell>{pkg.destination}</TableCell>
                <TableCell>{pkg.durationDays} hari</TableCell>
                <TableCell>{pkg._count.activities}</TableCell>
                <TableCell>{pkg._count.schedules}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/packages/${pkg.id}/edit`} />}
                  >
                    Edit
                  </Button>
                  <DeletePackageButton packageId={pkg.id} />
                </TableCell>
              </TableRow>
            ))}
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada paket.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
