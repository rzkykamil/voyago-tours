import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login — Voyago Tours",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Masuk untuk mengelola paket, harga, dan booking Voyago Tours.
      </p>
      <LoginForm />
    </div>
  );
}
