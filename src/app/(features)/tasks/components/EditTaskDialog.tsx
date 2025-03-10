import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskType } from "@/lib/types/tasks";
import TaskForm from "./TaskForm";
import { useState } from "react";

interface EditTaskDialogProps {
  task: TaskType | null;
  onClose: () => void;
}

export default function EditTaskDialog({ task, onClose }: EditTaskDialogProps) {
  const [open, setOpen] = useState(!!task);

  return (
    // TODO: Fix "Blocked aria-hidden..." error
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit values below.</DialogDescription>
        </DialogHeader>
        {task && (
          <TaskForm
            initialData={task}
            onSubmitSuccess={() => {
              setOpen(false);
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
