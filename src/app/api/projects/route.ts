import { db } from "@/db";
import { projects } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allProjects = await db.select().from(projects);
  return NextResponse.json(allProjects);
}
