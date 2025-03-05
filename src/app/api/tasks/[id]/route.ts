import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Fetch specific task by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const task = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, Number(params.id)));
  return NextResponse.json(task[0] || {});
}

// PUT: Update a task
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { title, estimatedDuration, completed } = await req.json();
  const updatedTask = await db
    .update(tasks)
    .set({ title, estimatedDuration, completed: completed ? 1 : 0 })
    .where(eq(tasks.id, Number(params.id)))
    .returning();
  return NextResponse.json({
    task: updatedTask[0],
    message: "Task updated successfully!",
  });
}

// DELETE: Delete a task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.delete(tasks).where(eq(tasks.id, Number(params.id)));
  return NextResponse.json({ message: "Task deleted successfully" });
}
