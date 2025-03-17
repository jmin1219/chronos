"use client";

import { useTimerStore } from "@/lib/stores/useTimerStore";
import { useEffect, useState } from "react";

export default function TimerDisplay() {
  const { expectedEndTime, isRunning, mode, workDuration } = useTimerStore();
  const [displayTime, setDisplayTime] = useState(25 * 60);

  useEffect(() => {
    if (mode === "idle") return setDisplayTime(workDuration);

    const updateTime = () => {
      if (!expectedEndTime) return;
      const remainingTime = Math.floor((expectedEndTime - Date.now()) / 1000);
      setDisplayTime(remainingTime);
    };

    updateTime();

    if (isRunning) {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [expectedEndTime, mode, isRunning, workDuration]);

  // Removed interval update to prevent UI lag; displayTime now updates immediately via timeLeft changes.

  const minutes = Math.floor(Math.abs(displayTime) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (Math.abs(displayTime) % 60).toString().padStart(2, "0");

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md text-center">
      <div
        className={`flex flex-col text-4xl font-bold ${
          displayTime < 0 ? "text-green-500" : ""
        }`}
      >
        <span>MODE: {mode}</span>
        <div>
          {displayTime < 0 ? `+${minutes}:${seconds}` : `${minutes}:${seconds}`}
        </div>
      </div>
    </div>
  );
}
