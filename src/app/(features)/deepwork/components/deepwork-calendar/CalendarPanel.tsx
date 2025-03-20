"use client";

import { useState } from "react";
import WeeklySelector from "./WeeklySelector";
import DateSelector from "./DateSelector";
import DailySchedule from "./DailySchedule";
import { useSessionsQuery } from "@/hooks/useSessionsQuery";
import { DeepWorkSessionType } from "@/lib/types/deepwork_sessions";
import { Separator } from "@/components/ui/separator";
import { useTasksQuery } from "@/hooks/useTasksQuery";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { ProjectType } from "@/lib/types/projects";
import { TaskType } from "@/lib/types/tasks";

export interface SessionData {
  id: number;
  startTime: number;
  endTime: number;
  sessionDuration: number;
  taskTitle: string;
  projectColor: string;
  projectName: string;
  notes: string;
}

export default function CalendarPanel() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: sessions = [], isLoading: loadingSessions } =
    useSessionsQuery();
  const { data: tasks = [], isLoading: loadingTasks } = useTasksQuery();
  const { data: projects = [], isLoading: loadingProjects } =
    useProjectsQuery();

  const isLoading = loadingSessions || loadingTasks || loadingProjects;

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  // TODO: Make week start day adjustable in settings.

  const filteredSessions: DeepWorkSessionType[] = Array.isArray(sessions)
    ? sessions.filter(
        (s: DeepWorkSessionType) =>
          new Date(s.startTime).toDateString() === selectedDate.toDateString()
      )
    : [];

  const sessionData = filteredSessions.length
    ? filteredSessions.map((session: DeepWorkSessionType) => {
        const task = tasks.find((t: TaskType) => t.id === session.taskId);
        const project = task
          ? projects.find((p: ProjectType) => p.id === task.projectId)
          : null;

        return {
          id: session.id,
          startTime: session.startTime,
          endTime: session.endTime,
          sessionDuration: session.sessionDuration,
          taskTitle: String(task.title) || "Unknown Task",
          projectColor: String(project.color) || "#CCCCCC",
          projectName: String(project.name) || "Unknown Project",
          notes: session.notes,
        };
      })
    : [];

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg p-2">
      <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      <WeeklySelector
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <Separator className="my-2 bg-slate-400" />

      <div className="flex-1 overflow-hidden mt-4">
        <DailySchedule sessions={sessionData} />
      </div>
    </div>
  );
}
