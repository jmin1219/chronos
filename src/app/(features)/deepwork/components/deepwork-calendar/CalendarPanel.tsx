"use client";

import { useState } from "react";
import WeeklySelector from "./WeeklySelector";
import DateSelector from "./DateSelector";
import DailySchedule from "./DailySchedule";
import { useSessionsQuery } from "@/hooks/useSessionsQuery";
import { startOfWeek } from "date-fns";
import { DeepWorkSessionType } from "@/lib/types/deepwork_sessions";
import { Separator } from "@/components/ui/separator";

export default function CalendarPanel() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: sessions, isLoading, error } = useSessionsQuery();

  // TODO: Make week start day adjustable in settings.
  // Week starts on Monday for now
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });

  const filteredSessions = sessions
    ? sessions.filter(
        (s: DeepWorkSessionType) =>
          new Date(s.startTime).toDateString() === selectedDate.toDateString()
      )
    : [];

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg p-2">
      <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      <WeeklySelector
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <Separator className="my-2 bg-slate-400" />

      <div className="flex-1 overflow-hidden mt-4">
        <DailySchedule
          selectedDate={selectedDate}
          sessions={filteredSessions}
        />
      </div>
    </div>
  );
}
