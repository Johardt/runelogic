import { getUser } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUserInfo, updateUserInfoSecure } from "@/db/services/userInfos";
import { userSettingsSchema } from "@/db/validators/userInfos";

export async function GET() {
  const { error, user } = await getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [userInfo] = await getUserInfo(user.id);
    if (!userInfo) {
      return NextResponse.json({ model: null });
    }

    return NextResponse.json({
      model: userInfo.aiModel,
      apiKey: userInfo.openaiApiKey,
      googleApiKey: userInfo.googleApiKey,
    });
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const values = {
    openaiApiKey: formData.get("openaiApiKey")?.toString() ?? null,
    googleApiKey: formData.get("googleApiKey")?.toString() ?? null,
    aiModel: formData.get("aiModel")?.toString() ?? null,
  };

  const parsed = userSettingsSchema.safeParse(values);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await updateUserInfoSecure({
      id: user.id,
      username: undefined,
      ...parsed.data,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update user info:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
