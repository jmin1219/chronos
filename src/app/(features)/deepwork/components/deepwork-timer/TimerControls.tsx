"use client";

import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/lib/stores/useTimerStore";

export default function TimerControls() {
  const {
    taskId,
    isRunning,
    mode,
    expectedEndTime,
    startWork,
    startBreak,
    endSession,
    adjustTime,
  } = useTimerStore();

  const isOvertime = expectedEndTime ? expectedEndTime <= Date.now() : false;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex justify-between">
        <Button
          onClick={() => adjustTime(-5)}
          disabled={
            mode === "break" ||
            isOvertime ||
            (expectedEndTime
              ? expectedEndTime <= Date.now() + 5 * 60 * 1000
              : false)
          }
        >
          - 5 min
        </Button>
        <Button
          onClick={() => adjustTime(5)}
          disabled={mode === "break" || isOvertime}
        >
          + 5 min
        </Button>
      </div>

      <Button onClick={startWork} disabled={isRunning || !taskId}>
        Start Work Session
      </Button>
      <Button onClick={endSession} disabled={!isRunning}>
        End Session
      </Button>
      <Button onClick={startBreak} disabled={mode !== "work" || isRunning}>
        Start Break
      </Button>
    </div>
  );
}
