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
import { useAddTask, useUpdateTask } from "@/hooks/useTasksQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { X as ClearIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { taskFormSchema } from "@/lib/zod-schemas/tasks";
import { TaskFormValuesType, TaskType } from "@/lib/types/tasks";
import { ProjectType } from "@/lib/types/projects";
import { Separator } from "@/components/ui/separator";
import AddProjectDialog from "./AddProjectDialog";
import { Badge } from "@/components/ui/badge";

export default function TaskForm({
  onSubmitSuccess,
  initialData,
}: {
  onSubmitSuccess: () => void;
  initialData?: TaskType;
}) {
  const { data: projects = [], isLoading, error } = useProjectsQuery();

  const [calendarOpen, setCalendarOpen] = useState(false);

  const { mutate: mutateAddTask, isPending: isPendingAddTask } = useAddTask();
  const { mutate: mutateUpdateTask, isPending: isPendingUpdateTask } =
    useUpdateTask();

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const form = useForm<TaskFormValuesType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          dueDate: initialData.dueDate
            ? new Date(initialData.dueDate * 1000)
            : null,
        }
      : {
          title: "",
          projectId: 0,
          estimatedDuration: 60,
          dueDate: null,
          description: "",
          priority: "should-do",
        },
  });

  const handleProjectAdded = async (newProject: ProjectType) => {
    setShowAddProjectModal(false);
    form.setValue("projectId", newProject.id);
  };

  const handleSubmit = (values: TaskFormValuesType) => {
    const taskPayload = {
      ...values,
      dueDate:
        values.dueDate instanceof Date
          ? Math.floor(values.dueDate.getTime() / 1000)
          : null,
    };

    if (initialData) {
      mutateUpdateTask({ ...initialData, ...taskPayload });
    } else {
      mutateAddTask(taskPayload);
    }

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
                  onValueChange={(value) => {
                    if (value === "add-new-project") {
                      setShowAddProjectModal(true);
                      return;
                    }
                    field.onChange(Number(value));
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  value={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Project" />
                  </SelectTrigger>
                  <SelectContent {...field}>
                    {isLoading ? (
                      <SelectItem disabled value="0">
                        Loading...
                      </SelectItem>
                    ) : error ? (
                      <SelectItem disabled value="0">
                        Error loading projects
                      </SelectItem>
                    ) : projects.length > 0 ? (
                      projects.map((project: ProjectType) => (
                        <SelectItem key={project.id} value={String(project.id)}>
                          <Badge style={{ backgroundColor: project.color }}>
                            {project.name}
                          </Badge>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="0">
                        No projects found
                      </SelectItem>
                    )}
                    <Separator className="my-1" />
                    <SelectItem key="add-new-project" value="add-new-project">
                      + Add New Project
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority: Must Do, Should Do, Could Do */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent {...field}>
                    <SelectItem value="must-do">🔴 Must Do</SelectItem>
                    <SelectItem value="should-do">🟡 Should Do</SelectItem>
                    <SelectItem value="could-do">🔵 Could Do</SelectItem>
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
                    <PopoverContent className="w-auto">
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
                  {/* TODO: Fix errrors triggered when clearing due date */}
                  <Button
                    variant="ghost"
                    className="absolute right-1"
                    size="sm"
                    onClick={() => {
                      form.setValue("dueDate", null, { shouldValidate: false });
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
        <Button
          type="submit"
          disabled={isPendingAddTask || isPendingUpdateTask}
          className="w-full"
        >
          {isPendingAddTask || isPendingUpdateTask ? "Saving..." : "Save Task"}
        </Button>
      </form>

      {showAddProjectModal && (
        <AddProjectDialog
          open={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          onProjectAdded={handleProjectAdded}
        />
      )}
    </FormProvider>
  );
}
