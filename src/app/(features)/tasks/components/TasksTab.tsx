"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddTaskDialog from "./AddTaskDialog";
import TasksTable from "./TasksTable";
import { Separator } from "@/components/ui/separator";

export default function TasksTab() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row justify-between py-3 px-6">
          <div>
            <h1 className="font-bold text-2xl">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your tasks and stay on top of what you need to do.
            </p>
          </div>

          <AddTaskDialog />
        </CardHeader>
        <Separator />
        <CardContent className="p-5">
          <TasksTable />
        </CardContent>
      </Card>
    </div>
  );
}
