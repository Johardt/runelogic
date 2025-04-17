import { db } from "@/db";
import { models } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(req.url);
  const modelName = searchParams.get("modelName");
  let result = null;

  if (modelName) {
    result = await db
      .select()
      .from(models)
      .where(eq(models.modelName, modelName));
  } else {
    result = await db.select().from(models);
  }

  return new NextResponse(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
