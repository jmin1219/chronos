"use client";

import TaskSelector from "./TaskSelector";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";

export default function DeepWorkTimer() {
  return (
    <div className="flex flex-col h-full w-full bg-gray-900 py-24 px-6 rounded-lg shadow-lg">
      <div className="flex flex-col h-full">
        <div className="mb-24">
          <TaskSelector />
        </div>
        <div className="flex-1 flex items-center justify-center bg-slate-700 max-h-72 rounded-lg mb-24">
          <TimerDisplay />
        </div>
        <div className="mt-4">
          <TimerControls />
        </div>
      </div>
    </div>
  );
}
