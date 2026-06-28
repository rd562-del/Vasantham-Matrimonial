"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Counter({
  end,
  suffix = "",
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const dur = 1500;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setVal(Math.floor(p * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-extrabold text-white md:text-4xl">
        {val.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-rose-100/80">{label}</div>
    </div>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [gender, setGender] = useState("Female");
  const [minAge, setMinAge] = useState("21");
  const [maxAge, setMaxAge] = useState("35");
  const [religion, setReligion] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (gender) p.set("gender", gender);
    if (minAge) p.set("minAge", minAge);
    if (maxAge) p.set("maxAge", maxAge);
    if (religion) p.set("religion", religion);
    router.push("/search?" + p.toString());
  }

  return (
    <form
      onSubmit={go}
      className="glass mx-auto mt-8 grid max-w-4xl gap-3 rounded-2xl border border-white/40 p-4 shadow-2xl sm:grid-cols-2 lg:grid-cols-5"
    >
      <Field label="I'm looking for">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm"
        >
          <option value="Female">Bride</option>
          <option value="Male">Groom</option>
        </select>
      </Field>
      <Field label="Min Age">
        <input
          type="number"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Max Age">
        <input
          type="number"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Religion">
        <select
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          <option>Hindu</option>
          <option>Muslim</option>
          <option>Christian</option>
          <option>Sikh</option>
          <option>Jain</option>
        </select>
      </Field>
      <div className="flex items-end">
        <button className="brand-gradient h-[42px] w-full rounded-lg text-sm font-semibold text-white shadow-lg">
          🔍 Search
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-left">
      <span className="mb-1 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

export function LoadingScreen() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHide(true), 900);
    return () => clearTimeout(t);
  }, []);
  if (hide) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center brand-gradient transition-opacity">
      <div className="text-center">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          className="brand-spin mx-auto"
        >
          <g stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round">
            <path d="M38 34c-10 0-14 9-9 16 4 6 14 5 16-2" />
            <path d="M62 66c10 0 14-9 9-16-4-6-14-5-16 2" />
          </g>
        </svg>
        <p className="mt-4 text-lg font-bold tracking-[0.3em] text-white">
          VASANTHAM
        </p>
      </div>
    </div>
  );
}
