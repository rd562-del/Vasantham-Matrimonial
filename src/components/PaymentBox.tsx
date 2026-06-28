"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  { id: "silver", name: "Silver Plan", price: 199, label: "1 Month" },
  { id: "gold", name: "Gold Plan", price: 399, label: "6 Months" },
  { id: "diamond", name: "Diamond Plan", price: 999, label: "1 Year" },
];

export function PaymentBox({ qr, upiId }: { qr: string; upiId: string }) {
  const router = useRouter();
  const [plan, setPlan] = useState("gold");
  const [screenshot, setScreenshot] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = PLANS.find((p) => p.id === plan)!;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) { setErr("Screenshot must be under 3MB"); return; }
    const r = new FileReader();
    r.onload = () => setScreenshot(r.result as string);
    r.readAsDataURL(f);
  }

  async function submit() {
    setErr(""); setMsg("");
    if (!screenshot) { setErr("Please upload your payment screenshot"); return; }
    setLoading(true);
    const res = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "payment", plan, screenshot }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      if (res.status === 401) { router.push("/login"); return; }
      setErr(data.error || "Submission failed");
      return;
    }
    setMsg("Payment submitted! Your membership activates after admin verification.");
    setScreenshot("");
  }

  return (
    <div className="grid gap-8 rounded-3xl border border-rose-100 bg-white p-6 card-shadow md:grid-cols-2 md:p-10">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800">Scan & Pay via UPI</h3>
        <p className="mt-1 text-sm text-slate-500">
          Pay ₹{selected.price} for {selected.name}
        </p>
        <div className="mx-auto mt-4 w-fit rounded-2xl border-4 border-rose-100 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="UPI QR Code" className="h-56 w-56" />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700">UPI ID: {upiId}</p>
        <p className="text-xs text-slate-400">Scan with any UPI app (GPay, PhonePe, Paytm)</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800">Upload Payment Proof</h3>
        <label className="mt-3 block text-xs font-semibold text-slate-600">Select Plan</label>
        <select value={plan} onChange={(e) => setPlan(e.target.value)}
          className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 text-sm">
          {PLANS.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — ₹{p.price} ({p.label})</option>
          ))}
        </select>

        <label className="mt-4 block text-xs font-semibold text-slate-600">Payment Screenshot</label>
        <input type="file" accept="image/*" onChange={onFile} className="mt-1 text-sm" />
        {screenshot && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={screenshot} alt="" className="mt-3 h-40 rounded-lg object-contain" />
        )}

        {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}
        {msg && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>}

        <button onClick={submit} disabled={loading}
          className="brand-gradient mt-4 w-full rounded-full py-3 font-semibold text-white shadow-lg disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Payment for Verification"}
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">
          Membership activates automatically once admin verifies your payment.
        </p>
      </div>
    </div>
  );
}
