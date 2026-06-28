"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { LogoMark } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <Header />
      <main className="grid min-h-[70vh] place-items-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 card-shadow">
          <div className="text-center">
            <div className="mx-auto w-fit">
              <LogoMark size={56} />
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-slate-800">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500">
              Login to continue your journey
            </p>
          </div>
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div className="text-right">
              <Link href="/forgot" className="text-xs font-semibold text-brand">
                Forgot Password?
              </Link>
            </div>
            <button
              disabled={loading}
              className="brand-gradient w-full rounded-full py-3 font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-500">
            New here?{" "}
            <Link href="/register" className="font-semibold text-brand">
              Create a free account
            </Link>
          </p>
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-center text-xs text-slate-500">
            Demo login: priya@example.com / password123
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
