import { db } from "@/db";
import { deepWorkSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { taskId, startTime, endTime, sessionDuration, notes } =
      await req.json();

    if (!taskId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updated = await db
      .update(deepWorkSessions)
      .set({ taskId, startTime, endTime, sessionDuration, notes: notes || "" })
      .where(eq(deepWorkSessions.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to udpate session: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    await db.delete(deepWorkSessions).where(eq(deepWorkSessions.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to delete session: ${error}`,
      },
      { status: 500 }
    );
  }
}
