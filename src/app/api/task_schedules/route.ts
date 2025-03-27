import { db } from "@/db/index";
import { taskSchedules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Fetch all task schedules
export async function GET() {
  try {
    const schedules = await db.select().from(taskSchedules);
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch task schedules: ${error}` },
      { status: 500 }
    );
  }
}

// POST: Schedule a new task schedule
export async function POST(req: Request) {
  try {
    const { taskId, scheduledStart, scheduledEnd } = await req.json();

    if (!taskId || !scheduledStart || !scheduledEnd) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSchedule = await db
      .insert(taskSchedules)
      .values({
        taskId,
        scheduledStart,
        scheduledEnd,
      })
      .returning();
    return NextResponse.json(newSchedule);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create and save task schedules: ${error}` },
      { status: 500 }
    );
  }
}

// POST: Schedule a new task schedule
export async function PATCH(req: Request) {
  try {
    const { id, updates } = await req.json();

    if (!id || !updates) {
      return NextResponse.json(
        { error: "Missing task ID or updates" },
        { status: 400 }
      );
    }

    const updateSchedule = await db
      .update(taskSchedules)
      .set(updates)
      .where(eq(taskSchedules.id, id))
      .returning();

    return NextResponse.json(updateSchedule);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update task schedules: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "Missing Id" }, { status: 400 });

    const deletedSchedule = await db
      .delete(taskSchedules)
      .where(eq(taskSchedules.id, id))
      .returning();

    return NextResponse.json(deletedSchedule);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete task schedules: ${error}` },
      { status: 500 }
    );
  }
}
