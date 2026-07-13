import type { Metadata } from "next";
import Link from "next/link";
import { createPackage } from "../actions";
import { PackageForm } from "../package-form";
import { ArrowLeft, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Tambah Paket — Voyago Admin",
};

export default function NewPackagePage() {
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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Plus className="h-6 w-6 text-primary dark:text-primary" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-card-foreground">
            Tambah Paket Baru
          </h1>
        </div>
        <p className="text-muted-foreground">
          Buat paket tour baru untuk katalog Voyago Tours
        </p>
      </div>

      {/* FORM */}
      <PackageForm action={createPackage} submitLabel="Buat Paket" />
    </div>
  );
}
