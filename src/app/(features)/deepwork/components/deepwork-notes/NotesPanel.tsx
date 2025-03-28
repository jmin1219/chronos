"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrichedSessionsQuery } from "@/hooks/useSessionsQuery";
import { useTimerStore } from "@/lib/stores/useTimerStore";
import { EnrichedSessionType } from "@/lib/types/deepwork_sessions";
import { formatDuration, formatRelativeDate } from "@/lib/utils";
import { useState } from "react";

export default function NotesPanel() {
  const { notes, setNotes, mode, taskId, projectId } = useTimerStore();
  const { data: sessions = [], isLoading, error } = useEnrichedSessionsQuery();

  const [filter, setFilter] = useState<"task" | "project" | null>(null);

  const filteredSessions = sessions
    .sort(
      (a: EnrichedSessionType, b: EnrichedSessionType) =>
        b.startTime - a.startTime
    )
    .filter((session: EnrichedSessionType) => {
      if (filter === "task") return session.taskId === taskId;
      if (filter === "project") {
        // TODO: get projectId from taskId (maybe stored with useTimerStore)
        return session.projectId === projectId;
      }
      return true; // Shows all session notes when neither filter is clicked.
    });

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg p-4">
      {/* CURRENT SESSION NOTE TEXTAREA */}
      <div className="mb-3">
        <p className="text-lg mb-2  text-white">Session Notes</p>
        <textarea
          className="w-full h-60 bg-gray-800 text-white p-3 rounded-lg resize-none border border-gray-700"
          placeholder="Writing is thinking. Enter session notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={mode !== "work"}
        />
      </div>

      {/* RECENT NOTES */}
      {/* FILTER BUTTONS */}
      <div className="flex justify-between mt-4 border-b border-gray-700 pb-2 items-center">
        <p className="text-lg">Recent Notes</p>
        <div className="flex gap-2 text-sm text-gray-400">
          {/* TODO: Improve filter button UI to look like hybrid button and checkbox */}
          <Button
            variant={filter === "task" ? "default" : "outline"}
            onClick={() => setFilter(filter === "task" ? null : "task")}
            disabled={taskId === null}
          >
            Current Task
          </Button>
          <Button
            variant={filter === "project" ? "default" : "outline"}
            onClick={() => setFilter(filter === "project" ? null : "project")}
            disabled={taskId === null}
          >
            Current Project
          </Button>
        </div>
      </div>

      {/* RECENT NOTES LIST */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="p-2">
                <Skeleton className="h-4 w-2/3 mb-2 bg-gray-700" />
                <Skeleton className="h-3 w-1/3 mb-2 bg-gray-700" />
                <Skeleton className="h-3 w-full bg-gray-700" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center mt-5">
            Error loading sessions.
          </p>
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session: EnrichedSessionType) => {
            return (
              <div
                key={session.id}
                className="p-2 bg-gray-800 rounded-lg shadow-md border border-gray-700"
              >
                <div className="flex justify-between items-start mb-1">
                  {/* Left: Task Title & Project Badge */}
                  <div className="flex flex-col gap-1">
                    {session.projectId && (
                      <Badge
                        style={{
                          backgroundColor: session.projectColor ?? "#CCCCCC",
                        }}
                        className="self-start"
                      >
                        {session.projectName ?? "Unknown Project"}
                      </Badge>
                    )}
                    <p className="text-sm font-bold">
                      {session.taskTitle ?? "Unkown Task"}
                    </p>
                  </div>
                  {/* Right: Session Date & Duration */}
                  <div className="text-xs text-white flex flex-col items-end gap-1">
                    <p>{formatRelativeDate(session.startTime)}</p>
                    <p>{formatDuration(session.sessionDuration)}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  {session.notes || (
                    <span className="italic text-xs">No notes added</span>
                  )}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center mt-5">
            No past session notes.
          </p>
        )}
      </div>
    </div>
  );
}
