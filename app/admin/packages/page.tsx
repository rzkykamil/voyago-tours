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
import { Plus, Package, Clock, MapPin, Zap } from "lucide-react";

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
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Kelola Paket
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tambah, edit, atau hapus paket tour untuk katalog Voyago Tours
            </p>
          </div>
          <Button
            render={<Link href="/admin/packages/new" />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 w-fit"
          >
            <Plus className="h-4 w-4" />
            Tambah Paket
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Nama
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destinasi
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Durasi
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Aktivitas
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Jadwal</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow
                key={pkg.id}
                className="border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <TableCell className="font-semibold text-slate-800 dark:text-slate-100">
                  {pkg.name}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">
                  {pkg.destination}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                  {pkg.durationDays} hari
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                    {pkg._count.activities}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                    {pkg._count.schedules}
                  </span>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/packages/${pkg.id}/edit`} />}
                    className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    Edit
                  </Button>
                  <DeletePackageButton packageId={pkg.id} />
                </TableCell>
              </TableRow>
            ))}
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm text-muted-foreground font-medium">
                      Belum ada paket.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
