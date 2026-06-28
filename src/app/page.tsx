import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { Counter, HeroSearch, LoadingScreen } from "@/components/Widgets";
import { ProfileCard } from "@/components/ProfileCard";
import { getUsers, getTestimonials, getStories } from "@/lib/store";
import { calcAge, isPremium } from "@/lib/helpers";
import { PLAN_DETAILS } from "@/lib/types";

export const dynamic = "force-dynamic";

const HERO =
  "https://images.pexels.com/photos/13078094/pexels-photo-13078094.jpeg?auto=compress&cs=tinysrgb&w=1600";

export default async function Home() {
  const users = await getUsers();
  const testimonials = await getTestimonials();
  const stories = await getStories();
  const featured = users
    .filter((u) => u.active && !u.suspended)
    .sort((a, b) => (isPremium(b) ? 1 : 0) - (isPremium(a) ? 1 : 0))
    .slice(0, 8)
    .map((u) => ({
      id: u.id,
      fullName: u.fullName,
      photo: u.photo,
      age: calcAge(u.dob),
      city: u.city,
      state: u.state,
      occupation: u.occupation,
      premium: isPremium(u),
      verifiedBadge: u.verifiedBadge,
    }));

  return (
    <>
      <LoadingScreen />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO}
          alt="Happy couple"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center text-white md:py-32">
          <span className="fade-up inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            India&apos;s Most Trusted Matrimonial Platform
          </span>
          <h1
            className="fade-up mt-5 text-4xl font-extrabold leading-tight md:text-6xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Find Your <span className="text-amber-300">Perfect</span> Life Partner
          </h1>
          <p className="fade-up mx-auto mt-4 max-w-2xl text-rose-50/90">
            Verified profiles, secure video calling and elegant matchmaking —
            begin your beautiful journey with Vasantham Matrimonial.
          </p>
          <div className="fade-up mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-white px-7 py-3 font-semibold text-brand shadow-lg transition hover:scale-105"
            >
              Register Now — Free
            </Link>
            <Link
              href="/login"
              className="rounded-full border-2 border-white px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-brand"
            >
              Login
            </Link>
          </div>
          <HeroSearch />
        </div>
      </section>

      {/* STATS */}
      <section className="brand-gradient">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          <Counter end={50000} suffix="+" label="Verified Profiles" />
          <Counter end={12000} suffix="+" label="Happy Marriages" />
          <Counter end={98} suffix="%" label="Success Rate" />
          <Counter end={24} suffix="/7" label="Support" />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <Section
        title="Why Choose Vasantham"
        subtitle="A premium experience built on trust, privacy and genuine connections"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["🛡️", "100% Verified", "Every profile is manually verified for authenticity and safety."],
            ["🎥", "Secure Video Calls", "Connect face-to-face from the website — no external app needed."],
            ["🔒", "Privacy First", "Your data is encrypted and contact details stay protected."],
            ["💎", "Premium Matches", "Smart, priority matchmaking based on your real preferences."],
            ["⚡", "Instant Alerts", "Get notified the moment someone shows interest in you."],
            ["💬", "Dedicated Support", "Friendly relationship managers available round the clock."],
          ].map(([icon, t, d]) => (
            <div
              key={t}
              className="rounded-2xl border border-rose-100 bg-white p-6 card-shadow transition hover:-translate-y-1"
            >
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-3 text-lg font-bold text-slate-800">{t}</h3>
              <p className="mt-1 text-sm text-slate-500">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURED PROFILES */}
      <Section
        title="Featured Profiles"
        subtitle="Meet some of our verified premium members"
        tinted
      >
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {featured.map((p) => (
            <ProfileCard key={p.id} p={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="brand-gradient inline-block rounded-full px-8 py-3 font-semibold text-white shadow-lg"
          >
            Browse All Profiles
          </Link>
        </div>
      </Section>

      {/* VIDEO CALL FEATURE */}
      <Section>
        <div className="grid items-center gap-10 rounded-3xl brand-gradient p-8 text-white md:grid-cols-2 md:p-14">
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              NEW FEATURE
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold md:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Secure In-App Video Calling
            </h2>
            <p className="mt-3 text-rose-50/90">
              Get to know your match through private, browser-based video calls.
              No downloads, no sharing of personal numbers — just safe and
              meaningful conversations.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-rose-50/90">
              <li>✓ End-to-end private rooms</li>
              <li>✓ Works on mobile &amp; desktop</li>
              <li>✓ Available for premium members</li>
            </ul>
            <Link
              href="/subscription"
              className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-semibold text-brand shadow-lg"
            >
              Unlock Video Calling
            </Link>
          </div>
          <div className="floaty grid place-items-center">
            <div className="grid h-48 w-48 place-items-center rounded-full bg-white/15 md:h-64 md:w-64">
              <div className="grid h-32 w-32 place-items-center rounded-full bg-white/25 md:h-44 md:w-44">
                <span className="text-7xl">📹</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* MEMBERSHIP */}
      <Section
        title="Premium Membership"
        subtitle="Start with a 15-day free trial. Upgrade anytime."
        tinted
      >
        <div className="grid gap-5 md:grid-cols-4">
          {(["free", "silver", "gold", "diamond"] as const).map((plan) => {
            const d = PLAN_DETAILS[plan];
            const popular = plan === "gold";
            return (
              <div
                key={plan}
                className={`relative rounded-2xl border bg-white p-6 card-shadow ${
                  popular ? "border-brand ring-2 ring-brand" : "border-rose-100"
                }`}
              >
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full brand-gradient px-3 py-0.5 text-[10px] font-bold text-white">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-lg font-bold capitalize text-slate-800">
                  {d.name}
                </h3>
                <div className="mt-2 text-3xl font-extrabold text-brand">
                  {d.price === 0 ? "Free" : `₹${d.price}`}
                </div>
                <div className="text-xs text-slate-400">{d.label}</div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>✓ Profile views</li>
                  <li>{plan === "free" ? "✗" : "✓"} Unlimited interests</li>
                  <li>{plan === "free" ? "✗" : "✓"} Video calling</li>
                  <li>{plan === "free" ? "✗" : "✓"} Contact details</li>
                  <li>{plan === "free" ? "✗" : "✓"} Premium badge</li>
                </ul>
                <Link
                  href="/subscription"
                  className={`mt-5 block rounded-full py-2 text-center text-sm font-semibold ${
                    popular
                      ? "brand-gradient text-white"
                      : "border border-brand text-brand"
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            );
          })}
        </div>
      </Section>

      {/* SUCCESS STORIES */}
      <Section
        title="Success Stories"
        subtitle="Real couples who found love on Vasantham"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <div
              key={s.id}
              className="overflow-hidden rounded-2xl border border-rose-100 bg-white card-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.photo}
                alt=""
                className="h-52 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-brand">
                  {s.brideName} &amp; {s.groomName}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{s.story}</p>
                <p className="mt-3 text-xs text-rose-400">
                  💍 Married on {new Date(s.marriedOn).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section title="What Our Members Say" tinted>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-rose-100 bg-white p-6 card-shadow"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.photo}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.location}</div>
                </div>
              </div>
              <div className="mt-3 text-amber-400">{"★".repeat(t.rating)}</div>
              <p className="mt-2 text-sm text-slate-600">“{t.text}”</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-4">
        <div className="rounded-3xl brand-gradient p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold">Your Soulmate Awaits</h2>
          <p className="mt-2 text-rose-50/90">
            Join thousands finding love every day on Vasantham Matrimonial.
          </p>
          <Link
            href="/register"
            className="mt-5 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand shadow-lg transition hover:scale-105"
          >
            Create Your Free Profile
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Section({
  title,
  subtitle,
  children,
  tinted,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section className={tinted ? "bg-rose-50/60" : ""}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        {title && (
          <div className="mb-10 text-center">
            <h2
              className="text-3xl font-extrabold text-slate-800 md:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-2 max-w-2xl text-slate-500">{subtitle}</p>
            )}
            <div className="mx-auto mt-4 h-1 w-20 rounded-full brand-gradient" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
