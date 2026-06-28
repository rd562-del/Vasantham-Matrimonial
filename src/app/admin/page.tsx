"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";

interface Stats {
  totalUsers: number; premiumUsers: number; newRegistrations: number;
  pendingPayments: number; approvedPayments: number; rejectedPayments: number;
  activeSubs: number; expiredSubs: number; revenue: number;
}
interface UserRow {
  id: string; fullName: string; email: string; phone: string; gender: string;
  age: number; city: string; plan: string; planName: string;
  active: boolean; suspended: boolean; premium: boolean; daysRemaining: number;
  createdAt: string; photo: string;
}
interface PayRow {
  id: string; userName: string; email: string; plan: string; amount: number;
  screenshot: string; status: string; createdAt: string;
}
interface MsgRow {
  id: string; name: string; email: string; phone: string; subject: string; message: string; createdAt: string; read: boolean;
}
interface AdminData {
  stats: Stats;
  users: UserRow[];
  payments: PayRow[];
  messages: MsgRow[];
  testimonials: { id: string; name: string; location: string; text: string; photo: string }[];
  stories: { id: string; brideName: string; groomName: string; story: string; photo: string }[];
  chart: { label: string; count: number; revenue: number }[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [dark, setDark] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin");
    if (res.status === 401) { setAuthed(false); return; }
    const d = await res.json();
    setData(d);
    setAuthed(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (authed === null) return <div className="grid min-h-screen place-items-center text-brand">Loading...</div>;
  if (!authed) return <AdminLogin onLogin={load} />;
  if (!data) return <div className="grid min-h-screen place-items-center text-brand">Loading dashboard...</div>;

  return (
    <div className={dark ? "dark" : ""}>
      <Dashboard data={data} reload={load} dark={dark} setDark={setDark} />
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(d.error || "Login failed"); return; }
    onLogin();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#1a0608] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 card-shadow">
        <div className="mx-auto w-fit"><LogoMark size={56} /></div>
        <h1 className="mt-3 text-center text-2xl font-extrabold text-slate-800">Admin Login</h1>
        {err && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}
        <input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mt-5 w-full rounded-lg border border-rose-200 px-3 py-2.5 text-sm" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mt-3 w-full rounded-lg border border-rose-200 px-3 py-2.5 text-sm" />
        <button disabled={loading} className="brand-gradient mt-5 w-full rounded-full py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-center text-xs text-slate-500">
          Default: admin@vasantham.com / Admin@123
        </p>
      </form>
    </main>
  );
}

const TABS = ["Overview", "Users", "Payments", "Messages", "Content", "Broadcast", "Settings"] as const;
type Tab = (typeof TABS)[number];

function Dashboard({ data, reload, dark, setDark }: { data: AdminData; reload: () => void; dark: boolean; setDark: (v: boolean) => void }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");

  async function post(body: object) {
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    reload();
  }
  async function logout() {
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    router.refresh();
    window.location.reload();
  }

  const s = data.stats;
  const users = data.users.filter((u) =>
    [u.fullName, u.email, u.phone, u.city].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const maxChart = Math.max(1, ...data.chart.map((c) => c.count));

  return (
    <div className="min-h-screen bg-rose-50/50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between border-b border-rose-100 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2"><LogoMark size={36} /><span className="font-extrabold text-brand">Admin Panel</span></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className="rounded-full border border-rose-200 px-3 py-1 text-sm dark:border-slate-600">
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={logout} className="brand-gradient rounded-full px-4 py-1.5 text-sm font-semibold text-white">Logout</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "brand-gradient text-white" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <Stat label="Total Users" value={s.totalUsers} icon="👥" />
              <Stat label="Premium Users" value={s.premiumUsers} icon="💎" />
              <Stat label="New (7 days)" value={s.newRegistrations} icon="✨" />
              <Stat label="Pending Payments" value={s.pendingPayments} icon="🕒" />
              <Stat label="Approved Payments" value={s.approvedPayments} icon="✅" />
              <Stat label="Rejected Payments" value={s.rejectedPayments} icon="❌" />
              <Stat label="Active Subscriptions" value={s.activeSubs} icon="🟢" />
              <Stat label="Expired Subscriptions" value={s.expiredSubs} icon="🔴" />
              <Stat label="Total Revenue" value={`₹${s.revenue.toLocaleString()}`} icon="💰" />
            </div>
            <Panel title="Registrations (Last 6 Months)">
              <div className="flex items-end gap-3" style={{ height: 180 }}>
                {data.chart.map((c) => (
                  <div key={c.label} className="flex flex-1 flex-col items-center justify-end">
                    <div className="w-full rounded-t brand-gradient" style={{ height: `${(c.count / maxChart) * 140}px` }} title={`${c.count} users`} />
                    <span className="mt-2 text-xs text-slate-500">{c.label}</span>
                    <span className="text-xs font-bold text-brand">{c.count}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </>
        )}

        {tab === "Users" && (
          <Panel title={`Users (${users.length})`}>
            <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-full max-w-sm rounded-lg border border-rose-200 px-3 py-2 text-sm dark:bg-slate-700" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr><th className="p-2">User</th><th className="p-2">Plan</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-rose-50 dark:border-slate-700">
                      <td className="p-2">
                        <div className="font-semibold">{u.fullName}</div>
                        <div className="text-xs text-slate-400">{u.email} • {u.gender}, {u.age} • {u.city}</div>
                      </td>
                      <td className="p-2">{u.planName}<div className="text-xs text-slate-400">{u.daysRemaining}d left</div></td>
                      <td className="p-2">
                        {u.suspended ? <Badge c="red">Suspended</Badge> : u.active ? <Badge c="green">Active</Badge> : <Badge c="amber">Unverified</Badge>}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {!u.active && <Btn onClick={() => post({ action: "user-action", op: "approve", id: u.id })}>Approve</Btn>}
                          <Btn onClick={() => post({ action: "user-action", op: "suspend", id: u.id })}>{u.suspended ? "Unsuspend" : "Suspend"}</Btn>
                          <select onChange={(e) => e.target.value && post({ action: "user-action", op: "set-plan", id: u.id, plan: e.target.value })}
                            defaultValue="" className="rounded border border-rose-200 px-1 text-xs dark:bg-slate-700">
                            <option value="">Plan…</option>
                            <option value="free">Free</option><option value="silver">Silver</option>
                            <option value="gold">Gold</option><option value="diamond">Diamond</option>
                          </select>
                          <Btn danger onClick={() => confirm(`Delete ${u.fullName}?`) && post({ action: "user-action", op: "delete", id: u.id })}>Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        {tab === "Payments" && (
          <Panel title={`Payments (${data.payments.length})`}>
            <div className="grid gap-4 md:grid-cols-2">
              {data.payments.length === 0 && <p className="text-sm text-slate-400">No payments yet.</p>}
              {data.payments.map((p) => (
                <div key={p.id} className="rounded-xl border border-rose-100 p-4 dark:border-slate-700">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{p.userName}</div>
                      <div className="text-xs text-slate-400">{p.email}</div>
                      <div className="mt-1 text-sm">{p.plan.toUpperCase()} • ₹{p.amount}</div>
                    </div>
                    <Badge c={p.status === "approved" ? "green" : p.status === "rejected" ? "red" : "amber"}>{p.status}</Badge>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.screenshot && <img src={p.screenshot} alt="" className="mt-3 h-40 w-full rounded-lg object-contain bg-rose-50" />}
                  {p.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <Btn onClick={() => post({ action: "payment-action", op: "approve", id: p.id })}>Approve</Btn>
                      <Btn danger onClick={() => post({ action: "payment-action", op: "reject", id: p.id })}>Reject</Btn>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "Messages" && (
          <Panel title={`Messages (${data.messages.length})`}>
            <div className="space-y-3">
              {data.messages.length === 0 && <p className="text-sm text-slate-400">No messages yet.</p>}
              {data.messages.map((m) => (
                <div key={m.id} className="rounded-xl border border-rose-100 p-4 dark:border-slate-700">
                  <div className="flex justify-between">
                    <div className="font-semibold">{m.name} <span className="text-xs font-normal text-slate-400">• {m.email} {m.phone}</span></div>
                    <Btn danger onClick={() => post({ action: "message-action", op: "delete", id: m.id })}>Delete</Btn>
                  </div>
                  <div className="text-xs font-semibold text-brand">{m.subject}</div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{m.message}</p>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "Content" && <ContentTab data={data} post={post} />}

        {tab === "Broadcast" && <BroadcastTab post={post} />}

        {tab === "Settings" && <SettingsTab post={post} />}
      </div>
    </div>
  );
}

function ContentTab({ data, post }: { data: AdminData; post: (b: object) => void }) {
  const [t, setT] = useState({ name: "", location: "", text: "", photo: "" });
  const [st, setSt] = useState({ brideName: "", groomName: "", story: "", photo: "", marriedOn: "" });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Testimonials">
        <div className="space-y-2">
          {data.testimonials.map((x) => (
            <div key={x.id} className="flex items-center justify-between rounded-lg border border-rose-100 p-2 text-sm dark:border-slate-700">
              <span>{x.name} — {x.location}</span>
              <Btn danger onClick={() => post({ action: "testimonial-delete", id: x.id })}>Del</Btn>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <In v={t.name} set={(v) => setT({ ...t, name: v })} ph="Couple name" />
          <In v={t.location} set={(v) => setT({ ...t, location: v })} ph="Location" />
          <In v={t.photo} set={(v) => setT({ ...t, photo: v })} ph="Photo URL" />
          <In v={t.text} set={(v) => setT({ ...t, text: v })} ph="Testimonial text" />
          <Btn onClick={() => { post({ action: "testimonial-add", ...t }); setT({ name: "", location: "", text: "", photo: "" }); }}>Add Testimonial</Btn>
        </div>
      </Panel>
      <Panel title="Success Stories">
        <div className="space-y-2">
          {data.stories.map((x) => (
            <div key={x.id} className="flex items-center justify-between rounded-lg border border-rose-100 p-2 text-sm dark:border-slate-700">
              <span>{x.brideName} &amp; {x.groomName}</span>
              <Btn danger onClick={() => post({ action: "story-delete", id: x.id })}>Del</Btn>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <In v={st.brideName} set={(v) => setSt({ ...st, brideName: v })} ph="Bride name" />
          <In v={st.groomName} set={(v) => setSt({ ...st, groomName: v })} ph="Groom name" />
          <In v={st.photo} set={(v) => setSt({ ...st, photo: v })} ph="Photo URL" />
          <In v={st.story} set={(v) => setSt({ ...st, story: v })} ph="Story" />
          <Btn onClick={() => { post({ action: "story-add", ...st }); setSt({ brideName: "", groomName: "", story: "", photo: "", marriedOn: "" }); }}>Add Story</Btn>
        </div>
      </Panel>
    </div>
  );
}

function BroadcastTab({ post }: { post: (b: object) => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Panel title="Send Email Notification to All Users">
      <In v={subject} set={setSubject} ph="Subject" />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Message"
        className="mt-2 w-full rounded-lg border border-rose-200 px-3 py-2 text-sm dark:bg-slate-700" />
      <Btn onClick={() => { post({ action: "broadcast", subject, message }); setDone(true); }}>Send Broadcast</Btn>
      {done && <p className="mt-2 text-sm text-emerald-600">Broadcast queued (written to mail log).</p>}
    </Panel>
  );
}

function SettingsTab({ post }: { post: (b: object) => void }) {
  const [pw, setPw] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Panel title="Admin Settings">
      <p className="text-sm text-slate-500">Change admin password</p>
      <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password"
        className="mt-2 w-full max-w-xs rounded-lg border border-rose-200 px-3 py-2 text-sm dark:bg-slate-700" />
      <div className="mt-2"><Btn onClick={() => { if (pw.length >= 6) { post({ action: "change-password", password: pw }); setDone(true); setPw(""); } }}>Update Password</Btn></div>
      {done && <p className="mt-2 text-sm text-emerald-600">Password updated.</p>}
      <div className="mt-6">
        <p className="text-sm text-slate-500">Data Backup</p>
        <a href="/api/admin/export" className="brand-gradient mt-2 inline-block rounded-full px-4 py-2 text-sm font-semibold text-white">Export / Backup JSON</a>
      </div>
    </Panel>
  );
}

function Stat({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-5 card-shadow dark:border-slate-700 dark:bg-slate-800">
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 text-2xl font-extrabold text-brand">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl border border-rose-100 bg-white p-5 card-shadow dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
function Badge({ c, children }: { c: "green" | "red" | "amber"; children: React.ReactNode }) {
  const m = { green: "bg-emerald-100 text-emerald-700", red: "bg-red-100 text-red-600", amber: "bg-amber-100 text-amber-700" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m[c]}`}>{children}</span>;
}
function Btn({ children, onClick, danger }: { children: React.ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${danger ? "bg-red-500" : "brand-gradient"}`}>
      {children}
    </button>
  );
}
function In({ v, set, ph }: { v: string; set: (s: string) => void; ph: string }) {
  return <input value={v} onChange={(e) => set(e.target.value)} placeholder={ph}
    className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm dark:bg-slate-700" />;
}
