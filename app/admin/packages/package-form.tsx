"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PackageFormState } from "./actions";

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
    <form action={formAction} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nama Paket</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={defaultValues?.slug} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="destination">Destinasi</Label>
          <Input
            id="destination"
            name="destination"
            defaultValue={defaultValues?.destination}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="durationDays">Durasi (hari)</Label>
          <Input
            id="durationDays"
            name="durationDays"
            type="number"
            min={1}
            defaultValue={defaultValues?.durationDays ?? 1}
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">URL Gambar (opsional)</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={defaultValues?.imageUrl ?? ""} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          required
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  );
}
