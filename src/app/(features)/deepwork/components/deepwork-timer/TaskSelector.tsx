"use client";

import AddTaskDialog from "@/app/(features)/tasks/components/AddTaskDialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnrichedTasksQuery } from "@/hooks/useTasksQuery";
import { useTimerStore } from "@/lib/stores/useTimerStore";
import { EnrichedTaskType } from "@/lib/types/tasks";
import { TASK_PRIORITIES, TaskPriorityKey } from "@/lib/utils";

type TaskSelectorProps = {
  value?: number;
  onChange?: (value: number) => void;
};

export default function TaskSelector({ value, onChange }: TaskSelectorProps) {
  const { isRunning, setTask } = useTimerStore();
  const { data: tasks = [] } = useEnrichedTasksQuery();

  return (
    <Select
      onValueChange={(value) => {
        const selectedTask = tasks.find(
          (task: EnrichedTaskType) => task.id === Number(value)
        );
        if (selectedTask) {
          onChange?.(selectedTask.id);
          setTask(selectedTask.id, selectedTask.projectId);
        }
      }}
      value={value?.toString()}
      disabled={isRunning && !onChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a task" />
      </SelectTrigger>
      <SelectContent>
        {tasks.length > 0 ? (
          tasks.map((task: EnrichedTaskType) => (
            <SelectItem key={task.id} value={String(task.id)}>
              <div className="flex justify-between w-full items-center gap-3">
                <span className="font-medium truncate max-w-[80%]">
                  {task.title}
                </span>
                <span className="text-xs capitalize text-muted-foreground">
                  {TASK_PRIORITIES[task.priority as TaskPriorityKey].title}
                </span>
                <Badge
                  style={{ backgroundColor: task.projectColor }}
                  className="text-xs"
                >
                  {task.projectName}
                </Badge>
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
