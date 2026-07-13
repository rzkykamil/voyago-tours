import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePackage } from "../../actions";
import { PackageForm } from "../../package-form";

export const metadata: Metadata = {
  title: "Edit Paket — Voyago Admin",
};

type EditPackagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id: Number(id) } });

  if (!pkg) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/packages" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke daftar paket
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Edit Paket</h1>
      <PackageForm
        action={updatePackage.bind(null, pkg.id)}
        defaultValues={{
          name: pkg.name,
          slug: pkg.slug,
          destination: pkg.destination,
          description: pkg.description,
          durationDays: pkg.durationDays,
          imageUrl: pkg.imageUrl,
        }}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
