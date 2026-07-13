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
    <form action={formAction} className="space-y-4 rounded-xl overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 p-6">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
          <Mail className="h-4 w-4 text-slate-400" />
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@voyago.tours"
          className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
          <Lock className="h-4 w-4 text-slate-400" />
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
          required
        />
      </div>

      {state.error && (
        <div className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-3">
          <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all"
      >
        {isPending ? "Memproses..." : "Masuk ke Dashboard"}
      </Button>
    </form>
  );
}
