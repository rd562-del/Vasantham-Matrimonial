"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";

interface Mini {
  id: string;
  fullName: string;
  photo: string;
  city: string;
  occupation: string;
  age: number;
}
interface Data {
  user: Record<string, string>;
  stats: {
    completion: number;
    membershipActive: boolean;
    plan: string;
    planName: string;
    daysRemaining: number;
    visitorCount: number;
    interestedCount: number;
    shortlistedCount: number;
  };
  visitors: Mini[];
  interested: Mini[];
  shortlisted: Mini[];
  matches: Mini[];
  pendingPayment: { status: string; plan: string } | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [d, setD] = useState<Data | null>(null);
  const [tab, setTab] = useState<"overview" | "edit" | "password">("overview");
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    fetch("/api/account")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((data) => data && setD(data))
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (!d)
    return (
      <>
        <Header />
        <div className="grid min-h-[60vh] place-items-center text-brand">
          Loading your dashboard...
        </div>
      </>
    );

  const u = d.user;
  const s = d.stats;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl brand-gradient p-6 text-white md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {u.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.photo} alt="" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/50" />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-2xl">
                {u.fullName?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold">Hello, {u.fullName} 👋</h1>
              <p className="text-sm text-rose-50/90">
                {s.membershipActive ? `${s.planName} • ${s.daysRemaining} days left` : "Membership expired"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/video/my-room" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand shadow">
              📹 Start Video Call
            </Link>
            <Link href="/search" className="rounded-full border border-white px-5 py-2 text-sm font-semibold text-white">
              Find Matches
            </Link>
          </div>
        </div>

        {/* Trial / membership banner */}
        {!s.membershipActive && (
          <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center text-sm text-amber-800">
            ⏰ Your free trial has ended. Upgrade to unlock unlimited views, contact details and video calling.{" "}
            <Link href="/subscription" className="font-bold underline">Upgrade Now</Link>
          </div>
        )}
        {d.pendingPayment && d.pendingPayment.status === "pending" && (
          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-700">
            🕒 Your payment for the {d.pendingPayment.plan} plan is pending admin verification.
          </div>
        )}

        {/* Stat cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatRing label="Profile Completion" value={s.completion} />
          <Stat icon="👁️" label="Profile Visitors" value={s.visitorCount} />
          <Stat icon="💖" label="Interested In You" value={s.interestedCount} />
          <Stat icon="⭐" label="Shortlisted" value={s.shortlistedCount} />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-rose-100">
          {(["overview", "edit", "password"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg(""); }}
              className={`px-4 py-2 text-sm font-semibold capitalize ${
                tab === t ? "border-b-2 border-brand text-brand" : "text-slate-500"
              }`}
            >
              {t === "edit" ? "Edit Profile" : t === "password" ? "Change Password" : "Overview"}
            </button>
          ))}
        </div>

        {msg && <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-brand">{msg}</p>}

        {tab === "overview" && (
          <div className="mt-6 space-y-8">
            <PeopleRow title="Recent Matches" people={d.matches} empty="Complete your profile to see matches." />
            <PeopleRow title="Who Viewed You" people={d.visitors} locked={!s.membershipActive} empty="No visitors yet." />
            <PeopleRow title="Interested In You" people={d.interested} locked={!s.membershipActive} empty="No interests received yet." />
            <PeopleRow title="Your Shortlist" people={d.shortlisted} empty="You haven't shortlisted anyone yet." />
          </div>
        )}

        {tab === "edit" && <EditProfile user={u} onSaved={(m) => { setMsg(m); load(); }} />}
        {tab === "password" && <ChangePassword onSaved={(m) => setMsg(m)} />}
      </main>
      <Footer />
    </>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-5 card-shadow">
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 text-3xl font-extrabold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function StatRing({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-5 card-shadow">
      <div
        className="grid h-16 w-16 place-items-center rounded-full text-sm font-bold text-brand"
        style={{ background: `conic-gradient(#e2231a ${value * 3.6}deg, #ffe4e6 0deg)` }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white">{value}%</span>
      </div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
    </div>
  );
}

function PeopleRow({
  title, people, empty, locked,
}: {
  title: string; people: Mini[]; empty: string; locked?: boolean;
}) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-slate-800">{title}</h2>
      {people.length === 0 ? (
        <p className="text-sm text-slate-400">{empty}</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {people.map((p) => (
            <Link
              key={p.id}
              href={`/profile/${p.id}`}
              className="w-40 shrink-0 overflow-hidden rounded-2xl border border-rose-100 bg-white card-shadow"
            >
              <div className="relative h-40 w-40 bg-rose-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo} alt="" className={`h-full w-full object-cover ${locked ? "blur-md" : ""}`} />
                {locked && <div className="absolute inset-0 grid place-items-center text-3xl">🔒</div>}
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-semibold text-slate-800">{p.fullName}, {p.age}</div>
                <div className="truncate text-xs text-slate-500">{p.city}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EditProfile({ user, onSaved }: { user: Record<string, string>; onSaved: (m: string) => void }) {
  const fields = [
    "fullName", "religion", "caste", "subCaste", "motherTongue", "education",
    "occupation", "annualIncome", "height", "weight", "maritalStatus",
    "city", "state", "country", "phone",
  ];
  const [f, setF] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    [...fields, "bio", "family", "lifestyle"].forEach((k) => (o[k] = user[k] || ""));
    return o;
  });
  const [photo, setPhoto] = useState(user.photo || "");
  const [saving, setSaving] = useState(false);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || file.size > 3 * 1024 * 1024) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result as string);
    r.readAsDataURL(file);
  }

  async function save() {
    setSaving(true);
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", ...f, photo }),
    });
    setSaving(false);
    onSaved("Profile updated successfully ✓");
  }

  return (
    <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6 card-shadow">
      <div className="mb-4 flex items-center gap-4">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-20 w-20 rounded-xl object-cover" />
        )}
        <input type="file" accept="image/*" onChange={onPhoto} className="text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((k) => (
          <label key={k} className="block">
            <span className="mb-1 block text-xs font-semibold capitalize text-slate-600">{k}</span>
            <input
              value={f[k]}
              onChange={(e) => setF((s) => ({ ...s, [k]: e.target.value }))}
              className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm"
            />
          </label>
        ))}
        {["bio", "family", "lifestyle"].map((k) => (
          <label key={k} className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold capitalize text-slate-600">{k}</span>
            <textarea
              value={f[k]}
              rows={2}
              onChange={(e) => setF((s) => ({ ...s, [k]: e.target.value }))}
              className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm"
            />
          </label>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="brand-gradient mt-5 rounded-full px-8 py-2.5 font-semibold text-white disabled:opacity-60">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function ChangePassword({ onSaved }: { onSaved: (m: string) => void }) {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "password", current, password }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error); return; }
    setCurrent(""); setPassword("");
    onSaved("Password changed successfully ✓");
  }

  return (
    <form onSubmit={save} className="mt-6 max-w-md rounded-2xl border border-rose-100 bg-white p-6 card-shadow">
      {err && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}
      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-semibold text-slate-600">Current Password</span>
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm" />
      </label>
      <label className="mb-4 block">
        <span className="mb-1 block text-xs font-semibold text-slate-600">New Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm" />
      </label>
      <button className="brand-gradient rounded-full px-8 py-2.5 font-semibold text-white">Update Password</button>
    </form>
  );
}
