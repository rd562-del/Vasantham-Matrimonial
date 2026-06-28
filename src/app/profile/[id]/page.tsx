"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";

interface Profile {
  id: string; fullName: string; photo: string; gallery: string[];
  age: number; gender: string; city: string; state: string; country: string;
  religion: string; caste: string; subCaste: string; motherTongue: string;
  education: string; occupation: string; annualIncome: string;
  height: string; weight: string; maritalStatus: string;
  bio?: string; family?: string; lifestyle?: string;
  premium: boolean; online: boolean; verifiedBadge: boolean;
  phone: string; email: string; canSeeContact: boolean;
  isShortlisted: boolean; interestSent: boolean; loggedIn: boolean;
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [p, setP] = useState<Profile | null>(null);
  const [active, setActive] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    fetch(`/api/profiles/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) { setP(d.profile); setActive(d.profile.photo); }
      });
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function act(action: string, reason?: string) {
    if (!p?.loggedIn) { router.push("/login"); return; }
    const res = await fetch(`/api/profiles/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    const data = await res.json();
    if (!res.ok) { setToast(data.error || "Action failed"); }
    else {
      if (action === "shortlist") setToast(data.shortlisted ? "Added to shortlist ⭐" : "Removed from shortlist");
      if (action === "interest") setToast("Interest sent 💖");
      if (action === "report") setToast("Profile reported. Thank you.");
      load();
    }
    setTimeout(() => setToast(""), 2500);
  }

  if (!p)
    return (
      <>
        <Header />
        <div className="grid min-h-[60vh] place-items-center text-brand">Loading profile...</div>
      </>
    );

  return (
    <>
      <Header />
      {toast && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full brand-gradient px-6 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Left: photo + gallery + actions */}
          <div>
            <div className="overflow-hidden rounded-3xl border border-rose-100 bg-white card-shadow">
              <div className="relative aspect-[4/5] bg-rose-50">
                {active ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={active} alt={p.fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-6xl text-rose-200">{p.fullName[0]}</div>
                )}
                <div className="absolute left-3 top-3 flex gap-1">
                  {p.premium && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-900">★ PREMIUM</span>}
                  {p.verifiedBadge && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">✓ VERIFIED</span>}
                </div>
              </div>
              {p.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar">
                  {p.gallery.map((g, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={g} alt="" onClick={() => setActive(g)}
                      className={`h-16 w-16 shrink-0 cursor-pointer rounded-lg object-cover ${active === g ? "ring-2 ring-brand" : ""}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => act("interest")} disabled={p.interestSent}
                className="brand-gradient rounded-full py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {p.interestSent ? "Interest Sent ✓" : "💖 Express Interest"}
              </button>
              <button onClick={() => act("shortlist")}
                className="rounded-full border border-brand py-2.5 text-sm font-semibold text-brand">
                {p.isShortlisted ? "★ Shortlisted" : "☆ Shortlist"}
              </button>
              <Link href={`/video/room-${p.id}`}
                className="rounded-full border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-600">
                📹 Video Call
              </Link>
              <button onClick={() => act("report", "Inappropriate")}
                className="rounded-full border border-slate-300 py-2.5 text-sm font-semibold text-slate-500">
                🚩 Report
              </button>
            </div>

            {/* Contact */}
            <div className="mt-4 rounded-2xl border border-rose-100 bg-white p-5 card-shadow">
              <h3 className="font-bold text-slate-800">Contact Details</h3>
              {p.canSeeContact ? (
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <p>📞 {p.phone}</p>
                  <p>✉️ {p.email}</p>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-500">
                  🔒 Contact details are available to premium members.{" "}
                  <Link href="/subscription" className="font-semibold text-brand">Upgrade now</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: details */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-800">{p.fullName}</h1>
              {p.online && <span className="flex items-center gap-1 text-xs font-semibold text-green-600"><span className="h-2 w-2 rounded-full bg-green-500" /> Online</span>}
            </div>
            <p className="mt-1 text-slate-500">{p.age} yrs • {p.height} • {p.occupation} • {p.city}, {p.state}</p>
            {p.bio && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-slate-600">{p.bio}</p>}

            <DetailGroup title="Basic Details" rows={[
              ["Age", `${p.age} years`], ["Gender", p.gender], ["Height", p.height],
              ["Weight", p.weight], ["Marital Status", p.maritalStatus], ["Mother Tongue", p.motherTongue],
            ]} />
            <DetailGroup title="Religion & Community" rows={[
              ["Religion", p.religion], ["Caste", p.caste], ["Sub Caste", p.subCaste],
            ]} />
            <DetailGroup title="Education & Career" rows={[
              ["Education", p.education], ["Occupation", p.occupation], ["Annual Income", p.annualIncome],
            ]} />
            <DetailGroup title="Location" rows={[
              ["City", p.city], ["State", p.state], ["Country", p.country],
            ]} />
            {p.family && <DetailGroup title="Family Details" rows={[["About Family", p.family]]} />}
            {p.lifestyle && <DetailGroup title="Lifestyle" rows={[["Habits", p.lifestyle]]} />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function DetailGroup({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-5 card-shadow">
      <h3 className="mb-3 font-bold text-brand">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-rose-50 pb-2 text-sm">
            <span className="text-slate-400">{k}</span>
            <span className="text-right font-medium text-slate-700">{v || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
