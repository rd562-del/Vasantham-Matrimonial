import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import {
  getUsers,
  updateUser,
  getPayments,
  savePayments,
  findUserById,
} from "@/lib/store";
import {
  toPublicUser,
  calcAge,
  daysRemaining,
  isMembershipActive,
  profileCompletion,
  sendMail,
} from "@/lib/helpers";
import { PLAN_DETAILS, type Payment, type Plan } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await getCurrentUser();
  if (!me)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const users = await getUsers();
  const mini = (id: string) => {
    const u = users.find((x) => x.id === id);
    if (!u) return null;
    return {
      id: u.id,
      fullName: u.fullName,
      photo: u.photo,
      city: u.city,
      occupation: u.occupation,
      age: calcAge(u.dob),
    };
  };

  const visitors = me.visitors.map(mini).filter(Boolean);
  const interested = me.interestsReceived.map(mini).filter(Boolean);
  const shortlisted = me.shortlisted.map(mini).filter(Boolean);

  const matches = users
    .filter(
      (u) =>
        u.active &&
        !u.suspended &&
        u.id !== me.id &&
        u.gender !== me.gender &&
        (u.religion === me.religion || u.motherTongue === me.motherTongue)
    )
    .slice(0, 6)
    .map((u) => mini(u.id));

  const payments = await getPayments();
  const myPayment = payments
    .filter((p) => p.userId === me.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  return NextResponse.json({
    user: { ...toPublicUser(me), age: calcAge(me.dob) },
    stats: {
      completion: profileCompletion(me),
      membershipActive: isMembershipActive(me),
      plan: me.plan,
      planName: PLAN_DETAILS[me.plan].name,
      daysRemaining: daysRemaining(me.membershipExpiry),
      visitorCount: me.visitors.length,
      interestedCount: me.interestsReceived.length,
      shortlistedCount: me.shortlisted.length,
    },
    visitors,
    interested,
    shortlisted,
    matches,
    pendingPayment: myPayment || null,
  });
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "update") {
    const allowed = [
      "fullName",
      "religion",
      "caste",
      "subCaste",
      "motherTongue",
      "education",
      "occupation",
      "annualIncome",
      "height",
      "weight",
      "maritalStatus",
      "city",
      "state",
      "country",
      "phone",
      "bio",
      "family",
      "lifestyle",
      "photo",
    ];
    const patch: Record<string, unknown> = {};
    for (const k of allowed) if (k in body) patch[k] = body[k];
    if (typeof patch.photo === "string" && patch.photo) {
      patch.gallery = [patch.photo, ...me.gallery.filter((g) => g !== patch.photo)].slice(0, 6);
    }
    await updateUser(me.id, patch);
    return NextResponse.json({ ok: true });
  }

  if (action === "password") {
    if (!verifyPassword(body.current || "", me.passwordHash))
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    if (!body.password || body.password.length < 6)
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    await updateUser(me.id, { passwordHash: hashPassword(body.password) });
    return NextResponse.json({ ok: true });
  }

  if (action === "payment") {
    const plan = body.plan as Plan;
    if (!PLAN_DETAILS[plan] || plan === "free")
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    if (!body.screenshot)
      return NextResponse.json(
        { error: "Please upload your payment screenshot" },
        { status: 400 }
      );
    const payments = await getPayments();
    const payment: Payment = {
      id: "p" + Date.now().toString(36),
      userId: me.id,
      userName: me.fullName,
      email: me.email,
      plan,
      amount: PLAN_DETAILS[plan].price,
      screenshot: body.screenshot,
      status: "pending",
      createdAt: new Date().toISOString(),
      reviewedAt: null,
    };
    payments.push(payment);
    await savePayments(payments);
    await sendMail(
      "admin@vasantham.com",
      "New payment submitted",
      `${me.fullName} submitted payment for ${PLAN_DETAILS[plan].name}.`
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

void findUserById;
