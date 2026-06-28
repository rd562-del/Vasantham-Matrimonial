import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { toPublicUser, calcAge, isPremium, isMembershipActive } from "@/lib/helpers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const me = await getCurrentUser();
  const sp = req.nextUrl.searchParams;
  const users = await getUsers();

  let list = users.filter((u) => u.active && !u.suspended && u.approved);

  // show opposite gender to logged-in users; otherwise show all
  if (me) {
    list = list.filter((u) => u.id !== me.id && u.gender !== me.gender);
  }

  const q = sp.get("q")?.toLowerCase();
  if (q)
    list = list.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.occupation.toLowerCase().includes(q) ||
        u.caste.toLowerCase().includes(q)
    );

  const gender = sp.get("gender");
  if (gender) list = list.filter((u) => u.gender === gender);

  const religion = sp.get("religion");
  if (religion) list = list.filter((u) => u.religion === religion);

  const caste = sp.get("caste");
  if (caste)
    list = list.filter((u) =>
      u.caste.toLowerCase().includes(caste.toLowerCase())
    );

  const education = sp.get("education");
  if (education)
    list = list.filter((u) =>
      u.education.toLowerCase().includes(education.toLowerCase())
    );

  const occupation = sp.get("occupation");
  if (occupation)
    list = list.filter((u) =>
      u.occupation.toLowerCase().includes(occupation.toLowerCase())
    );

  const location = sp.get("location");
  if (location) {
    const l = location.toLowerCase();
    list = list.filter(
      (u) =>
        u.city.toLowerCase().includes(l) || u.state.toLowerCase().includes(l)
    );
  }

  const minAge = parseInt(sp.get("minAge") || "");
  const maxAge = parseInt(sp.get("maxAge") || "");
  if (!isNaN(minAge)) list = list.filter((u) => calcAge(u.dob) >= minAge);
  if (!isNaN(maxAge)) list = list.filter((u) => calcAge(u.dob) <= maxAge);

  if (sp.get("premium") === "1")
    list = list.filter((u) => u.plan !== "free" && isMembershipActive(u));

  if (sp.get("online") === "1") {
    const cutoff = Date.now() - 15 * 60 * 1000;
    list = list.filter((u) => new Date(u.lastActive).getTime() > cutoff);
  }

  const sort = sp.get("sort");
  if (sort === "recent")
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  else
    list.sort((a, b) => (isPremium(b) ? 1 : 0) - (isPremium(a) ? 1 : 0));

  const data = list.map((u) => ({
    ...toPublicUser(u),
    age: calcAge(u.dob),
    premium: isPremium(u),
    online: Date.now() - new Date(u.lastActive).getTime() < 15 * 60 * 1000,
  }));

  return NextResponse.json({ profiles: data, count: data.length });
}
