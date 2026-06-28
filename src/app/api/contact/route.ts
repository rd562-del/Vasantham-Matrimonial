import { NextRequest, NextResponse } from "next/server";
import { getMessages, saveMessages } from "@/lib/store";
import { sendMail } from "@/lib/helpers";
import type { ContactMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (!b.name || !b.email || !b.message)
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 }
    );
  if (!/^\S+@\S+\.\S+$/.test(b.email))
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  const messages = await getMessages();
  const msg: ContactMessage = {
    id: "m" + Date.now().toString(36),
    name: String(b.name).slice(0, 120),
    email: String(b.email).slice(0, 160),
    phone: String(b.phone || "").slice(0, 40),
    subject: String(b.subject || "General Enquiry").slice(0, 160),
    message: String(b.message).slice(0, 2000),
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.push(msg);
  await saveMessages(messages);
  await sendMail(
    "support@vasantham.com",
    "New contact message",
    `${msg.name} (${msg.email}): ${msg.message}`
  );
  return NextResponse.json({ ok: true });
}
