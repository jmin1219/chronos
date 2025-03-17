import { db } from "@/db";
import { deepWorkSessions } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allSessions = await db.select().from(deepWorkSessions);
    return NextResponse.json(allSessions);
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch deepwork sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { taskId, startTime, endTime, sessionDuration, notes } =
      await req.json();

    if (!taskId || !startTime || !endTime || !sessionDuration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSession = await db
      .insert(deepWorkSessions)
      .values({
        taskId,
        startTime,
        endTime,
        sessionDuration,
        notes: notes || "",
      })
      .returning();

    return NextResponse.json(newSession);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to save session: ${error}` },
      { status: 500 }
    );
  }
}
