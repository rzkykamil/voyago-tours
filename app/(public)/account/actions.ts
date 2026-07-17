"use server";

import { prisma } from "@/lib/prisma";
import { formatEmail, validateEmail } from "@/lib/format";

export type BookingItem = {
  id: number;
  totalPrice: number;
  participantCount: number;
  status: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  schedule: {
    departureDate: Date;
    vehicle: { name: string };
    package: { name: string; destination: string; durationDays: number };
  };
  hotelOption: { name: string };
};

export type LookupState = {
  error?: string;
  bookings?: BookingItem[];
  email?: string;
};

export async function lookupBookings(
  _prevState: LookupState,
  formData: FormData
): Promise<LookupState> {
  const rawEmail = String(formData.get("email") ?? "").trim();
  const email = formatEmail(rawEmail);

  if (!email) {
    return { error: "Masukkan alamat email Anda." };
  }
  if (!validateEmail(email)) {
    return { error: "Format email tidak valid." };
  }

  const bookings = await prisma.booking.findMany({
    where: { customerEmail: email },
    orderBy: { createdAt: "desc" },
    include: {
      schedule: {
        include: {
          vehicle: true,
          package: true,
        },
      },
      hotelOption: true,
    },
  });

  return { bookings, email };
}