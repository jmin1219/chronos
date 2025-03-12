"use client";

import AddTaskDialog from "@/app/(features)/tasks/components/AddTaskDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasksQuery } from "@/hooks/useTasksQuery";
import { useTimerStore } from "@/lib/stores/useTimerStore";
import { TaskType } from "@/lib/types/tasks";

export default function TaskSelector() {
  const { isTimerRunning, selectTask } = useTimerStore();
  const { data: tasks = [] } = useTasksQuery();

  return (
    <Select
      onValueChange={(value) => selectTask(Number(value))}
      disabled={isTimerRunning}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a task" />
      </SelectTrigger>
      <SelectContent>
        {tasks.length > 0 ? (
          // Add other task properties like Project Badge, due date, priority, and/or estimated duration
          tasks.map((task: TaskType) => (
            <SelectItem key={task.id} value={String(task.id)}>
              {task.title}
            </SelectItem>
          ))
        ) : (
          <div className="w-full flex flex-col py-2">
            <span className="text-gray-400 text-center">No Tasks</span>
            <SelectSeparator className="my-2" />
            <AddTaskDialog />
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
