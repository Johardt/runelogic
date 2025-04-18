import { fetchModels } from "@/db/services/models";
import { getUser } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const modelName = new URL(req.url).searchParams.get("modelName");
  const result = await fetchModels(modelName ?? undefined);

  return NextResponse.json(result);
}
