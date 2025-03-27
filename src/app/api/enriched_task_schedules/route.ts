import { db } from "@/db";
import { projects, tasks, taskSchedules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const enriched = await db
      .select({
        id: taskSchedules.id,
        taskId: taskSchedules.taskId,
        scheduledStart: taskSchedules.scheduledStart,
        scheduledEnd: taskSchedules.scheduledEnd,
        taskTitle: tasks.title,
        projectName: projects.name,
        projectColor: projects.color,
      })
      .from(taskSchedules)
      .leftJoin(tasks, eq(tasks.id, taskSchedules.taskId))
      .leftJoin(projects, eq(projects.id, tasks.projectId));

    return NextResponse.json(enriched);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch enriched task schedules: ${error}` },
      { status: 500 }
    );
  }
}
