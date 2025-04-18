import { NextRequest, NextResponse } from "next/server";
import { getAllClasses, getClassByName } from "@/db/services/classes";
import { classNameQuerySchema } from "@/db/validators/classes";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = classNameQuerySchema.safeParse({
    className: searchParams.get("className"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data.className
      ? await getClassByName(parsed.data.className)
      : await getAllClasses();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch class data:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes", details: String(error) },
      { status: 500 },
    );
  }
}
