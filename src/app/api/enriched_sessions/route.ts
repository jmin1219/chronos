import { db } from "@/db";
import { deepWorkSessions, projects, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const enrichedSessions = await db
      .select({
        id: deepWorkSessions.id,
        startTime: deepWorkSessions.startTime,
        endTime: deepWorkSessions.endTime,
        sessionDuration: deepWorkSessions.sessionDuration,
        notes: deepWorkSessions.notes,
        taskId: tasks.id,
        taskTitle: tasks.title,
        projectId: projects.id,
        projectName: projects.name,
        projectColor: projects.color,
      })
      .from(deepWorkSessions)
      .leftJoin(tasks, eq(deepWorkSessions.taskId, tasks.id))
      .leftJoin(projects, eq(tasks.projectId, projects.id));

    return NextResponse.json(enrichedSessions);
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch enriched sessions." },
      { status: 500 }
    );
  }
}
