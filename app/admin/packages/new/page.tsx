import type { Metadata } from "next";
import Link from "next/link";
import { createPackage } from "../actions";
import { PackageForm } from "../package-form";

export const metadata: Metadata = {
  title: "Tambah Paket — Voyago Admin",
};

export default function NewPackagePage() {
  return (
    <div>
      <Link href="/admin/packages" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke daftar paket
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Tambah Paket</h1>
      <PackageForm action={createPackage} submitLabel="Buat Paket" />
    </div>
  );
}
