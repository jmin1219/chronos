import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long."),
});

