import { db } from "@/db/index";
import { taskSchedules } from "@/db/schema";
import { NextResponse } from "next/server";

// GET: Fetch all task schedules
export async function GET() {
  const allSchedules = await db.select().from(taskSchedules);
  return NextResponse.json(allSchedules);
}

// POST: Schedule a new task schedule
export async function POST(req: Request) {
  const { taskId, scheduledStart, scheduledEnd } = await req.json();
  const newSchedule = await db
    .insert(taskSchedules)
    .values({
      taskId,
      scheduledStart,
      scheduledEnd,
      actualStart: 0,
      actualEnd: 0,
    })
    .returning();
  return NextResponse.json(newSchedule);
}
