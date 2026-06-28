import { promises as fs } from "fs";
import path from "path";
import type { User, PublicUser, Plan } from "./types";

export function calcAge(dob: string): number {
  const d = new Date(dob);
  const diff = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diff / (365.25 * 24 * 3600 * 1000)));
}

export function daysRemaining(expiry: string): number {
  const diff = new Date(expiry).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 3600 * 1000)));
}

export function isMembershipActive(user: User): boolean {
  return new Date(user.membershipExpiry).getTime() > Date.now();
}

export function isPremium(user: User): boolean {
  return user.plan !== "free" && isMembershipActive(user);
}

export function profileCompletion(user: User): number {
  const fields: (keyof User)[] = [
    "fullName",
    "gender",
    "dob",
    "religion",
    "caste",
    "subCaste",
    "motherTongue",
    "education",
    "occupation",
    "annualIncome",
    "height",
    "weight",
    "maritalStatus",
    "city",
    "state",
    "country",
    "phone",
    "email",
    "photo",
    "bio",
    "family",
    "lifestyle",
  ];
  const filled = fields.filter((f) => {
    const v = user[f];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  return Math.round((filled / fields.length) * 100);
}

export function toPublicUser(user: User): PublicUser {
  const {
    passwordHash: _p,
    otp: _o,
    otpExpiry: _oe,
    resetOtp: _r,
    resetOtpExpiry: _re,
    ...pub
  } = user;
  void _p;
  void _o;
  void _oe;
  void _r;
  void _re;
  return pub;
}

// Mock mailer: writes emails to /data/mail.log (SMTP wiring point)
export async function sendMail(to: string, subject: string, body: string) {
  const dir = path.join(process.cwd(), "data");
  await fs.mkdir(dir, { recursive: true });
  const line = `\n=== ${new Date().toISOString()} ===\nTO: ${to}\nSUBJECT: ${subject}\n${body}\n`;
  try {
    await fs.appendFile(path.join(dir, "mail.log"), line, "utf-8");
  } catch {
    // ignore
  }
}

export const PLAN_PRICE: Record<Plan, number> = {
  free: 0,
  silver: 199,
  gold: 399,
  diamond: 999,
};
