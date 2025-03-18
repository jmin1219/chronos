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
  const { isRunning, setTask } = useTimerStore();
  const { data: tasks = [] } = useTasksQuery();

  return (
    <Select
      onValueChange={(value) => setTask(Number(value))}
      disabled={isRunning}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a task" />
      </SelectTrigger>
      <SelectContent>
        {tasks.length > 0 ? (
          tasks.map((task: TaskType) => (
            // TODO: Add project badge at end.
            // TODO: Add other task properties like due date, priority, and/or estimated duration
            <SelectItem key={task.id} value={String(task.id)}>
              <div className="flex justify-between">
                <span>{task.title}</span>
                <span>{task.projectId}</span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="w-full flex flex-col py-2">
            <span className="text-gray-400 text-center">No Tasks</span>
          </div>
        )}
        <SelectSeparator className="my-2" />
        <div className="w-full flex justify-center mt-2">
          <AddTaskDialog />
        </div>
      </SelectContent>
    </Select>
  );
}
