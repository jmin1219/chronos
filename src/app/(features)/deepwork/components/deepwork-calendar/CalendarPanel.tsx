"use client";

import { useState } from "react";
import WeeklySelector from "./WeeklySelector";
import DateSelector from "./DateSelector";
import DailySchedule from "./DailySchedule";
import { useEnrichedSessionsQuery } from "@/hooks/useSessionsQuery";
import { Separator } from "@/components/ui/separator";
import { EnrichedSessionType } from "@/lib/types/deepwork_sessions";

export default function CalendarPanel() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: sessions = [], isLoading } = useEnrichedSessionsQuery();

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  // TODO: Make week start day adjustable in settings.

  const filteredSessions: EnrichedSessionType[] = Array.isArray(sessions)
    ? sessions.filter(
        (s: EnrichedSessionType) =>
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
        <DailySchedule sessions={filteredSessions} />
      </div>
    </div>
  );
}
