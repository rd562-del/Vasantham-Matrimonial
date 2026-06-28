import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  getSession,
  createSession,
  destroySession,
  checkAdminCredentials,
} from "@/lib/auth";
import {
  getUsers,
  saveUsers,
  getPayments,
  savePayments,
  getMessages,
  saveMessages,
  getTestimonials,
  saveTestimonials,
  getStories,
  saveStories,
} from "@/lib/store";
import {
  calcAge,
  isMembershipActive,
  sendMail,
  daysRemaining,
} from "@/lib/helpers";
import { PLAN_DETAILS, type Plan } from "@/lib/types";

export const dynamic = "force-dynamic";

const SETTINGS = path.join(process.cwd(), "data", "settings.json");

async function readSettings(): Promise<{ adminPassword?: string }> {
  try {
    return JSON.parse(await fs.readFile(SETTINGS, "utf-8"));
  } catch {
    return {};
  }
}
async function writeSettings(s: object) {
  await fs.mkdir(path.dirname(SETTINGS), { recursive: true });
  await fs.writeFile(SETTINGS, JSON.stringify(s, null, 2));
}

async function requireAdmin() {
  const s = await getSession();
  return s && s.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await getUsers();
  const payments = await getPayments();
  const messages = await getMessages();
  const testimonials = await getTestimonials();
  const stories = await getStories();

  const premium = users.filter(
    (u) => u.plan !== "free" && isMembershipActive(u)
  );
  const newReg = users.filter(
    (u) => Date.now() - new Date(u.createdAt).getTime() < 7 * 86400000
  );
  const revenue = payments
    .filter((p) => p.status === "approved")
    .reduce((s, p) => s + p.amount, 0);

  const stats = {
    totalUsers: users.length,
    premiumUsers: premium.length,
    newRegistrations: newReg.length,
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    approvedPayments: payments.filter((p) => p.status === "approved").length,
    rejectedPayments: payments.filter((p) => p.status === "rejected").length,
    activeSubs: users.filter((u) => isMembershipActive(u)).length,
    expiredSubs: users.filter((u) => !isMembershipActive(u)).length,
    revenue,
  };

  const userRows = users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    gender: u.gender,
    age: calcAge(u.dob),
    city: u.city,
    plan: u.plan,
    planName: PLAN_DETAILS[u.plan].name,
    active: u.active,
    suspended: u.suspended,
    premium: u.plan !== "free" && isMembershipActive(u),
    daysRemaining: daysRemaining(u.membershipExpiry),
    createdAt: u.createdAt,
    photo: u.photo,
  }));

  // 6-month registration chart
  const chart: { label: string; count: number; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleString("en", { month: "short" });
    const m = d.getMonth();
    const y = d.getFullYear();
    chart.push({
      label,
      count: users.filter((u) => {
        const c = new Date(u.createdAt);
        return c.getMonth() === m && c.getFullYear() === y;
      }).length,
      revenue: payments
        .filter((p) => {
          const c = new Date(p.createdAt);
          return (
            p.status === "approved" &&
            c.getMonth() === m &&
            c.getFullYear() === y
          );
        })
        .reduce((s, p) => s + p.amount, 0),
    });
  }

  return NextResponse.json({
    stats,
    users: userRows,
    payments: payments.slice().reverse(),
    messages: messages.slice().reverse(),
    testimonials,
    stories,
    chart,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "login") {
    const settings = await readSettings();
    const ok =
      checkAdminCredentials(body.email || "", body.password || "") ||
      (settings.adminPassword &&
        (body.email || "").toLowerCase() ===
          (process.env.ADMIN_EMAIL || "admin@vasantham.com").toLowerCase() &&
        body.password === settings.adminPassword);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    await createSession({ role: "admin", id: "admin" });
    return NextResponse.json({ ok: true });
  }
  if (action === "logout") {
    await destroySession();
    return NextResponse.json({ ok: true });
  }

  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (action === "change-password") {
    if (!body.password || body.password.length < 6)
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    await writeSettings({ adminPassword: body.password });
    return NextResponse.json({ ok: true });
  }

  if (action === "user-action") {
    const users = await getUsers();
    const idx = users.findIndex((u) => u.id === body.id);
    if (idx === -1)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const u = users[idx];
    switch (body.op) {
      case "delete":
        users.splice(idx, 1);
        await saveUsers(users);
        return NextResponse.json({ ok: true });
      case "suspend":
        u.suspended = !u.suspended;
        break;
      case "approve":
        u.active = true;
        u.verifiedBadge = true;
        break;
      case "set-plan": {
        const plan = body.plan as Plan;
        if (PLAN_DETAILS[plan]) {
          u.plan = plan;
          u.premiumBadge = plan !== "free";
          u.membershipExpiry = new Date(
            Date.now() + PLAN_DETAILS[plan].days * 86400000
          ).toISOString();
        }
        break;
      }
      case "edit":
        if (typeof body.fullName === "string") u.fullName = body.fullName;
        if (typeof body.email === "string") u.email = body.email;
        if (typeof body.phone === "string") u.phone = body.phone;
        if (typeof body.city === "string") u.city = body.city;
        break;
    }
    users[idx] = u;
    await saveUsers(users);
    return NextResponse.json({ ok: true });
  }

  if (action === "payment-action") {
    const payments = await getPayments();
    const p = payments.find((x) => x.id === body.id);
    if (!p)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if (body.op === "approve") {
      p.status = "approved";
      p.reviewedAt = new Date().toISOString();
      const users = await getUsers();
      const u = users.find((x) => x.id === p.userId);
      if (u) {
        u.plan = p.plan;
        u.premiumBadge = true;
        u.membershipExpiry = new Date(
          Date.now() + PLAN_DETAILS[p.plan].days * 86400000
        ).toISOString();
        await saveUsers(users);
        await sendMail(
          u.email,
          "Payment approved ✅",
          `Your ${PLAN_DETAILS[p.plan].name} membership is now active!`
        );
      }
    } else if (body.op === "reject") {
      p.status = "rejected";
      p.reviewedAt = new Date().toISOString();
      await sendMail(
        p.email,
        "Payment rejected",
        `Your payment for ${PLAN_DETAILS[p.plan].name} could not be verified. Please try again.`
      );
    }
    await savePayments(payments);
    return NextResponse.json({ ok: true });
  }

  if (action === "message-action") {
    const messages = await getMessages();
    if (body.op === "delete") {
      await saveMessages(messages.filter((m) => m.id !== body.id));
    } else if (body.op === "read") {
      const m = messages.find((x) => x.id === body.id);
      if (m) m.read = true;
      await saveMessages(messages);
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "testimonial-add") {
    const t = await getTestimonials();
    t.push({
      id: "t" + Date.now().toString(36),
      name: body.name || "Couple",
      location: body.location || "",
      photo: body.photo || "",
      text: body.text || "",
      rating: 5,
    });
    await saveTestimonials(t);
    return NextResponse.json({ ok: true });
  }
  if (action === "testimonial-delete") {
    const t = await getTestimonials();
    await saveTestimonials(t.filter((x) => x.id !== body.id));
    return NextResponse.json({ ok: true });
  }
  if (action === "story-add") {
    const s = await getStories();
    s.push({
      id: "s" + Date.now().toString(36),
      brideName: body.brideName || "",
      groomName: body.groomName || "",
      photo: body.photo || "",
      story: body.story || "",
      marriedOn: body.marriedOn || new Date().toISOString().slice(0, 10),
    });
    await saveStories(s);
    return NextResponse.json({ ok: true });
  }
  if (action === "story-delete") {
    const s = await getStories();
    await saveStories(s.filter((x) => x.id !== body.id));
    return NextResponse.json({ ok: true });
  }

  if (action === "broadcast") {
    const users = await getUsers();
    for (const u of users)
      await sendMail(u.email, body.subject || "Notice", body.message || "");
    return NextResponse.json({ ok: true, sent: users.length });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
