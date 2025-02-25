import { db } from "@/db/index";
import { tasks } from "@/db/schema";
import { NextResponse } from "next/server";

// GET: Fetch all tasks
export async function GET() {
  const allTasks = await db.select().from(tasks);
  return NextResponse.json(allTasks);
}

// POST: Create a new task
export async function POST(req: Request) {
  const { title, projectId, estimatedDuration } = await req.json();
  const newTask = await db
    .insert(tasks)
    .values({
      title,
      projectId,
      estimatedDuration,
      actualDuration: 0,
      completed: 0,
    })
    .returning();
  return NextResponse.json(newTask);
}
