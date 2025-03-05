"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import {
  useDeleteTask,
  useTasksQuery,
  useToggleTaskComplete,
} from "@/hooks/useTasksQuery";
import { TaskType } from "@/lib/types/tasks";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreVerticalIcon } from "lucide-react";

export default function TasksTable() {
  const toggleTaskCompleteMutation = useToggleTaskComplete();
  const deleteTaskMutation = useDeleteTask();

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasksQuery();

  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectsQuery();

  const projectMap = projects.reduce((acc, project) => {
    acc[project.id] = project;
    return acc;
  }, {} as Record<number, { name: string; color: string }>);

  const columns: ColumnDef<TaskType>[] = [
    {
      accessorKey: "completed",
      header: "Done?",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.completed}
          onCheckedChange={(checked) =>
            toggleTaskCompleteMutation.mutate({
              taskId: row.original.id,
              completed: !!checked,
            })
          }
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Task",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.title}</p>
          {row.original.description && (
            <p className="text-xs text-gray-500">{row.original.description}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priorityIcons = {
          "must-do": "🔴",
          "should-do": "🟡",
          "could-do": "🔵",
        };
        return (
          <div className="flex items-center gap-2">
            {/* TODO: Make sure correct icon shows up based on priority level. */}
            <span>{priorityIcons[row.original.priority]}</span>
            <span className="capitalize">
              {row.original.priority.replace("-", " ")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "project",
      header: "Project",
      cell: ({ row }) => {
        const project = projectMap[row.original.projectId];
        return (
          <Badge style={{ backgroundColor: project.color }}>
            {project.name}
          </Badge>
        );
      },
    },
    {
      accessorKey: "estimatedDuration",
      header: "Estimated Duration",
      cell: ({ row }) => <span>{row.original.estimatedDuration} min</span>,
    },
    {
      accessorKey: "actualDuration",
      header: "Time Spent",
      cell: ({ row }) => <span>{row.original.actualDuration} min</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Due",
      cell: ({ row }) => {
        return row.original.dueDate
          ? format(new Date(row.original.dueDate * 1000), "MMM dd, yyyy")
          : "---";
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => <MoreVerticalIcon />,
    },
  ];

  const table = useReactTable({
    data: tasks ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (tasksLoading || projectsLoading) {
    return <p>Loading tasks and projects...</p>;
  }

  if (tasksError || projectsError) {
    return <p>Error Loading data. Please try again.</p>;
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-6">
              No tasks found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
