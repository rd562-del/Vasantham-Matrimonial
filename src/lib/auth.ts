import crypto from "crypto";
import { cookies } from "next/headers";
import { findUserById } from "./store";
import type { User } from "./types";

const SECRET =
  process.env.SESSION_SECRET || "vasantham-matrimonial-secret-key-2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@vasantham.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const test = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(test));
  } catch {
    return false;
  }
}

function sign(value: string): string {
  const sig = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("hex");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return null;
  return value;
}

export async function createSession(payload: {
  role: "user" | "admin";
  id: string;
}) {
  const token = sign(JSON.stringify(payload));
  const store = await cookies();
  store.set("vsession", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete("vsession");
}

export async function getSession(): Promise<{
  role: "user" | "admin";
  id: string;
} | null> {
  const store = await cookies();
  const token = store.get("vsession")?.value;
  if (!token) return null;
  const value = unsign(token);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session || session.role !== "user") return null;
  const user = await findUserById(session.id);
  return user || null;
}

export function checkAdminCredentials(email: string, password: string) {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
