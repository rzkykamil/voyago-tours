"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deletePackage, type DeleteFormState } from "./actions";

const initialState: DeleteFormState = {};

export function DeletePackageButton({ packageId }: { packageId: number }) {
  const [state, formAction, isPending] = useActionState(
    deletePackage.bind(null, packageId),
    initialState
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirm("Hapus paket ini? Tindakan ini tidak bisa dibatalkan.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
        {isPending ? "Menghapus..." : "Hapus"}
      </Button>
      {state.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
