"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { EventReceiveArg } from "@fullcalendar/interaction";
import {
  useEnrichedSessionsQuery,
  useSaveDeepworkSession,
  useUpdateSession,
} from "@/hooks/useSessionsQuery";
import { useMemo } from "react";
import { EnrichedSessionType } from "@/lib/types/deepwork_sessions";
import {
  useCreateTaskSchedule,
  useEnrichedTaskSchedulesQuery,
  useUpdateTaskSchedule,
} from "@/hooks/useTaskSchedulesQuery";
import { EnrichedTaskScheduleType } from "@/lib/types/task_schedules";
import {
  handleEventChange,
  handleReceiveEvent,
} from "@/lib/calendar/handleCalendarEvents";

export default function CalendarPanel() {
  const { data: sessions = [] } = useEnrichedSessionsQuery();
  const { data: schedules = [] } = useEnrichedTaskSchedulesQuery();

  const createTaskSchedule = useCreateTaskSchedule();
  const saveDeepworkSession = useSaveDeepworkSession();

  const events = useMemo(() => {
    const sessionEvents = sessions.map((session: EnrichedSessionType) => ({
      id: `session-${session.id}`,
      title: session.taskTitle ?? "Untitled Task",
      start: new Date(session.startTime),
      end: new Date(session.endTime),
      backgroundColor: session.projectColor ?? "#999",
      display: "block",
      opacity: 1,
    }));

    const scheduleEvents = schedules.map(
      (schedule: EnrichedTaskScheduleType) => ({
        id: `schedule-${schedule.id}`,
        title: schedule.taskTitle ?? "Scheduled Block Without Task",
        start: new Date(schedule.scheduledStart),
        end: new Date(schedule.scheduledEnd),
        backgroundColor: schedule.projectColor ?? "#999",
        display: "block",
        opacity: 0.4,
      })
    );

    return [...sessionEvents, ...scheduleEvents];
  }, [sessions, schedules]);

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
        eventReceive={(info) =>
          handleReceiveEvent(info, {
            createSession: async ({
              taskId,
              start,
              end,
              durationInMinutes,
            }) => {
              await saveDeepworkSession.mutateAsync({
                taskId,
                startTime: start.getTime(),
                endTime: end.getTime(),
                sessionDuration: durationInMinutes * 60,
                notes: "",
              });
            },
            createSchedule: async ({ taskId, start, end }) => {
              await createTaskSchedule.mutateAsync({
                taskId,
                scheduledStart: start.getTime(),
                scheduledEnd: end.getTime(),
              });
            },
          })
        }
        eventChange={(info) =>
          handleEventChange(info, {
            updateSession: useUpdateSession().mutateAsync,
            updateSchedule: useUpdateTaskSchedule().mutateAsync,
          })
        }
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
