"use client";

import CalendarPanel from "./components/calendar-panel/CalendarPanel";

export default function SchedulePage() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="h-[60%] border-b">
        <CalendarPanel />
      </div>
      <div className="flex flex-row h-[40%]">
        <div className="w-1/2 border-r p-4">Insights Panel</div>
        <div className="w-1/2 p-4">Task List Panel</div>
      </div>
    </div>
  );
}
