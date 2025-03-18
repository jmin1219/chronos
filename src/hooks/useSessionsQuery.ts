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
