"use client";

import { format, getHours, getMinutes } from "date-fns";
import { SessionData } from "./CalendarPanel";

interface DailyScheduleProps {
  sessions: SessionData[];
}

export default function DailySchedule({ sessions }: DailyScheduleProps) {
  if (!Array.isArray(sessions)) {
    console.error("DailySchedule received invalid session data:", sessions);
    return <div className="text-red-500">Error: Invalid session data</div>;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getSessionStyle = (session: SessionData) => {
    const duration = session.sessionDuration;
    const startHour = getHours(session.startTime);
    const startMinute = getMinutes(session.startTime);
    const topPosition = (startHour * 60 + startMinute) / 60;
    const height = duration / 60;

    return {
      top: `${topPosition * 80}px`,
      height: `${height / 80}px`,
      backgroundColor: session.projectColor,
    };
  };

  return (
    <div className="relative h-full w-full bg-gray-800 rounded-md p-4 overflow-y-auto">
      {/* TIMELINE GRID */}
      <div className="relative w-full h-full ">
        {hours.map((hour) => (
          <div key={hour} className="relative h-[80px] flex items-start">
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
          <div
            key={session.id}
            className="absolute left-12 w-4/5 rounded-md text-xs p-2 text-white shadow-md"
            style={getSessionStyle(session)}
          >
            <strong>{session.taskTitle}</strong>
            <div>{session.sessionDuration}</div>
          </div>
        ))}
    </div>
  );
}
