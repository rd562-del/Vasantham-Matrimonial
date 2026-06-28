import Link from "next/link";

export interface CardProfile {
  id: string;
  fullName: string;
  photo: string;
  age?: number;
  city: string;
  state?: string;
  occupation: string;
  education?: string;
  height?: string;
  premium?: boolean;
  online?: boolean;
  verifiedBadge?: boolean;
}

export function ProfileCard({ p }: { p: CardProfile }) {
  return (
    <Link
      href={`/profile/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-rose-100 bg-white card-shadow transition hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">
        {p.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.photo}
            alt={p.fullName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-5xl text-rose-200">
            {p.fullName[0]}
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          {p.premium && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-900 shadow">
              ★ PREMIUM
            </span>
          )}
          {p.verifiedBadge && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              ✓ VERIFIED
            </span>
          )}
        </div>
        {p.online && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-semibold text-slate-800">{p.fullName}</h3>
          {p.age ? (
            <span className="text-sm text-brand">{p.age} yrs</span>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-slate-500">💼 {p.occupation}</p>
        <p className="text-xs text-slate-500">
          📍 {p.city}
          {p.state ? `, ${p.state}` : ""}
        </p>
        <div className="mt-3 brand-gradient rounded-full py-1.5 text-center text-xs font-semibold text-white">
          View Profile
        </div>
      </div>
    </Link>
  );
}
