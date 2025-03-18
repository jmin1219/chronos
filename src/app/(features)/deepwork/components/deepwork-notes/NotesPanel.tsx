"use client";

import { Badge } from "@/components/ui/badge";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { useSessionsQuery } from "@/hooks/useSessionsQuery";
import { useTasksQuery } from "@/hooks/useTasksQuery";
import { useTimerStore } from "@/lib/stores/useTimerStore";
import { DeepWorkSessionType } from "@/lib/types/deepwork_sessions";
import { ProjectType } from "@/lib/types/projects";
import { TaskType } from "@/lib/types/tasks";

export default function NotesPanel() {
  const { notes, setNotes, mode } = useTimerStore();
  const { data: recentSessions = [], isLoading, error } = useSessionsQuery();
  const { data: tasks = [] } = useTasksQuery();
  const { data: projects = [] } = useProjectsQuery();

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg p-4">
      {/* CURRENT SESSION NOTE TEXTAREA */}
      <div>
        <span className="text-xl mb-3">Notes</span>
        <textarea
          className="w-full h-80 bg-gray-800 text-white p-3 rounded-lg resize-none"
          placeholder="Writing is thinking. Enter session notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={mode !== "work"}
        />
      </div>

      {/* RECENT NOTES SECTION */}
      {/* NOTES FILTERS */}
      <div className="flex justify-between text-sm text-gray-400 mt-4">
        <span className="cursor-pointer hover:text-white">Recent Notes</span>
        <span className="cursor-pointer hover:text-white">Current Task</span>
        <span className="cursor-pointer hover:text-white">Current Project</span>
      </div>

      {/* NOTES LIST */}
      <div className="mt-3 flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-400 text-center">Loading session notes...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error loading sessions.</p>
        ) : recentSessions.length > 0 ? (
          recentSessions.map((session: DeepWorkSessionType) => {
            const task = tasks.find((t: TaskType) => t.id === session.taskId);
            const project = projects.find(
              (p: ProjectType) => p.id === task.projectId
            );
            return (
              // TODO: Add edit session button to each
              <div key={session.id} className="mb-4 p-3 bg-gray-800 rounded-lg">
                <div className="text-sm font-bold">{task.title}</div>
                <div className="text-sm font-bold">
                  {session.sessionDuration}
                </div>
                <Badge style={{ backgroundColor: project.color }}>
                  {project.name}
                </Badge>
                <div className="text-xs text-gray-400">
                  {/* TODO: Make date relative? Function in utils.ts */}
                  {new Date(session.startTime).toLocaleDateString()}
                </div>
                <p className="text-gray-400 text-sm">
                  {session.notes || "No notes"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center">No past session notes.</p>
        )}
      </div>
    </div>
  );
}
