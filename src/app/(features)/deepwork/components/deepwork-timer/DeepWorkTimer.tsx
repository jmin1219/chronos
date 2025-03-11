"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimerStore } from "@/lib/stores/useTimerStore";
import { useCallback, useEffect, useState } from "react";

export default function DeepWorkTimer() {
  const {
    isTimerRunning,
    isBreak,
    timeLeft,
    startWork,
    startBreak,
    pause,
    reset,
  } = useTimerStore();

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [workDuration, setWorkDuration] = useState(25); // local state stored in minutes for input
  const [breakDuration, setBreakDuration] = useState(5); // local state stored in minutes for input

  const handleStartWork = () => {
    if (!selectedTaskId) return alert("Please select a task.");
    startWork(selectedTaskId, workDuration * 60);
  };

  const handleTimerEnd = useCallback(() => {
    // useCallback used so that useEffect doesn't start the break automatically. With this function now memoized, it will only be re-created when isBreak changes.
    if (!isBreak) {
      // Work Session ended: prompt for break
      useTimerStore.setState({ isRunning: false });
    } else {
      // Break Session ended: either start another work session or end deep work session
      useTimerStore.setState({ isRunning: false, isSessionActive: false });
    }
  }, [isBreak]);

  // Countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(
        () =>
          useTimerStore.setState((state) => ({ timeLeft: state.timeLeft - 1 })),
        1000
      );
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) handleTimerEnd();
  }, [isRunning, timeLeft, handleTimerEnd]);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Deep Work Timer</CardTitle>
        <CardDescription>
          Start working. Maybe add task details here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TASK SELECTOR */}
        <Select
          value={selectedTaskId?.toString() || ""}
          onValueChange={(value) => setSelectedTaskId(Number(value))}
          disabled={isSessionActive}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {/* TODO: Replace with dynamic API fetch of tasks that are not completed */}
            <SelectItem value="1">Task 1</SelectItem>
            <SelectItem value="2">Task 2</SelectItem>
          </SelectContent>
        </Select>

        {/* TIMER DISPLAY OR DURATION SETTER */}
        <div className="p-4 border rounded-lg bg-white shadow-md">
          {/* TIME LEFT DISPLAY */}
          <div className="text-3xl font-bold mt-4 text-center">
            {!isRunning ? (
              <div className="flex gap-2 justify-center">
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={isBreak ? breakDuration : workDuration}
                  onChange={(e) =>
                    isBreak
                      ? setBreakDuration(Number(e.target.value))
                      : setWorkDuration(Number(e.target.value))
                  }
                  className="p-1 text-center"
                />
                <span>min</span>
              </div>
            ) : timeLeft >= 0 ? (
              // Normal Timer Display
              <div className="text-4xl font-bold">
                {String(
                  Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")
                )}
                :{String((timeLeft % 60).toString().padStart(2, "0"))}
              </div>
            ) : (
              // Overtime Display
              <div className="text-4xl font-bold text-green-500">
                + {String(Math.floor(Math.abs(timeLeft) / 60)).padStart(2, "0")}
                :{String(Math.abs(timeLeft) % 60).padStart(2, "0")}
              </div>
            )}
          </div>

          {/* CONTROL BUTTONS */}
          <div className="flex justify-center gap-3 mt-4">
            {!isSessionActive ? (
              <Button onClick={handleStartWork}>Start Work</Button>
            ) : !isRunning ? (
              <Button
                onClick={() =>
                  startWork(selectedTaskId as number, workDuration)
                }
              >
                Stark Work
              </Button>
            ) : (
              <Button onClick={pause}>Pause</Button>
            )}
            <Button onClick={reset} variant="destructive">
              Reset
            </Button>
          </div>
          {/* POST-WORK OPTIONS */}
          {!isRunning && timeLeft === 0 && (
            <div className="mt-4 flex justify-center gap-3">
              {isBreak ? (
                <>
                  <Button
                    onClick={() =>
                      startWork(selectedTaskId as number, workDuration * 60)
                    }
                  >
                    Start Next Work Block
                  </Button>
                  <Button variant="destructive" onClick={reset}>
                    End Session
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => startBreak(workDuration * 60)}>
                    Start Break
                  </Button>
                  <Button onClick={reset}>Skip Break</Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
