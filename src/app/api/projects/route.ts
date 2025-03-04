import { db } from "@/db";
import { projects } from "@/db/schema";
import { ProjectAPIRequestType } from "@/lib/types/projects";
import { NextResponse } from "next/server";

export async function GET() {
  const allProjects = await db.select().from(projects);
  return NextResponse.json(allProjects);
}

export async function POST(req: Request) {
  try {
    const { name, color, description }: ProjectAPIRequestType =
      await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProject = await db
      .insert(projects)
      .values({
        name,
        color,
        description,
      })
      .returning();
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create project: ${error}` },
      { status: 500 }
    );
  }
}
