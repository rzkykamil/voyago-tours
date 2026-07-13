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

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Booking Terbaru</h2>
        <div className="mt-4 rounded-xl ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pemesan</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Link
                      href={`/transactions/${booking.id}`}
                      className="hover:underline"
                    >
                      #{booking.id}
                    </Link>
                  </TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.schedule.package.name}</TableCell>
                  <TableCell>{formatDate(booking.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[booking.status]}>
                      {statusLabel[booking.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Belum ada booking.
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
