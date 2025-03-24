import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDeleteSession, useUpdateSession } from "@/hooks/useSessionsQuery";
import { EnrichedSessionType } from "@/lib/types/deepwork_sessions";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import TaskSelector from "../deepwork-timer/TaskSelector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type EditSessionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: EnrichedSessionType | null;
};

type FormValues = {
  taskId: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  notes: string;
};

export default function EditSessionDialog({
  open,
  onOpenChange,
  session,
}: EditSessionDialogProps) {
  const form = useForm<FormValues>();

  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  useEffect(() => {
    if (session) {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);

      form.reset({
        taskId: session.taskId,
        startHour: start.getHours(),
        startMinute: start.getMinutes(),
        endHour: end.getHours(),
        endMinute: end.getMinutes(),
        notes: session.notes || "",
      });
    }
  }, [session, form]);

  if (!session) return null;

  const onSubmit = (values: FormValues) => {
    const newStart = new Date(session.startTime);
    newStart.setHours(values.startHour, values.startMinute);

    const newEnd = new Date(session.endTime);
    newEnd.setHours(values.endHour, values.endMinute);

    if (newEnd <= newStart) {
      return form.setError("endHour", {
        message: "End time must be after start time.",
      });
    }

    const newDuration = Math.floor(
      (newEnd.getTime() - newStart.getTime()) / 1000
    );

    updateSession.mutate({
      id: session.id,
      updates: {
        taskId: values.taskId,
        startTime: newStart.getTime(),
        endTime: newEnd.getTime(),
        sessionDuration: newDuration,
        notes: values.notes,
      },
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!session) return;
    deleteSession.mutate(session.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Deep Work Session</DialogTitle>
          <DialogDescription>Edit the values below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="taskId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task</FormLabel>
                  <FormControl>
                    <TaskSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Hour</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={23} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startMinute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Minute</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={59} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Hour</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={23} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endMinute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Minute</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={59} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
