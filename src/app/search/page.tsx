"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { ProfileCard, type CardProfile } from "@/components/ProfileCard";

function SearchInner() {
  const sp = useSearchParams();
  const [profiles, setProfiles] = useState<CardProfile[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "", gender: sp.get("gender") || "", religion: sp.get("religion") || "",
    caste: "", education: "", occupation: "", location: "",
    minAge: sp.get("minAge") || "", maxAge: sp.get("maxAge") || "",
    premium: false, online: false, sort: "premium",
  });

  const run = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (typeof v === "boolean") {
        if (v) p.set(k, "1");
      } else if (v) {
        p.set(k, v);
      }
    });
    fetch("/api/profiles?" + p.toString())
      .then((r) => r.json())
      .then((d) => { setProfiles(d.profiles); setCount(d.count); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filters]);

  useEffect(() => { run(); }, [run]);

  function set(k: string, v: string | boolean) {
    setFilters((s) => ({ ...s, [k]: v }));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800">Find Your Match</h1>
      <p className="text-sm text-slate-500">{count} profiles found</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="h-fit rounded-2xl border border-rose-100 bg-white p-5 card-shadow lg:sticky lg:top-24">
          <h2 className="mb-3 font-bold text-slate-800">Filters</h2>
          <div className="space-y-3 text-sm">
            <input placeholder="Search name, city, job..." value={filters.q}
              onChange={(e) => set("q", e.target.value)}
              className="w-full rounded-lg border border-rose-200 px-3 py-2" />
            <Sel label="Gender" value={filters.gender} onChange={(v) => set("gender", v)} opts={["", "Female", "Male"]} labels={["Any", "Bride", "Groom"]} />
            <Sel label="Religion" value={filters.religion} onChange={(v) => set("religion", v)} opts={["", "Hindu", "Muslim", "Christian", "Sikh", "Jain"]} />
            <input placeholder="Caste" value={filters.caste} onChange={(e) => set("caste", e.target.value)} className="w-full rounded-lg border border-rose-200 px-3 py-2" />
            <input placeholder="Education" value={filters.education} onChange={(e) => set("education", e.target.value)} className="w-full rounded-lg border border-rose-200 px-3 py-2" />
            <input placeholder="Occupation" value={filters.occupation} onChange={(e) => set("occupation", e.target.value)} className="w-full rounded-lg border border-rose-200 px-3 py-2" />
            <input placeholder="Location (city/state)" value={filters.location} onChange={(e) => set("location", e.target.value)} className="w-full rounded-lg border border-rose-200 px-3 py-2" />
            <div className="flex gap-2">
              <input type="number" placeholder="Min age" value={filters.minAge} onChange={(e) => set("minAge", e.target.value)} className="w-full rounded-lg border border-rose-200 px-3 py-2" />
              <input type="number" placeholder="Max age" value={filters.maxAge} onChange={(e) => set("maxAge", e.target.value)} className="w-full rounded-lg border border-rose-200 px-3 py-2" />
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={filters.premium} onChange={(e) => set("premium", e.target.checked)} /> Premium members only</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={filters.online} onChange={(e) => set("online", e.target.checked)} /> Online now</label>
            <Sel label="Sort by" value={filters.sort} onChange={(v) => set("sort", v)} opts={["premium", "recent"]} labels={["Premium First", "Recently Joined"]} />
          </div>
        </aside>

        {/* Results */}
        <div>
          {loading ? (
            <div className="grid place-items-center py-20 text-brand">Loading profiles...</div>
          ) : profiles.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-rose-100 bg-white py-20 text-slate-400">
              No profiles match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {profiles.map((p) => (
                <ProfileCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Sel({
  label, value, onChange, opts, labels,
}: {
  label: string; value: string; onChange: (v: string) => void; opts: string[]; labels?: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2">
        {opts.map((o, i) => (
          <option key={o} value={o}>{labels ? labels[i] : o || "Any"}</option>
        ))}
      </select>
    </label>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="grid min-h-[50vh] place-items-center text-brand">Loading...</div>}>
        <SearchInner />
      </Suspense>
      <Footer />
    </>
  );
}
