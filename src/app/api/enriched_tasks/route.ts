import { db } from "@/db";
import { projects, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const enrichedTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        projectId: tasks.projectId,
        estimatedDuration: tasks.estimatedDuration,
        completed: tasks.completed,
        dueDate: tasks.dueDate,
        priority: tasks.priority,
        projectName: projects.name,
        projectColor: projects.color,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id));

    return NextResponse.json(enrichedTasks);
  } catch (error) {
    console.error("[ENRICHED_TASKS_GET] Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch enriched tasks." },
      { status: 500 }
    );
  }
}
