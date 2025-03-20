"use client";

import { format, getHours, getMinutes } from "date-fns";
import { SessionData } from "./CalendarPanel";
import { formatDuration } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface DailyScheduleProps {
  sessions: SessionData[];
}

export default function DailySchedule({ sessions }: DailyScheduleProps) {
  if (!Array.isArray(sessions)) {
    console.error("DailySchedule received invalid session data:", sessions);
    return <div className="text-red-500">Error: Invalid session data</div>;
  }

  const HOUR_HEIGHT = 80;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getSessionStyle = (session: SessionData) => {
    // TODO: Fix height calculations and UI
    const startHour = getHours(session.startTime);
    const startMinute = getMinutes(session.startTime);

    const pixelsPerMinute = HOUR_HEIGHT / 60; // Each hour spans 80px

    const topPosition = (startHour * 60 + startMinute) * pixelsPerMinute;
    const height = (session.sessionDuration / 60) * pixelsPerMinute;

    return {
      top: `${topPosition}px`,
      height: `${height}px`,
      backgroundColor: session.projectColor,
      left: "12%",
      width: "85%",
      maxWidth: "90%",
    };
  };

  return (
    <div className="relative h-full w-full bg-gray-800 rounded-md p-4 overflow-y-auto overflow-x-hidden">
      {/* TIMELINE GRID */}
      <div className="relative w-full h-full ">
        {hours.map((hour) => (
          <div
            key={hour}
            className={`relative h-[${HOUR_HEIGHT}px] flex items-start`}
          >
            <span className="absolute text-xs text-gray-400">
              {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
            </span>
            <div className="absolute w-full border-t border-gray-700 opacity-50" />
          </div>
        ))}
      </div>

      {/* RENDER DEEP WORK SESSIONS */}
      {sessions.length > 0 &&
        sessions.map((session) => (
          <HoverCard key={session.id}>
            <HoverCardTrigger asChild>
              <div
                className="absolute rounded-md text-sm p-1 text-white shadow-md flex justify-between overflow-hidden text-ellipsis"
                style={getSessionStyle(session)}
              >
                <p className="font-bold">{session.taskTitle}</p>
                <p className="font-semibold">
                  {formatDuration(session.sessionDuration)}
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="bg-gray-900 border border-gray-700 shadow-lg rounded-lg p-3 w-auto min-w-80 text-white">
              <div className="flex justify-between items-start mb-1">
                <div className="flex flex-col">
                  <p
                    className="text-sm font-bold"
                    style={{ color: session.projectColor }}
                  >
                    {session.projectName}
                  </p>
                  <p>{session.taskTitle}</p>
                </div>
                <p className="text-sm font-semibold">
                  {format(session.startTime, "HH:mm")} -{" "}
                  {format(session.endTime, "HH:mm")}
                </p>
              </div>
              <p className="text-slate-300 text-xs">
                {session.notes || "No notes added."}
              </p>
            </HoverCardContent>
          </HoverCard>
        ))}
    </div>
  );
}
