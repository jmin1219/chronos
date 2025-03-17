"use client";

import { Button } from "@/components/ui/button";
import { useSaveDeepworkSession } from "@/hooks/useSessionsQuery";
import { useTimerStore } from "@/lib/stores/useTimerStore";

export default function TimerControls() {
  const {
    taskId,
    isRunning,
    mode,
    expectedEndTime,
    workDuration,
    isBreakPending,
    startWork,
    startBreak,
    endSession,
    adjustTime,
    skipBreak,
  } = useTimerStore();

  const { mutate: saveSession } = useSaveDeepworkSession();

  const isOvertime = expectedEndTime ? expectedEndTime <= Date.now() : false;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {/* IDLE MODE - Before starting work session */}
      {mode === "idle" && !isBreakPending && (
        <>
          <div className="flex justify-between">
            <Button
              onClick={() => adjustTime(-5)}
              disabled={workDuration <= 5 * 60}
            >
              - 5 min
            </Button>
            <Button onClick={() => adjustTime(5)}>+ 5 min</Button>
          </div>
          <Button onClick={startWork} disabled={isRunning || !taskId}>
            Start Work Session
          </Button>
        </>
      )}

      {/* WORK MODE - Active work session */}
      {mode === "work" && !isOvertime && expectedEndTime && (
        <>
          <div className="flex justify-between">
            <Button
              onClick={() => adjustTime(-5)}
              disabled={expectedEndTime - Date.now() <= 5 * 60 * 1000}
            >
              - 5 min
            </Button>
            <Button onClick={() => adjustTime(5)}>+ 5 min</Button>
          </div>
          <Button onClick={() => endSession(saveSession)}>End Session</Button>
        </>
      )}

      {/* OVERTIME MODE */}
      {mode === "work" && isOvertime && (
        <>
          <Button onClick={() => endSession(saveSession)}>End Session</Button>
        </>
      )}

      {/* BREAK PENDING MODE */}
      {isBreakPending && (
        <>
          <Button onClick={startBreak}>Start Break</Button>
          <Button onClick={skipBreak}>Skip Break</Button>
        </>
      )}

      {/* BREAK MODE */}
      {mode === "break" && (
        <>
          <Button onClick={() => endSession(saveSession)}>End Break</Button>
        </>
      )}
    </div>
  );
}
