import { Header, Footer } from "@/components/Chrome";

export const metadata = { title: "Terms & Conditions — Vasantham Matrimonial" };

const sections: [string, string][] = [
  ["Eligibility", "You must be of legal marriageable age and legally permitted to marry to use Vasantham Matrimonial. Profiles must belong to real individuals seeking marriage."],
  ["Account Responsibility", "You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account."],
  ["Acceptable Use", "You agree not to misuse the platform, harass other members, post false information, or use the service for any unlawful purpose."],
  ["Membership & Payments", "Free trial lasts 15 days. Paid memberships activate after admin verification of your payment. Fees are non-refundable once a plan is activated."],
  ["Content & Conduct", "You retain ownership of your content but grant us a licence to display it on your profile. We may remove content or suspend accounts that violate these terms."],
  ["Limitation of Liability", "Vasantham Matrimonial is a facilitation platform. We do not guarantee marriage outcomes and are not liable for interactions between members."],
  ["Changes to Terms", "We may update these terms periodically. Continued use of the platform constitutes acceptance of the revised terms."],
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-extrabold text-slate-800">Terms &amp; Conditions</h1>
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
