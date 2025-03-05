import { Button } from "@/components/ui/button";
import {
  useDeleteTask,
  useTasksQuery,
  useToggleTaskComplete,
} from "@/hooks/useTasksQuery";
import { TaskType } from "@/lib/types/tasks";

export default function TasksTable() {
  const { data: tasks = [], isLoading, error } = useTasksQuery();
  const toggleTaskCompleteMutation = useToggleTaskComplete();
  const deleteTaskMutation = useDeleteTask();

  return (
    <div>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>Error loading tasks</p>
      ) : (
        <ul>
          {tasks.map((task: TaskType) => (
            <li key={task.id}>
              <span>{task.title}</span>
              <div>
                <Button
                  size="sm"
                  onClick={() =>
                    toggleTaskCompleteMutation.mutate({
                      taskId: task.id,
                      completed: task.completed,
                    })
                  }
                >
                  {task.completed ? "Undo" : "Complete"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
