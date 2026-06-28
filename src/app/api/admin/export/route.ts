import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getUsers,
  getPayments,
  getMessages,
  getTestimonials,
  getStories,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const backup = {
    exportedAt: new Date().toISOString(),
    users: await getUsers(),
    payments: await getPayments(),
    messages: await getMessages(),
    testimonials: await getTestimonials(),
    stories: await getStories(),
  };

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="vasantham-backup-${Date.now()}.json"`,
    },
  });
}
