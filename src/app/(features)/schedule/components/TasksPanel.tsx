import { Badge } from "@/components/ui/badge";
import { useEnrichedTasksQuery } from "@/hooks/useTasksQuery";
import { EnrichedTaskType } from "@/lib/types/tasks";
import { TASK_PRIORITIES, TaskPriorityKey } from "@/lib/utils";
import { Draggable } from "@fullcalendar/interaction/index.js";
import { useEffect } from "react";

export default function TasksPanel() {
  const { data: tasks = [] } = useEnrichedTasksQuery();

  const incompleteTasks = tasks
    .filter((t: EnrichedTaskType) => !t.completed)
    .sort(
      (a: EnrichedTaskType, b: EnrichedTaskType) =>
        (b.dueDate || 0) - (a.dueDate || 0)
    );

  useEffect(() => {
    const draggableEl = document.getElementById("external-events");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: "[data-event]",
        eventData: (eventEl) => {
          return {
            id: eventEl.getAttribute("data-id"),
            title: eventEl.getAttribute("data-title"),
            backgroundColor: eventEl.getAttribute("data-color"),
            duration: `${eventEl.getAttribute("data-duration") || 60}m`,
          };
        },
      });
    }
  });

  return (
    <div id="external-events" className="flex flex-col gap-2 overflow-y-auto">
      <ul className="space-y-2">
        {incompleteTasks.map((task: EnrichedTaskType) => (
          <li
            key={task.id}
            className="border p-2 rounded bg-muted"
            data-event
            data-id={task.id}
            data-title={task.title}
            data-color={task.projectColor}
            data-duration={task.estimatedDuration || 60} // Default duration for dragged tasks is 60 minutes.
          >
            <div className="flex justify-between mb-2">
              <div className="flex gap-2">
                <Badge
                  style={{ backgroundColor: task.projectColor ?? "#FFF" }}
                  className="self-start"
                >
                  {task.projectName ?? "Unknown Project"}
                </Badge>
                <Badge variant="outline">
                  {TASK_PRIORITIES[task.priority as TaskPriorityKey].title}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {task.dueDate || "No Due Date"}
              </div>
            </div>
            <p>{task.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
