"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/Chrome";

export default function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(data.error || "Failed to send"); return; }
    setMsg("Thank you! We'll get back to you soon.");
    setF({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Get In Touch
          </h1>
          <p className="mt-2 text-slate-500">We&apos;re here to help you on your journey to forever.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[
              ["📍", "Office Address", "No. 12, Anna Salai, Chennai, Tamil Nadu 600002"],
              ["📞", "Phone", "+91 98765 43210"],
              ["✉️", "Email", "support@vasantham.com"],
              ["💬", "WhatsApp", "+91 98765 43210"],
            ].map(([i, t, d]) => (
              <div key={t} className="flex items-start gap-4 rounded-2xl border border-rose-100 bg-white p-5 card-shadow">
                <div className="text-3xl">{i}</div>
                <div>
                  <h3 className="font-bold text-slate-800">{t}</h3>
                  <p className="text-sm text-slate-500">{d}</p>
                </div>
              </div>
            ))}
            <iframe
              title="map"
              className="h-56 w-full rounded-2xl border border-rose-100"
              loading="lazy"
              src="https://www.google.com/maps?q=Chennai&output=embed"
            />
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-rose-100 bg-white p-6 card-shadow">
            {msg && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>}
            {err && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name *" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
              <Input label="Email *" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
              <Input label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
              <Input label="Subject" value={f.subject} onChange={(v) => setF({ ...f, subject: v })} />
            </div>
            <label className="mt-4 block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Message *</span>
              <textarea required rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })}
                className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm" />
            </label>
            <button disabled={loading} className="brand-gradient mt-4 w-full rounded-full py-3 font-semibold text-white disabled:opacity-60">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <input type={type} required={label.includes("*")} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm" />
    </label>
  );
}
