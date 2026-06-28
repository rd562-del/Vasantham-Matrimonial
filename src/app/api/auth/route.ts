import { NextRequest, NextResponse } from "next/server";
import {
  getUsers,
  saveUsers,
  findUserByEmail,
  findUserById,
  updateUser,
} from "@/lib/store";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getCurrentUser,
  generateOtp,
} from "@/lib/auth";
import { sendMail, toPublicUser } from "@/lib/helpers";
import type { User } from "@/lib/types";

export const dynamic = "force-dynamic";

const OTP_TTL = 10 * 60 * 1000;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: toPublicUser(user) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "register") return register(body);
  if (action === "verify-otp") return verifyOtp(body);
  if (action === "resend-otp") return resendOtp(body);
  if (action === "login") return login(body);
  if (action === "logout") return logout();
  if (action === "forgot") return forgot(body);
  if (action === "reset") return reset(body);

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

function err(msg: string, code = 400) {
  return NextResponse.json({ error: msg }, { status: code });
}

async function register(b: Record<string, string>) {
  const required = ["fullName", "gender", "dob", "email", "phone", "password"];
  for (const f of required) {
    if (!b[f] || !String(b[f]).trim())
      return err(`Missing field: ${f}`);
  }
  if (!/^\S+@\S+\.\S+$/.test(b.email)) return err("Invalid email address");
  if (b.password.length < 6)
    return err("Password must be at least 6 characters");
  if (b.password !== b.confirmPassword)
    return err("Passwords do not match");

  const users = await getUsers();
  if (users.some((u) => u.email.toLowerCase() === b.email.toLowerCase()))
    return err("This email is already registered");
  if (users.some((u) => u.phone.replace(/\s/g, "") === b.phone.replace(/\s/g, "")))
    return err("This phone number is already registered");

  const otp = generateOtp();
  const nowIso = new Date().toISOString();
  const user: User = {
    id: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    fullName: b.fullName.trim(),
    gender: b.gender,
    dob: b.dob,
    religion: b.religion || "",
    caste: b.caste || "",
    subCaste: b.subCaste || "",
    motherTongue: b.motherTongue || "",
    education: b.education || "",
    occupation: b.occupation || "",
    annualIncome: b.annualIncome || "",
    height: b.height || "",
    weight: b.weight || "",
    maritalStatus: b.maritalStatus || "Never Married",
    city: b.city || "",
    state: b.state || "",
    country: b.country || "India",
    phone: b.phone.trim(),
    email: b.email.trim().toLowerCase(),
    passwordHash: hashPassword(b.password),
    photo: b.photo || "",
    gallery: b.photo ? [b.photo] : [],
    bio: b.bio || "",
    family: "",
    lifestyle: "",
    plan: "free",
    trialStart: nowIso,
    membershipExpiry: new Date(Date.now() + 15 * 86400000).toISOString(),
    verifiedBadge: false,
    premiumBadge: false,
    active: false,
    suspended: false,
    approved: true,
    createdAt: nowIso,
    lastActive: nowIso,
    visitors: [],
    shortlisted: [],
    interestsSent: [],
    interestsReceived: [],
    otp,
    otpExpiry: new Date(Date.now() + OTP_TTL).toISOString(),
    resetOtp: null,
    resetOtpExpiry: null,
  };
  users.push(user);
  await saveUsers(users);
  await sendMail(
    user.email,
    "Verify your Vasantham Matrimonial account",
    `Welcome ${user.fullName}! Your OTP is ${otp}. It expires in 10 minutes.`
  );
  // OTP returned for demo (no SMTP configured)
  return NextResponse.json({ ok: true, email: user.email, devOtp: otp });
}

async function verifyOtp(b: Record<string, string>) {
  const user = await findUserByEmail(b.email || "");
  if (!user) return err("Account not found");
  if (user.active) return err("Account already verified");
  if (!user.otp || !user.otpExpiry) return err("No OTP pending");
  if (new Date(user.otpExpiry).getTime() < Date.now())
    return err("OTP expired. Please resend.");
  if (b.otp !== user.otp) return err("Incorrect OTP");
  await updateUser(user.id, {
    active: true,
    verifiedBadge: true,
    otp: null,
    otpExpiry: null,
  });
  await createSession({ role: "user", id: user.id });
  await sendMail(
    user.email,
    "Registration successful 🎉",
    `Hi ${user.fullName}, your account is now active. Your 15-day free trial has started!`
  );
  return NextResponse.json({ ok: true });
}

async function resendOtp(b: Record<string, string>) {
  const user = await findUserByEmail(b.email || "");
  if (!user) return err("Account not found");
  const otp = generateOtp();
  await updateUser(user.id, {
    otp,
    otpExpiry: new Date(Date.now() + OTP_TTL).toISOString(),
  });
  await sendMail(user.email, "Your new OTP", `Your new OTP is ${otp}.`);
  return NextResponse.json({ ok: true, devOtp: otp });
}

async function login(b: Record<string, string>) {
  const user = await findUserByEmail(b.email || "");
  if (!user || !verifyPassword(b.password || "", user.passwordHash))
    return err("Invalid email or password", 401);
  if (user.suspended)
    return err("Your account has been suspended. Contact support.", 403);
  if (!user.active)
    return NextResponse.json(
      { error: "Please verify your email first", needVerify: true, email: user.email },
      { status: 403 }
    );
  await updateUser(user.id, { lastActive: new Date().toISOString() });
  await createSession({ role: "user", id: user.id });
  return NextResponse.json({ ok: true });
}

async function logout() {
  await destroySession();
  return NextResponse.json({ ok: true });
}

async function forgot(b: Record<string, string>) {
  const user = await findUserByEmail(b.email || "");
  if (!user)
    return NextResponse.json({ ok: true }); // do not reveal
  const otp = generateOtp();
  await updateUser(user.id, {
    resetOtp: otp,
    resetOtpExpiry: new Date(Date.now() + OTP_TTL).toISOString(),
  });
  await sendMail(
    user.email,
    "Password reset OTP",
    `Your password reset OTP is ${otp}. It expires in 10 minutes.`
  );
  return NextResponse.json({ ok: true, devOtp: otp });
}

async function reset(b: Record<string, string>) {
  const user = await findUserByEmail(b.email || "");
  if (!user) return err("Account not found");
  if (!user.resetOtp || !user.resetOtpExpiry) return err("No reset pending");
  if (new Date(user.resetOtpExpiry).getTime() < Date.now())
    return err("OTP expired");
  if (b.otp !== user.resetOtp) return err("Incorrect OTP");
  if (!b.password || b.password.length < 6)
    return err("Password must be at least 6 characters");
  await updateUser(user.id, {
    passwordHash: hashPassword(b.password),
    resetOtp: null,
    resetOtpExpiry: null,
  });
  return NextResponse.json({ ok: true });
}

void findUserById;
