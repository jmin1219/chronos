"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import TaskForm from "./TaskForm";
import { useState } from "react";

export default function AddTaskDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild autoFocus={open}>
        <Button>Add New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Fill out the details to create a new task.
          </DialogDescription>
        </DialogHeader>
        <TaskForm onSubmitSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
