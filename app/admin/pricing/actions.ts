"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parsePrice(formData: FormData) {
  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Harga tidak valid.");
  }
  return Math.round(price);
}

export async function updateHotelPrice(hotelOptionId: number, formData: FormData) {
  const pricePerPersonPerNight = parsePrice(formData);
  await prisma.hotelOption.update({
    where: { id: hotelOptionId },
    data: { pricePerPersonPerNight },
  });
  revalidatePath("/", "layout");
}

export async function updateVehiclePrice(vehicleId: number, formData: FormData) {
  const pricePerTrip = parsePrice(formData);
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { pricePerTrip },
  });
  revalidatePath("/", "layout");
}

export async function updateActivityPrice(activityId: number, formData: FormData) {
  const pricePerPerson = parsePrice(formData);
  await prisma.activity.update({
    where: { id: activityId },
    data: { pricePerPerson },
  });
  revalidatePath("/", "layout");
}
