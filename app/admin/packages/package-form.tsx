"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PackageFormState } from "./actions";
import { Package, MapPin, Clock, Link as LinkIcon, FileText } from "lucide-react";

type PackageFormProps = {
  action: (prevState: PackageFormState, formData: FormData) => Promise<PackageFormState>;
  defaultValues?: {
    name: string;
    slug: string;
    destination: string;
    description: string;
    durationDays: number;
    imageUrl: string | null;
  };
  submitLabel: string;
};

const initialState: PackageFormState = {};

export function PackageForm({ action, defaultValues, submitLabel }: PackageFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-6 max-w-2xl">
      {/* SECTION 1: BASIC INFO */}
      <div className="space-y-4 rounded-xl overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <Package className="h-5 w-5 text-primary dark:text-primary" />
          <h3 className="text-sm font-bold text-card-foreground tracking-tight">Informasi Dasar</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-card-foreground font-medium">Nama Paket</Label>
            <Input
              id="name"
              name="name"
              placeholder="Bali Adventure"
              defaultValue={defaultValues?.name}
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug" className="flex items-center gap-2 text-card-foreground font-medium">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              Slug
            </Label>
            <Input
              id="slug"
              name="slug"
              placeholder="bali-adventure"
              defaultValue={defaultValues?.slug}
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="destination" className="flex items-center gap-2 text-card-foreground font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Destinasi
            </Label>
            <Input
              id="destination"
              name="destination"
              placeholder="Bali, Indonesia"
              defaultValue={defaultValues?.destination}
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="durationDays" className="flex items-center gap-2 text-card-foreground font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Durasi (hari)
            </Label>
            <Input
              id="durationDays"
              name="durationDays"
              type="number"
              min={1}
              defaultValue={defaultValues?.durationDays ?? 1}
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: IMAGE & DESCRIPTION */}
      <div className="space-y-4 rounded-xl overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <FileText className="h-5 w-5 text-primary dark:text-primary" />
          <h3 className="text-sm font-bold text-card-foreground tracking-tight">Konten</h3>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="imageUrl" className="text-card-foreground font-medium">URL Gambar (opsional)</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            defaultValue={defaultValues?.imageUrl ?? ""}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
          />
          <p className="text-xs text-muted-foreground">Gambar cover untuk paket tour (URL lengkap)</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-card-foreground font-medium">Deskripsi</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Jelaskan paket tour ini secara detail, termasuk apa yang akan dilakukan dan pengalaman yang didapat..."
            defaultValue={defaultValues?.description}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 resize-none"
            required
          />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {state.error && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive-50 dark:bg-destructive-950/20 border border-destructive-200 dark:border-destructive-900/40 p-3">
          <p className="text-sm text-destructive-700 dark:text-destructive-300 font-medium">{state.error}</p>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all"
      >
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  );
}
