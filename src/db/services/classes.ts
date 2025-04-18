import { db } from "@/db";
import { classes, InsertClass } from "@/db/schemas/classes";
import { eq } from "drizzle-orm";

export async function getAllClasses() {
  return db.select().from(classes);
}

export async function getClassByName(className: string) {
  return db.select().from(classes).where(eq(classes.className, className));
}

export async function insertClass(data: InsertClass) {
  return db.insert(classes).values(data).returning();
}
