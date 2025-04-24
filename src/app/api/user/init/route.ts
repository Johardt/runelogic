import { getUserInfo, insertUserInfo } from "@/db/services/userInfos";
import { getUser } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { error, user } = await getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await getUserInfo(user.id);
  if (!existing) {
    console.log("Creating new user info for " + user.id);
    await insertUserInfo(user.id);
    return NextResponse.json({ created: true }, { status: 201 });
  }

  return NextResponse.json({ created: false }, { status: 200 });
}
