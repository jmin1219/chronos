"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { ProjectType } from "@/lib/types/projects";
import { TASK_PRIORITIES, TaskPriorityKey } from "@/lib/utils";
import { useState } from "react";

export default function TasksFilters({ filters, setFilters }) {
  const { data: projects = [] } = useProjectsQuery();

  const [openProjectMenu, setOpenProjectMenu] = useState(false);
  const [openPriorityMenu, setOpenPriorityMenu] = useState(false);

  const toggleSelection = (
    field: "projectIds" | "priorities",
    value: number | string
  ) => {
    setFilters((prev) => {
      const updatedFilters = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];

      return prev[field] === updatedFilters
        ? prev
        : { ...prev, [field]: updatedFilters };
    });
  };

  const toggleDoneFilter = () => {
    setFilters((prev) => ({
      ...prev,
      completed: prev.completed === null ? 0 : prev.completed ? null : 1,
    }));
  };

  return (
    <div className="flex gap-4 items-center justify-end mb-4">
      <span className="text-sm font-semibold">FILTERS:</span>

      {/* DONE FILTER */}
      {/* TODO: When clicked rotate between "All Tasks", "Not Done", and "Done" */}
      <Button variant="outline" onClick={toggleDoneFilter}>
        {filters.completed === null
          ? "All Tasks"
          : filters.completed
          ? "Done"
          : "Not Done"}
      </Button>

      {/* PROJECT FILTER */}
      <DropdownMenu open={openProjectMenu} onOpenChange={setOpenProjectMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Project</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {projects.map((project: ProjectType) => (
            <DropdownMenuCheckboxItem
              key={project.id}
              checked={filters.projectIds.includes(project.id)}
              onCheckedChange={(isChecked) =>
                toggleSelection("projectIds", project.id)
              }
              onSelect={(e) => e.preventDefault()} // Prevent menu from closing
            >
              {project.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* PRIORITY FILTER */}
      <DropdownMenu open={openPriorityMenu} onOpenChange={setOpenPriorityMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Priority</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {["must-do", "should-do", "could-do"].map((priority) => {
            const priorityKey = priority as TaskPriorityKey;

            return (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={filters.priorities.includes(priority)}
                onCheckedChange={() => toggleSelection("priorities", priority)}
                onSelect={(e) => e.preventDefault()} // Prevent menu from closing
              >
                <span>{TASK_PRIORITIES[priorityKey].title}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* DUE DATE FILTER */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Due Date</Button>
        </DropdownMenuTrigger>
        {/* TODO: Add ranges (no single date selection): Today, Overdue, This Week, This Month */}
        <DropdownMenuContent></DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
