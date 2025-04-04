"use client";

import { DeepWorkSessionType } from "@/lib/types/deepwork_sessions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchDeepworkSessions = async () => {
  const res = await fetch("/api/deepwork_sessions");
  if (!res.ok) throw new Error("fetchDeepworkSessions error");
  return res.json();
};

export const useSessionsQuery = () => {
  return useQuery({
    queryKey: ["deepwork_sessions"],
    queryFn: fetchDeepworkSessions,
  });
};

export const useEnrichedSessionsQuery = () => {
  return useQuery({
    queryKey: ["enrichedSessions"],
    queryFn: async () => {
      const res = await fetch("/api/enriched_sessions");
      if (!res.ok) throw new Error("fetchEnrichedSessions error");
      return res.json();
    },
  });
};

export const useSaveDeepworkSession = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newSession: Partial<DeepWorkSessionType>) => {
      const res = await fetch("/api/deepwork_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deepwork_sessions"] });
    },
  });
  return mutation;
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<DeepWorkSessionType>;
    }) => {
      const res = await fetch(`/api/deepwork_sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update session.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrichedSessions"] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/deepwork_sessions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete session.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrichedSessions"] });
    },
  });
};
