"use client";

import { useTimerStore } from "@/lib/stores/useTimerStore";
import { useEffect, useState } from "react";

export default function TimerDisplay() {
  const { isTimerRunning, isPaused, timeLeft, pause, resume } = useTimerStore();

  const [localTimeLeft, setLocalTimeLeft] = useState(timeLeft);

  // Timer Countdown
  useEffect(() => {
    if (!isTimerRunning || isPaused) return;

    const interval = setInterval(() => {
      setLocalTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval); // allows proper clearing of timer
  }, [isTimerRunning, isPaused, timeLeft]);

  // Keep Zustand in sync when session ends
  useEffect(() => {
    if (!isTimerRunning) {
      setLocalTimeLeft(timeLeft); // Reset local time when session stops
    }
  }, [isTimerRunning, timeLeft]);

  // Format timeLeft in Timer "MM:SS"
  const minutes = Math.floor(Math.abs(timeLeft) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (Math.abs(timeLeft) % 60).toString().padStart(2, "0");

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      {/* TIME LEFT DISPLAY */}
      <div className="text-3xl font-bold mt-4 text-center">
        {timeLeft >= 0 ? (
          <div className="text-4xl font-bold">
            {minutes}:{seconds}
          </div>
        ) : (
          <div className="text-4xl font-bold text-green-500">
            + {minutes}:{seconds}
          </div>
        )}
      </div>
    </div>
  );
}
