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
        {/* TODO: Replace with dynamic API fetch of tasks that are not completed */}
        {tasks.length > 0 ? (
          tasks.map((task: TaskType) => (
            <SelectItem key={task.id} value={String(task.id)}>
              {task.title}
            </SelectItem>
          ))
        ) : (
          <>
            <span>No Tasks</span>
            <SelectSeparator />
            <AddTaskDialog />
          </>
        )}
      </SelectContent>
    </Select>
  );
}
