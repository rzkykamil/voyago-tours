import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { LoginForm } from "./login-form";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login — Voyago Tours",
};

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background antialiased">

      <Reveal className="relative z-10 w-full max-w-sm px-6">
        {/* HEADER SECTION */}
        <div className="space-y-6 text-center mb-8">
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground">
              Admin Login
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
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
      </Reveal>
    </div>
  );
}
