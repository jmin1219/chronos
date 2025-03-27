"use client";

import CalendarPanel from "./components/calendar-panel/CalendarPanel";
import TasksPanel from "./components/TasksPanel";

export default function SchedulePage() {
  return (
    <div className="flex w-full h-full">
      <div className="w-[60%] border-r">
        <CalendarPanel />
      </div>
      <div className="flex flex-col w-[40%]">
        <div className="h-1/3 border-b p-4">Insights Panel</div>
        <div className="h-2/3 p-4">
          <TasksPanel />
        </div>
      </div>
    </div>
  );
}
