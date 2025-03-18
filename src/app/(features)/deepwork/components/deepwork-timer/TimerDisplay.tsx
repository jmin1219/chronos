"use client";

import { useTimerStore } from "@/lib/stores/useTimerStore";
import { useEffect, useState } from "react";

export default function TimerDisplay() {
  const { expectedEndTime, isRunning, mode, workDuration } = useTimerStore();
  const [displayTime, setDisplayTime] = useState(workDuration);

  useEffect(() => {
    let frameId: number;

    const updateTime = () => {
      if (!expectedEndTime) return setDisplayTime(workDuration);

      const remainingTime = Math.floor((expectedEndTime - Date.now()) / 1000);
      setDisplayTime(remainingTime);

      frameId = requestAnimationFrame(updateTime);
    };

    updateTime();

    return () => cancelAnimationFrame(frameId);
  }, [expectedEndTime, mode, isRunning, workDuration]);

  const minutes = Math.floor(Math.abs(displayTime) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (Math.abs(displayTime) % 60).toString().padStart(2, "0");

  return (
    <div className="w-full flex flex-col items-center justify-center text-white">
      <div className="text-6xl font-bold tracking-widest">
        {displayTime < 0 ? `+${minutes}:${seconds}` : `${minutes}:${seconds}`}
      </div>
      <span className="mt-2 text-lg font-medium uppercase text-gray-400">
        {mode}
      </span>
    </div>
  );
}
