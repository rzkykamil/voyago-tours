"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginFormState } from "./actions";
import { Mail, Lock } from "lucide-react";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-none overflow-hidden bg-card border border-border p-6">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="flex items-center gap-2 text-card-foreground font-medium">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@voyago.tours"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="flex items-center gap-2 text-card-foreground font-medium">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      {state.error && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        variant="stamp"
        className="w-full"
      >
        {isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
