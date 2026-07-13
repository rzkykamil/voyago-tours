import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login — Voyago Tours",
};

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background antialiased">
      {/* Efek Gradasi Halus di Latar Belakang */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-sky-500/2 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* HEADER SECTION */}
        <div className="space-y-6 text-center mb-8">
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-950">
              <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Admin Login
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              Masuk untuk mengelola paket tour, harga, dan booking Voyago Tours.
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <LoginForm />

        {/* FOOTER HINT */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Akses terbatas untuk admin Voyago Tours
        </p>
      </div>
    </div>
  );
}
