"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import TasksList from "./components/TasksList";
import ProjectsList from "./components/ProjectsList";

export default function TasksPage() {
  return (
    <Tabs defaultValue="tasks">
      <TabsList>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <TasksList />
      </TabsContent>
      <TabsContent value="projects">
        <ProjectsList />
      </TabsContent>
    </Tabs>
  );
}
