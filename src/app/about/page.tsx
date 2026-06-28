import { Header, Footer } from "@/components/Chrome";
import { Counter } from "@/components/Widgets";
import Link from "next/link";

export const metadata = { title: "About Us — Vasantham Matrimonial" };

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="brand-gradient py-20 text-center text-white">
          <h1 className="text-4xl font-extrabold md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            About Vasantham Matrimonial
          </h1>
          <p className="mx-auto mt-4 max-w-2xl px-6 text-rose-50/90">
            Bringing hearts together with trust, tradition and technology since 2015.
          </p>
        </section>

        <div className="mx-auto max-w-5xl space-y-12 px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <Card icon="🎯" title="Our Mission">
              To help every individual find a compatible, verified and trustworthy life
              partner through a secure, elegant and respectful platform that honours
              Indian values while embracing modern technology.
            </Card>
            <Card icon="👁️" title="Our Vision">
              To become India&apos;s most loved matrimonial brand — known for genuine
              connections, complete privacy, and thousands of happy beginnings every year.
            </Card>
          </div>

          <Card icon="📖" title="Our Story">
            Vasantham Matrimonial was founded with a simple belief — that finding a life
            partner should be joyful, safe and dignified. What began as a small community
            matchmaking service has grown into a trusted platform serving families across
            India and abroad. Every feature we build, from verified profiles to secure
            video calling, is designed to protect your privacy and bring you closer to the
            right match.
          </Card>

          <div className="grid grid-cols-2 gap-6 rounded-3xl brand-gradient p-8 md:grid-cols-4">
            <Counter end={50000} suffix="+" label="Members" />
            <Counter end={12000} suffix="+" label="Marriages" />
            <Counter end={500} suffix="+" label="Cities" />
            <Counter end={10} suffix="+" label="Years" />
          </div>

          <div>
            <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-800">Why Choose Us</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["🛡️", "Verified Profiles", "Manual verification for every member."],
                ["🔒", "Total Privacy", "Your data and contact stay protected."],
                ["🎥", "Video Calling", "Connect safely before meeting."],
                ["💎", "Smart Matching", "Preference-based premium matches."],
                ["⚡", "Instant Alerts", "Never miss an interest."],
                ["💬", "24/7 Support", "Always here to help you."],
              ].map(([i, t, d]) => (
                <div key={t} className="rounded-2xl border border-rose-100 bg-white p-5 card-shadow">
                  <div className="text-3xl">{i}</div>
                  <h3 className="mt-2 font-bold text-slate-800">{t}</h3>
                  <p className="text-sm text-slate-500">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/register" className="brand-gradient inline-block rounded-full px-8 py-3 font-semibold text-white shadow-lg">
              Join Vasantham Today
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Card({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 card-shadow">
      <div className="text-4xl">{icon}</div>
      <h2 className="mt-3 text-xl font-bold text-slate-800">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}
