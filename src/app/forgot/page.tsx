"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";

export default function ForgotPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "forgot", email }),
    });
    const data = await res.json();
    setLoading(false);
    setPhase("reset");
    setInfo(
      data.devOtp
        ? `Reset OTP sent. (Demo OTP: ${data.devOtp})`
        : "If the email exists, an OTP has been sent."
    );
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset", email, otp, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Reset failed");
      return;
    }
    router.push("/login");
  }

  return (
    <>
      <Header />
      <main className="grid min-h-[70vh] place-items-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 card-shadow">
          <h1 className="text-center text-2xl font-extrabold text-slate-800">
            Reset Password
          </h1>
          {info && (
            <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs text-brand">
              {info}
            </p>
          )}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          {phase === "email" ? (
            <form onSubmit={sendOtp} className="mt-6 space-y-4">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 text-sm"
              />
              <button
                disabled={loading}
                className="brand-gradient w-full rounded-full py-3 font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={reset} className="mt-6 space-y-4">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 text-center tracking-[0.4em]"
              />
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 text-sm"
              />
              <button
                disabled={loading}
                className="brand-gradient w-full rounded-full py-3 font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
          <p className="mt-5 text-center text-sm text-slate-500">
            <Link href="/login" className="font-semibold text-brand">
              Back to Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
