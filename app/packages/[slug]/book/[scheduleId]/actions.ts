"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculatePrice, nightsFromDuration } from "@/lib/pricing";

export type BookingFormState = {
  error?: string;
};

export async function createBooking(
  scheduleId: number,
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const hotelOptionId = Number(formData.get("hotelOptionId"));
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerEmail = String(formData.get("customerEmail") ?? "").trim();
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const participantCount = Number(formData.get("participantCount"));

  if (!hotelOptionId || Number.isNaN(hotelOptionId)) {
    return { error: "Pilih opsi hotel terlebih dahulu." };
  }
  if (!customerName || !customerEmail || !customerPhone) {
    return { error: "Lengkapi semua data pemesan." };
  }
  if (!Number.isInteger(participantCount) || participantCount < 1) {
    return { error: "Jumlah peserta minimal 1 orang." };
  }

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      vehicle: true,
      package: { include: { activities: true } },
    },
  });

  if (!schedule) {
    return { error: "Jadwal tidak ditemukan." };
  }

  const hotelOption = await prisma.hotelOption.findUnique({
    where: { id: hotelOptionId },
  });

  if (!hotelOption) {
    return { error: "Opsi hotel tidak ditemukan." };
  }

  // Atomically reserve seats with a guarded UPDATE so a schedule can never be
  // overbooked, even under concurrent submissions.
  const reserved = await prisma.$executeRaw`
    UPDATE Schedule
    SET seatsBooked = seatsBooked + ${participantCount}
    WHERE id = ${scheduleId}
      AND seatsBooked + ${participantCount} <= ${schedule.vehicle.capacity}
  `;

  if (reserved === 0) {
    const freshSchedule = await prisma.schedule.findUniqueOrThrow({
      where: { id: scheduleId },
    });
    const seatsRemaining = schedule.vehicle.capacity - freshSchedule.seatsBooked;
    return { error: `Kuota tidak mencukupi. Sisa kursi: ${seatsRemaining}.` };
  }

  const { grandTotal } = calculatePrice({
    participantCount,
    nights: nightsFromDuration(schedule.package.durationDays),
    hotelPricePerPersonPerNight: hotelOption.pricePerPersonPerNight,
    activityPrices: schedule.package.activities.map((activity) => activity.pricePerPerson),
    vehiclePricePerTrip: schedule.vehicle.pricePerTrip,
  });

  let bookingId: number;

  try {
    const booking = await prisma.booking.create({
      data: {
        scheduleId,
        hotelOptionId,
        customerName,
        customerEmail,
        customerPhone,
        participantCount,
        totalPrice: grandTotal,
      },
    });
    bookingId = booking.id;
  } catch (error) {
    // Release the seats we reserved above since the booking was not created.
    await prisma.$executeRaw`
      UPDATE Schedule SET seatsBooked = seatsBooked - ${participantCount} WHERE id = ${scheduleId}
    `;
    return {
      error: error instanceof Error ? error.message : "Gagal membuat booking.",
    };
  }

  redirect(`/transactions/${bookingId}`);
}
