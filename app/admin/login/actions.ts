"use server";

import { redirect } from "next/navigation";
import { checkAdminCredentials, createAdminSession, destroyAdminSession } from "@/lib/session";

export type LoginFormState = {
  error?: string;
};

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!checkAdminCredentials(email, password)) {
    return { error: "Email atau password salah." };
  }

  await createAdminSession(email);
  redirect("/admin");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
