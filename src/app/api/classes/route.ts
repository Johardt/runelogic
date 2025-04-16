import { db } from "@/db";
import { classes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const className = url.searchParams.get("className");
  try {
    let result;
    if (className) {
      // Only return a specific character sheet
      result = await db
        .select()
        .from(classes)
        .where(eq(classes.className, className));
    } else {
      // Return all classes
      result = await db.select().from(classes);
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch classes",
        details: String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
