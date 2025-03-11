"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TaskSelector from "./TaskSelector";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";

export default function DeepWorkTimer() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Deep Work Timer</CardTitle>
        <CardDescription>
          Start working. Maybe add task details here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TaskSelector />
        {/* <TimerDisplay />
        <TimerControls /> */}
      </CardContent>
    </Card>
  );
}
