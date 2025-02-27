import { useQuery } from "@tanstack/react-query";

const fetchProjects = async () => {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
};
