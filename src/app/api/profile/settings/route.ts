import { createClient } from "@/utils/supabase/server";
import { updateUserInfo, selectUserInfo } from "@/app/profile/actions";
import { NextResponse } from "next/server";
import { AiModelType } from "@/db/schema";

export async function GET(req: Request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userInfos = await selectUserInfo(data.user.id);
    if (userInfos.length === 0) {
      return NextResponse.json({ model: null });
    }

    return NextResponse.json({
      model: userInfos[0].ai_model,
    });
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  console.log("Received settings update request");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("Auth error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const aiApiKey = formData.get("ai_api_key") as string;
  const aiModel = formData.get("ai_model") as AiModelType;

  console.log("Updating settings for user:", data.user.id);
  console.log("API Key:", aiApiKey ? "***" : "empty");
  console.log("Model:", aiModel);

  try {
    await updateUserInfo({
      id: data.user.id,
      username: "", // Preserve existing username
      ai_api_key: aiApiKey,
      ai_model: aiModel,
    });

    console.log("Settings updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update user info:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
} 