import { db } from "@/db/index";
import { tasks } from "@/db/schema";
import { TaskAPIRequestType } from "@/lib/types/tasks";
import { NextResponse } from "next/server";

// GET: Fetch all tasks
export async function GET() {
  const allTasks = await db.select().from(tasks);
  return NextResponse.json(allTasks);
}

// POST: Create a new task
export async function POST(req: Request) {
  try {
    const {
      title,
      projectId,
      estimatedDuration,
      dueDate,
      description,
    }: TaskAPIRequestType = await req.json();

    if (!title || !projectId || !estimatedDuration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTask = await db
      .insert(tasks)
      .values({
        title,
        projectId,
        estimatedDuration,
        actualDuration: 0,
        dueDate: dueDate ?? null,
        description: description ?? null,
        completed: 0,
      })
      .returning();
    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create task: ${error}` },
      { status: 500 }
    );
  }
}
