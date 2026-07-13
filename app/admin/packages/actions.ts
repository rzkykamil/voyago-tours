"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type PackageFormState = {
  error?: string;
};

function readPackageFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const durationDays = Number(formData.get("durationDays"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name || !slug || !destination || !description) {
    throw new Error("Lengkapi semua field wajib.");
  }
  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw new Error("Durasi (hari) minimal 1.");
  }

  return { name, slug, destination, description, durationDays, imageUrl: imageUrl || null };
}

export async function createPackage(
  _prevState: PackageFormState,
  formData: FormData
): Promise<PackageFormState> {
  let fields;
  try {
    fields = readPackageFields(formData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Data tidak valid." };
  }

  try {
    await prisma.package.create({ data: fields });
  } catch {
    return { error: "Gagal membuat paket. Pastikan slug belum digunakan." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/packages");
}

export async function updatePackage(
  packageId: number,
  _prevState: PackageFormState,
  formData: FormData
): Promise<PackageFormState> {
  let fields;
  try {
    fields = readPackageFields(formData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Data tidak valid." };
  }

  try {
    await prisma.package.update({ where: { id: packageId }, data: fields });
  } catch {
    return { error: "Gagal menyimpan paket. Pastikan slug belum digunakan." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/packages");
}

export type DeleteFormState = {
  error?: string;
};

export async function deletePackage(
  packageId: number,
  _prevState: DeleteFormState
): Promise<DeleteFormState> {
  const bookingCount = await prisma.booking.count({
    where: { schedule: { packageId } },
  });

  if (bookingCount > 0) {
    return { error: "Tidak bisa menghapus paket yang sudah memiliki booking." };
  }

  await prisma.$transaction([
    prisma.schedule.deleteMany({ where: { packageId } }),
    prisma.activity.deleteMany({ where: { packageId } }),
    prisma.package.delete({ where: { id: packageId } }),
  ]);

  revalidatePath("/", "layout");
  return {};
}
