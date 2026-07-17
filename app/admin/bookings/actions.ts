"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateBookingStatus(bookingId: number, newStatus: "CONFIRMED" | "CANCELLED") {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { schedule: true },
  });

  if (!booking) {
    throw new Error("Booking tidak ditemukan.");
  }

  if (newStatus === "CONFIRMED" && booking.status === "PENDING") {
    const schedule = await prisma.schedule.findUnique({ where: { id: booking.scheduleId } });
    if (!schedule) throw new Error("Schedule tidak ditemukan.");

    const vehicle = await prisma.vehicle.findUnique({ where: { id: schedule.vehicleId } });
    if (!vehicle) throw new Error("Kendaraan tidak ditemukan.");

    if (schedule.seatsBooked + booking.participantCount > vehicle.capacity) {
      throw new Error("Kapasitas kendaraan tidak cukup.");
    }

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      }),
      prisma.schedule.update({
        where: { id: booking.scheduleId },
        data: { seatsBooked: { increment: booking.participantCount } },
      }),
    ]);
  } else if (newStatus === "CANCELLED" && booking.status === "CONFIRMED") {
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      }),
      prisma.schedule.update({
        where: { id: booking.scheduleId },
        data: { seatsBooked: { decrement: booking.participantCount } },
      }),
    ]);
  } else if (newStatus === "CANCELLED" && booking.status === "PENDING") {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  }

  revalidatePath("/admin");
}
