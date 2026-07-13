import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "voyago_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getSigningKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(value: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bufferToHex(signature);
}

export async function createSessionToken(email: string) {
  const signature = await sign(email);
  return `${email}.${signature}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return false;

  const email = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  if (email !== process.env.ADMIN_EMAIL) return false;

  const expectedSignature = await sign(email);
  return signature === expectedSignature;
}

export function checkAdminCredentials(email: string, password: string) {
  return (
    email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD
  );
}

export async function createAdminSession(email: string) {
  const token = await createSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
