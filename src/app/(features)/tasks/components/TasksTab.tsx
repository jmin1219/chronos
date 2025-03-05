"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddTaskDialog from "./AddTaskDialog";
import { Separator } from "@/components/ui/separator";
import TasksFilters from "./TasksFilters";
import TasksTable from "./TasksTable";

export default function TasksTab() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center py-3 px-6">
          <p className="font-bold text-xl">Tasks List</p>
          <AddTaskDialog />
        </CardHeader>
        <Separator />
        <CardContent className="p-5">
          <TasksFilters />
          <TasksTable />
        </CardContent>
      </Card>
    </div>
  );
}
