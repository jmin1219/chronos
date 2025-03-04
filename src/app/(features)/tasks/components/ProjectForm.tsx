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
import { useAddProject } from "@/hooks/useProjectsQuery";
import { ProjectFormValuesType } from "@/lib/types/projects";
import { projectFormSchema } from "@/lib/zod-schemas/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export default function ProjectForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const { mutate, isPending } = useAddProject();

  const form = useForm<ProjectFormValuesType>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: "" },
  });

  const handleSubmit = (values: z.infer<typeof projectFormSchema>) => {
    mutate(values);
    form.reset();
    onSubmitSuccess();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        
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

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Create Project"}
        </Button>
      </form>
    </FormProvider>
  );
}
