import { TaskAPIRequestType } from "@/lib/types/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch all tasks
const fetchTasks = async () => {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("fetchTasks error");
  return res.json();
};

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
};

// Add a new task
export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask: TaskAPIRequestType) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh data after adding a task
    },
  });
};

// Toggle Task Completion
export const useToggleTaskComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      completed,
    }: {
      taskId: number;
      completed: boolean;
    }) => {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: completed ? 0 : 1 }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh task list after toggling a task completion
    },
  });
};

// Delete Task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: number) => {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh data after deletion
    },
  });
};
