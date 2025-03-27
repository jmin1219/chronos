import {
  EnrichedTaskScheduleType,
  TaskScheduleType,
} from "@/lib/types/task_schedules";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTaskSchedulesQuery() {
  return useQuery<TaskScheduleType[]>({
    queryKey: ["taskSchedules"],
    queryFn: async () => {
      const res = await fetch("/api/task_schedules");
      if (!res.ok) throw new Error("fetchTaskSchedules error");
      return res.json();
    },
  });
}

export function useEnrichedTaskSchedulesQuery() {
  return useQuery<EnrichedTaskScheduleType[]>({
    queryKey: ["enrichedTaskSchedules"],
    queryFn: async () => {
      const res = await fetch("/api/enriched_task_schedules");
      if (!res.ok) throw new Error("fetchEnrichedTaskSchedules error");
      return res.json();
    },
  });
}

export function useCreateTaskSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      scheduledStart,
      scheduledEnd,
    }: Partial<TaskScheduleType>) => {
      const res = await fetch("/api/task_schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, scheduledStart, scheduledEnd }),
      });

      if (!res.ok) throw new Error("Failed to create schedule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskSchedules"] });
    },
  });
}

export const useUpdateTaskSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<TaskScheduleType>;
    }) => {
      const res = await fetch("/api/task_schedules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });

      if (!res.ok) throw new Error("Failed to update schedule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskSchedules"] });
    },
  });
};

export const useDeleteTaskSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/task_schedules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete schedule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskSchedules"] });
    },
  });
};
