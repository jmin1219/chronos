"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddProject } from "@/hooks/useProjectsQuery";
import { ProjectFormValuesType, ProjectType } from "@/lib/types/projects";
import { projectFormSchema } from "@/lib/zod-schemas/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export default function ProjectForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: (newProject: ProjectType) => void;
}) {
  const { mutate, isPending } = useAddProject();

  const form = useForm<ProjectFormValuesType>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: "", color: "#FFFFFF", description: "" },
  });

  const handleSubmit = (values: z.infer<typeof projectFormSchema>) => {
    mutate(values, {
      onSuccess: (newProject) => {
        onSubmitSuccess(newProject);
        form.reset();
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add notes here..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Create Project"}
        </Button>
      </form>
    </FormProvider>
  );
}
