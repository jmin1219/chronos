"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAddTask } from "@/hooks/useTasksQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { X as ClearIcon } from "lucide-react";
import { z } from "zod";
import { TaskFormValues } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { taskFormSchema } from "../schema";

export default function TaskForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { mutate, isPending } = useAddTask();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      projectId: 0,
      estimatedDuration: 60,
      dueDate: null,
      description: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof taskFormSchema>) => {
    mutate({
      ...values,
      dueDate:
        values.dueDate instanceof Date
          ? Math.floor(values.dueDate.getTime() / 1000)
          : null,
    });
    form.reset();
    onSubmitSuccess();
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 mt-3"
      >
        {/* Task Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project */}
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Project</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Project" />
                  </SelectTrigger>
                  <SelectContent {...field}>
                    <SelectItem value="1">Project 1</SelectItem>
                    <SelectItem value="2">Project 2</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estimated Duration */}
        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hard Due Date with calendar date picker*/}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Input
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
                        }
                        placeholder="Select Due Date"
                        readOnly
                        onClick={() => setCalendarOpen(true)}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => {
                          field.onChange(date ?? null);
                          setCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    className="absolute right-1"
                    size="sm"
                    onClick={() => {
                      field.onChange(null);
                      form.clearErrors("dueDate");
                    }}
                  >
                    <ClearIcon />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Submit Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Create Task"}
        </Button>
      </form>
    </FormProvider>
  );
}
