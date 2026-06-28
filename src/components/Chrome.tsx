"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

interface Me {
  id: string;
  fullName: string;
  photo: string;
}

export function Header() {
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setMe(d.user))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setMe(null);
    router.push("/");
    router.refresh();
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Search" },
    { href: "/subscription", label: "Membership" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "glass shadow-md" : "bg-white/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Logo size={42} />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition hover:text-brand ${
                pathname === l.href ? "text-brand" : "text-slate-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {me ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1.5 text-sm font-semibold text-brand hover:bg-rose-50"
              >
                {me.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={me.photo}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-xs text-white">
                    {me.fullName[0]}
                  </span>
                )}
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-slate-500 hover:text-brand"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-brand hover:bg-rose-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:opacity-90"
              >
                Register Free
              </Link>
            </>
          )}
        </div>
        <button
          className="text-brand md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-rose-100 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            {me ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="brand-gradient flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-brand"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-rose-200 px-4 py-2 text-center text-sm font-semibold text-brand"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="brand-gradient flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-[#1a0608] text-rose-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <Logo size={46} light />
          <p className="mt-4 text-sm text-rose-200/80">
            India&apos;s trusted matrimonial platform helping you find a verified,
            compatible life partner with elegance and security.
          </p>
          <div className="mt-5 flex gap-3">
            {["facebook", "instagram", "twitter", "youtube"].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-brand"
              >
                <SocialIcon name={s} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-rose-200/80">
            <li><Link href="/search" className="hover:text-white">Search Profiles</Link></li>
            <li><Link href="/subscription" className="hover:text-white">Membership Plans</Link></li>
            <li><Link href="/register" className="hover:text-white">Register Free</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Legal</h4>
          <ul className="space-y-2 text-sm text-rose-200/80">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/admin" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-rose-200/80">
            <li>📍 No. 12, Anna Salai, Chennai, TN 600002</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@vasantham.com</li>
            <li>💬 WhatsApp: +91 98765 43210</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-rose-200/60">
        © {new Date().getFullYear()} Vasantham Matrimonial. All rights reserved.
        Made with ❤️ for happy beginnings.
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = "h-4 w-4 fill-white";
  if (name === "facebook")
    return (
      <svg viewBox="0 0 24 24" className={common}>
        <path d="M13 10h3l.5-3H13V5c0-.9.3-1.5 1.6-1.5H16V.8C15.7.8 14.5.7 13.3.7 10.7.7 9 2.2 9 5v2H6v3h3v8h4z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg viewBox="0 0 24 24" className={common}>
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.1.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.1-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zM12 6.8a5.2 5.2 0 100 10.4 5.2 5.2 0 000-10.4zm0 8.6a3.4 3.4 0 110-6.8 3.4 3.4 0 010 6.8zm5.4-8.8a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
      </svg>
    );
  if (name === "twitter")
    return (
      <svg viewBox="0 0 24 24" className={common}>
        <path d="M18.9 2H22l-7 8 8.2 12H17l-5-7.3L6.3 22H3l7.5-8.6L2.5 2H9l4.5 6.6zM16.8 20h1.7L7.3 4H5.5z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={common}>
      <path d="M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16 4 12 4 12 4s-4 0-6.8.3c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 8.8 2 10.5v1.9c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.8.8 1.8.8 2.3.9 1.7.2 6.7.3 6.7.3s4 0 6.8-.3c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.9c0-1.7-.2-3.3-.2-3.3zM10 14.6V8.9l5.2 2.9z" />
    </svg>
  );
}
