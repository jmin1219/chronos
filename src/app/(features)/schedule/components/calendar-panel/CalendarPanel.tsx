"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEnrichedSessionsQuery } from "@/hooks/useSessionsQuery";
import { useMemo } from "react";
import { EnrichedSessionType } from "@/lib/types/deepwork_sessions";

export default function CalendarPanel() {
  const { data: sessions = [] } = useEnrichedSessionsQuery();

  const events = useMemo(() => {
    return sessions.map((session: EnrichedSessionType) => ({
      id: String(session.id),
      title: session.taskTitle ?? "Untitled Task",
      start: new Date(session.startTime),
      end: new Date(session.endTime),
      backgroundColor: session.projectColor ?? "#999",
      display: "block",
    }));
  }, [sessions]);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        nowIndicator={true}
        droppable={true}
        eventReceive={(info) => {
          info.revert();
        }}
        slotLabelInterval="01:00"
        slotDuration="00:15:00"
        height="100%"
        events={events}
        eventDurationEditable={true}
        editable={false}
        selectable={false}
      />
    </div>
  );
}
