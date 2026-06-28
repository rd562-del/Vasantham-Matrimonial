import Link from "next/link";

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vgrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#ff5a4d" />
          <stop offset="55%" stopColor="#e2231a" />
          <stop offset="100%" stopColor="#b00d10" />
        </linearGradient>
      </defs>
      <path
        d="M50 4C24 4 4 24 4 50c0 26 20 46 46 46 13 0 22-4 30-12 8-8 16-17 16-30C96 24 76 4 50 4z"
        fill="url(#vgrad)"
        transform="rotate(8 50 50)"
      />
      {/* corner frame marks */}
      <g stroke="#ffd9d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        <path d="M26 22h8M26 22v8" />
        <path d="M74 78h-8M74 78v-8" />
      </g>
      {/* intertwined swirl knot */}
      <g stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round">
        <path d="M38 34c-10 0-14 9-9 16 4 6 14 5 16-2" />
        <path d="M62 66c10 0 14-9 9-16-4-6-14-5-16 2" />
        <circle cx="40" cy="44" r="5" />
        <circle cx="60" cy="56" r="5" />
      </g>
    </svg>
  );
}

export function Logo({
  size = 44,
  showText = true,
  light = false,
}: {
  size?: number;
  showText?: boolean;
  light?: boolean;
}) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark size={size} />
      {showText && (
        <span className="leading-none">
          <span
            className={`block text-lg font-extrabold tracking-[0.18em] ${
              light ? "text-white" : "text-[#c41a13]"
            }`}
          >
            VASANTHAM
          </span>
          <span
            className={`block text-[10px] font-semibold tracking-[0.42em] ${
              light ? "text-rose-100" : "text-rose-400"
            }`}
          >
            MATRIMONIAL
          </span>
        </span>
      )}
    </Link>
  );
}
