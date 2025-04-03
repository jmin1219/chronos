import { EventReceiveArg } from "@fullcalendar/interaction/index.js";

export const handleReceiveEvent = async (info: EventReceiveArg, createFns) => {
  const { createSchedule, createSession } = createFns;

  const taskId = Number(info.event.id);
  const start = info.event.start!;
  const durationStr = info.event.extendedProps.duration || "60";
  const durationInMinutes = parseInt(durationStr.replace("m", ""));
  const end = new Date(start.getTime() + durationInMinutes * 60 * 1000);
  const now = new Date();

  if (start < now) {
    await createSession({ taskId, start, end, durationInMinutes });
  } else {
    await createSchedule({ taskId, start, end });
  }
};

export const handleEventChange = async (changeInfo, updateFns) => {
  const { updateSession, updateSchedule } = updateFns;
  const { event } = changeInfo;
  const id = event.id;

  const start = event.start!.getTime();
  const end = event.end!.getTime();

  if (id.startsWith("session-")) {
    const sessionId = parseInt(id.replace("session-", ""));
    await updateSession({
      id: sessionId,
      updates: { startTime: start, endTime: end },
    });
  }

  if (id.startsWith("schedule-")) {
    const scheduleId = parseInt(id.replace("schedule", ""));
    await updateSchedule({
      id: scheduleId,
      updates: { scheduledStart: start, scheduledEnd: end },
    });
  }
};
