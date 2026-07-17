import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePackage } from "../../actions";
import { PackageForm } from "../../package-form";
import { Reveal } from "@/components/reveal";
import { ArrowLeft, Edit } from "lucide-react";

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
    <div className="space-y-8">
      {/* NAVIGATION BACK */}
      <div>
        <Link
          href="/admin/packages"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke daftar paket
        </Link>
      </div>

      {/* HEADER */}
      <Reveal className="space-y-2">
        <div className="flex items-center gap-2">
          <Edit className="h-6 w-6 text-primary dark:text-primary" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground">
            Edit Paket
          </h1>
        </div>
        <p className="text-muted-foreground">
          Ubah informasi paket "{pkg.name}"
        </p>
      </Reveal>

      {/* FORM */}
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
