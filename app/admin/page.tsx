import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Users, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard — Voyago Tours",
};

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Terkonfirmasi",
  CANCELLED: "Dibatalkan",
};

const statusVariant: Record<string, "outline" | "secondary" | "destructive"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  CANCELLED: "destructive",
};

async function getDashboardData() {
  const [bookings, totalBookings, revenueResult] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { schedule: { include: { package: true } } },
      take: 50,
    }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ]);

  return {
    bookings,
    totalBookings,
    totalRevenue: revenueResult._sum.totalPrice ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const { bookings, totalBookings, totalRevenue } = await getDashboardData();

  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground">
          Dashboard Admin
        </h1>
        <p className="text-muted-foreground">
          Pantau ringkasan booking dan pendapatan Voyago Tours
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Total Booking */}
        <Card className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total Booking
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-card-foreground">{totalBookings}</p>
            <div className="mt-3 flex gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 text-primary">
                <CheckCircle className="h-3 w-3" />
                {confirmedBookings} Terkonfirmasi
              </span>
              <span className="flex items-center gap-1 text-secondary">
                <Clock className="h-3 w-3" />
                {pendingBookings} Menunggu
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Pendapatan */}
        <Card className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total Pendapatan
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-primary">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Dari booking yang terkonfirmasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* BOOKING TERBARU */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-card-foreground tracking-tight">
            Booking Terbaru
          </h2>
        </div>

        <div className="rounded-none overflow-hidden border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground">ID</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Pemesan</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Paket</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tanggal</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-border hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-primary">
                    <Link
                      href={`/transactions/${booking.id}`}
                      className="hover:underline"
                    >
                      #{booking.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {booking.customerName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {booking.schedule.package.name}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                    {formatDate(booking.createdAt)}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-100">
                    {formatCurrency(booking.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[booking.status]} className="text-xs">
                      {statusLabel[booking.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <XCircle className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-muted-foreground font-medium">
                        Belum ada booking.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
