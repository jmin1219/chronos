"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useDeleteTask,
  useTasksQuery,
  useToggleTaskComplete,
} from "@/hooks/useTasksQuery";
import AddTaskDialog from "./AddTaskDialog";
import { Button } from "@/components/ui/button";

export default function TasksList() {
  const { data: tasks = [], isLoading, error } = useTasksQuery();
  const toggleTaskCompleteMutation = useToggleTaskComplete();
  const deleteTaskMutation = useDeleteTask();

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <AddTaskDialog />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p>Error loading tasks</p>
          ) : (
            <ul>
              {tasks.map((task) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
