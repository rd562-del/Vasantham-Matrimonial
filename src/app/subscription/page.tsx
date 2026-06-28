import Link from "next/link";
import QRCode from "qrcode";
import { Header, Footer } from "@/components/Chrome";
import { PaymentBox } from "@/components/PaymentBox";
import { PLAN_DETAILS } from "@/lib/types";

export const dynamic = "force-dynamic";

const UPI_ID = process.env.UPI_ID || "rishidakshin-1@okaxis";
const UPI_NAME = process.env.UPI_NAME || "Vasantham Matrimonial";

const FEATURES: Record<string, string[]> = {
  free: ["Limited profile views", "3 interests", "Basic search"],
  silver: ["Unlimited views", "Unlimited interests", "Contact details", "Premium badge"],
  gold: ["Everything in Silver", "Video calling", "Priority search", "Who viewed me"],
  diamond: ["Everything in Gold", "Verified badge", "Featured profile", "Dedicated support"],
};

export default async function SubscriptionPage() {
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`;
  const qr = await QRCode.toDataURL(upiUri, {
    width: 320,
    margin: 1,
    color: { dark: "#b00d10", light: "#ffffff" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Membership Plans
          </h1>
          <p className="mt-2 text-slate-500">
            Begin with a 15-day free trial. Upgrade anytime to unlock premium features.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {(["free", "silver", "gold", "diamond"] as const).map((plan) => {
            const d = PLAN_DETAILS[plan];
            const popular = plan === "gold";
            return (
              <div key={plan}
                className={`relative rounded-3xl border bg-white p-6 card-shadow ${
                  popular ? "border-brand ring-2 ring-brand md:-mt-3" : "border-rose-100"
                }`}>
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full brand-gradient px-3 py-0.5 text-[10px] font-bold text-white">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-lg font-bold text-slate-800">{d.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold brand-text-gradient">
                    {d.price === 0 ? "Free" : `₹${d.price}`}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{d.label}</div>
                <ul className="mt-5 space-y-2 text-sm text-slate-600">
                  {FEATURES[plan].map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-brand">✓</span>{f}</li>
                  ))}
                </ul>
                {plan === "free" ? (
                  <Link href="/register" className="mt-6 block rounded-full border border-brand py-2 text-center text-sm font-semibold text-brand">
                    Start Free
                  </Link>
                ) : (
                  <a href="#pay" className={`mt-6 block rounded-full py-2 text-center text-sm font-semibold ${popular ? "brand-gradient text-white" : "border border-brand text-brand"}`}>
                    Choose {d.name}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div id="pay" className="mt-16">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-800">Complete Your Payment</h2>
          <PaymentBox qr={qr} upiId={UPI_ID} />
        </div>
      </main>
      <Footer />
    </>
  );
}
