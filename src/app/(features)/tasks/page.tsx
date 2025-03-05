"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import TasksTab from "./components/TasksTab";
import ProjectsTab from "./components/ProjectsTab";

export default function TasksPage() {
  return (
    <Tabs defaultValue="tasks">
      {/* TODO: Fix UI of Tab bar */}
      <TabsList className="flex my-2 gap-4">
        <TabsTrigger
          value="tasks"
          className="flex items-center gap-2 text-md font-semibold px-4"
        >
          <span>✅</span> Tasks
        </TabsTrigger>
        <TabsTrigger
          value="projects"
          className="flex items-center gap-2 text-md font-semibold px-4"
        >
          <span>🗂️</span> Projects
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tasks">
        <TasksTab />
      </TabsContent>
      <TabsContent value="projects">
        <ProjectsTab />
      </TabsContent>
    </Tabs>
  );
}
