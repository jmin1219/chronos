"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ProjectType } from "@/lib/types/projects";
import { TaskType } from "@/lib/types/tasks";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Circle,
  CircleCheckBig,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

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

  const projectMap = projects.reduce(
    (
      acc: Record<number, { name: string; color: string }>,
      project: ProjectType
    ) => {
      acc[project.id] = project;
      return acc;
    },
    {} as Record<number, { name: string; color: string }>
  );

  const columns: ColumnDef<TaskType>[] = [
    {
      accessorKey: "completed",
      header: "Done",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <Button
            variant="ghost"
            onClick={() =>
              toggleTaskCompleteMutation.mutate({
                taskId: task.id,
                completed: task.completed ? 0 : 1,
              })
            }
            className="transition-all duration-200 ease-in-out"
          >
            {task.completed ? (
              <CircleCheckBig className="h-8 w-8 text-green-500 scale-150 transition-transform duration-200 bg-green-100 rounded-full" />
            ) : (
              <Circle className="h-8 w-8 text-gray-400 hover:text-gray-600 scale-150 transition-transform duration-200" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Task",
      cell: ({ row }) => {
        const MAX_LENGTH = 30;
        const description = row.original.description || "";
        const truncatedDescription =
          description.length > MAX_LENGTH
            ? description.substring(0, MAX_LENGTH) + "..."
            : description;
        return (
          <div>
            <p className="font-semibold">{row.original.title}</p>
            {description && (
              <p className="text-xs text-gray-500">{truncatedDescription}</p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priorityIcons: Record<string, { icon: string; color: string }> = {
          "must-do": { icon: "🔴", color: "#FF3131" },
          "should-do": { icon: "🟡", color: "#FFFA31" },
          "could-do": { icon: "🔵", color: "#3181FF" },
        };
        return (
          <Badge
            variant="outline"
            style={{
              borderColor: priorityIcons[row.original.priority].color,
              borderWidth: "2px",
            }}
          >
            <div className="flex items-center gap-2">
              <span>{priorityIcons[row.original.priority].icon}</span>
              <span className="capitalize">
                {row.original.priority.replace("-", " ")}
              </span>
            </div>
          </Badge>
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
          : "--";
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteTaskMutation.mutate(task.id)}
                className="text-red-600"
              >
                <Trash2 />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
