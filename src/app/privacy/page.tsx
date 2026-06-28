import { Header, Footer } from "@/components/Chrome";

export const metadata = { title: "Privacy Policy — Vasantham Matrimonial" };

const sections: [string, string][] = [
  ["Information We Collect", "We collect the details you provide during registration including your name, contact information, photographs and partner preferences. This information is used solely to provide matchmaking services."],
  ["How We Use Your Data", "Your data is used to create your profile, suggest compatible matches, and improve our services. We never sell your personal information to third parties."],
  ["Data Security", "All passwords are securely hashed and your data is stored on protected servers. Contact details are visible only to verified premium members."],
  ["Profile Visibility", "Your profile is visible to other registered members. You may edit or request removal of your profile at any time from your dashboard."],
  ["Cookies & Sessions", "We use secure, http-only session cookies to keep you logged in. We do not use intrusive tracking cookies."],
  ["Your Rights", "You can access, update or delete your personal data at any time. Contact us at support@vasantham.com for any privacy request."],
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-extrabold text-slate-800">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().getFullYear()}</p>
        <div className="mt-8 space-y-6">
          {sections.map(([t, d], i) => (
            <section key={t} className="rounded-2xl border border-rose-100 bg-white p-6 card-shadow">
              <h2 className="font-bold text-brand">{i + 1}. {t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
