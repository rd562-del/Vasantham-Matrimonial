import { NextRequest, NextResponse } from "next/server";
import { findUserById, updateUser } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import {
  toPublicUser,
  calcAge,
  isPremium,
  isMembershipActive,
  sendMail,
} from "@/lib/helpers";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const target = await findUserById(id);
  if (!target || !target.active)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const me = await getCurrentUser();
  // record visitor
  if (me && me.id !== id && !target.visitors.includes(me.id)) {
    await updateUser(id, { visitors: [...target.visitors, me.id] });
  }

  const canSeeContact = !!me && (isMembershipActive(me) || me.id === id);

  const data = {
    ...toPublicUser(target),
    age: calcAge(target.dob),
    premium: isPremium(target),
    online:
      Date.now() - new Date(target.lastActive).getTime() < 15 * 60 * 1000,
    phone: canSeeContact ? target.phone : "",
    email: canSeeContact ? target.email : "",
    canSeeContact,
    isShortlisted: me ? me.shortlisted.includes(id) : false,
    interestSent: me ? me.interestsSent.includes(id) : false,
    loggedIn: !!me,
  };
  return NextResponse.json({ profile: data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me)
    return NextResponse.json({ error: "Please login first" }, { status: 401 });
  const target = await findUserById(id);
  if (!target)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "shortlist") {
    const has = me.shortlisted.includes(id);
    await updateUser(me.id, {
      shortlisted: has
        ? me.shortlisted.filter((x) => x !== id)
        : [...me.shortlisted, id],
    });
    return NextResponse.json({ ok: true, shortlisted: !has });
  }

  if (action === "interest") {
    if (!isMembershipActive(me) && me.interestsSent.length >= 3)
      return NextResponse.json(
        { error: "Free trial expired. Upgrade to send unlimited interests." },
        { status: 403 }
      );
    if (!me.interestsSent.includes(id)) {
      await updateUser(me.id, {
        interestsSent: [...me.interestsSent, id],
      });
      await updateUser(id, {
        interestsReceived: [...target.interestsReceived, me.id],
      });
      await sendMail(
        target.email,
        "Someone is interested in you 💖",
        `${me.fullName} has expressed interest in your profile on Vasantham Matrimonial.`
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "report") {
    await sendMail(
      "admin@vasantham.com",
      "Profile reported",
      `${me.fullName} (${me.id}) reported profile ${id}. Reason: ${
        body.reason || "n/a"
      }`
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
