import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters long."),
  projectId: z.number().min(1, "Please select a project."),
  estimatedDuration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 minute."),
  dueDate: z
    .preprocess(
      (val) => (val === "" ? null : val),
      z.union([z.date(), z.null()])
    )
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
  priority: z.string({ required_error: "Please select a priority" }),
});
