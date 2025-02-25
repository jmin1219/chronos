import { db } from "@/db";
import { taskSchedules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Fetch specific task by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const schedule = await db
    .select()
    .from(taskSchedules)
    .where(eq(taskSchedules.id, Number(params.id)));
  return NextResponse.json(schedule[0] || {});
}

// PUT: Update or reschedule a scheduled task
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { scheduledStart, scheduledEnd } = await req.json();
  await db
    .update(taskSchedules)
    .set({ scheduledStart, scheduledEnd })
    .where(eq(taskSchedules.id, Number(params.id)));
  return NextResponse.json({ message: "Scheduled task updated successfully!" });
}

// DELETE: Delete a task schedule instance
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.delete(taskSchedules).where(eq(taskSchedules.id, Number(params.id)));
  return NextResponse.json({ message: "Task schedule deleted successfully" });
}
