"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";

const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
const MARITAL = ["Never Married", "Divorced", "Widowed", "Separated"];

export default function RegisterPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");

  const [f, setF] = useState({
    fullName: "", gender: "Female", dob: "", religion: "Hindu", caste: "",
    subCaste: "", motherTongue: "", education: "", occupation: "",
    annualIncome: "", height: "", weight: "", maritalStatus: "Never Married",
    city: "", state: "", country: "India", phone: "", email: "",
    password: "", confirmPassword: "", bio: "",
  });

  const age = f.dob
    ? Math.max(0, Math.floor((Date.now() - new Date(f.dob).getTime()) / 31557600000))
    : 0;

  function up(k: string, v: string) {
    setF((s) => ({ ...s, [k]: v }));
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
      setError("Only JPG/PNG/WEBP images allowed");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Image must be under 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (f.password !== f.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", ...f, photo }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    setEmail(data.email);
    setPhase("otp");
    setInfo(
      data.devOtp
        ? `OTP sent to ${data.email}. (Demo OTP: ${data.devOtp})`
        : `OTP sent to ${data.email}.`
    );
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify-otp", email, otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Verification failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function resend() {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resend-otp", email }),
    });
    const data = await res.json();
    setInfo(data.devOtp ? `New OTP: ${data.devOtp}` : "OTP resent.");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-rose-100 bg-white p-6 card-shadow md:p-10">
          {phase === "form" ? (
            <>
              <h1 className="text-center text-3xl font-extrabold text-slate-800">
                Create Your Free Profile
              </h1>
              <p className="mt-1 text-center text-sm text-slate-500">
                15-day free trial • No credit card required
              </p>
              {error && <Alert msg={error} />}
              <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Full Name *" value={f.fullName} onChange={(v) => up("fullName", v)} required />
                <Select label="Gender *" value={f.gender} onChange={(v) => up("gender", v)} options={["Female", "Male"]} />
                <div>
                  <Input type="date" label="Date of Birth *" value={f.dob} onChange={(v) => up("dob", v)} required />
                  {age > 0 && <p className="mt-1 text-xs text-brand">Age: {age} years</p>}
                </div>
                <Select label="Religion" value={f.religion} onChange={(v) => up("religion", v)} options={RELIGIONS} />
                <Input label="Caste" value={f.caste} onChange={(v) => up("caste", v)} />
                <Input label="Sub Caste" value={f.subCaste} onChange={(v) => up("subCaste", v)} />
                <Input label="Mother Tongue" value={f.motherTongue} onChange={(v) => up("motherTongue", v)} />
                <Input label="Education" value={f.education} onChange={(v) => up("education", v)} />
                <Input label="Occupation" value={f.occupation} onChange={(v) => up("occupation", v)} />
                <Input label="Annual Income" value={f.annualIncome} onChange={(v) => up("annualIncome", v)} placeholder="₹10-12 LPA" />
                <Input label="Height" value={f.height} onChange={(v) => up("height", v)} placeholder={`5'6"`} />
                <Input label="Weight" value={f.weight} onChange={(v) => up("weight", v)} placeholder="60 kg" />
                <Select label="Marital Status" value={f.maritalStatus} onChange={(v) => up("maritalStatus", v)} options={MARITAL} />
                <Input label="City" value={f.city} onChange={(v) => up("city", v)} />
                <Input label="State" value={f.state} onChange={(v) => up("state", v)} />
                <Input label="Country" value={f.country} onChange={(v) => up("country", v)} />
                <Input label="Phone Number *" value={f.phone} onChange={(v) => up("phone", v)} required />
                <Input type="email" label="Email *" value={f.email} onChange={(v) => up("email", v)} required />
                <Input type="password" label="Password *" value={f.password} onChange={(v) => up("password", v)} required />
                <Input type="password" label="Confirm Password *" value={f.confirmPassword} onChange={(v) => up("confirmPassword", v)} required />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">About You</label>
                  <textarea
                    value={f.bio}
                    onChange={(e) => up("bio", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm"
                    placeholder="Tell us a little about yourself and your expectations..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="h-20 w-20 rounded-xl object-cover" />
                    ) : (
                      <div className="grid h-20 w-20 place-items-center rounded-xl bg-rose-50 text-2xl">📷</div>
                    )}
                    <input type="file" accept="image/*" onChange={onPhoto} className="text-sm" />
                  </div>
                </div>
                <button
                  disabled={loading}
                  className="brand-gradient sm:col-span-2 rounded-full py-3 font-semibold text-white shadow-lg disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Register & Send OTP"}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-slate-500">
                Already a member?{" "}
                <Link href="/login" className="font-semibold text-brand">Login</Link>
              </p>
            </>
          ) : (
            <div className="mx-auto max-w-sm text-center">
              <div className="text-5xl">📧</div>
              <h1 className="mt-3 text-2xl font-extrabold text-slate-800">Verify Your Email</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter the 6-digit OTP we sent to {email}
              </p>
              {info && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-brand">{info}</p>}
              {error && <Alert msg={error} />}
              <form onSubmit={verify} className="mt-5">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-lg border border-rose-200 px-4 py-3 text-center text-2xl tracking-[0.5em]"
                  placeholder="------"
                />
                <button
                  disabled={loading}
                  className="brand-gradient mt-4 w-full rounded-full py-3 font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>
              <button onClick={resend} className="mt-3 text-sm font-semibold text-brand">
                Resend OTP
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Alert({ msg }: { msg: string }) {
  return (
    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
      {msg}
    </div>
  );
}

function Input({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
    </label>
  );
}

function Select({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
