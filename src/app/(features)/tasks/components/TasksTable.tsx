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
  useUpdateTask,
} from "@/hooks/useTasksQuery";
import { ProjectType } from "@/lib/types/projects";
import { TaskType } from "@/lib/types/tasks";
import { TASK_PRIORITIES, TaskPriorityKey } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
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
import { useState } from "react";
import EditTaskDialog from "./EditTaskDialog";

export default function TasksTable() {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

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

  const projectMap: Record<number, { name: string; color: string }> =
    projects.reduce(
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
      enableSorting: true,
      sortingFn: "basic",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <Button
            variant="ghost"
            onClick={() =>
              updateTaskMutation.mutate({
                ...task,
                completed: !task.completed,
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
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === "all") return true;
        return filterValue === "done"
          ? row.getValue(columnId) === 1
          : row.getValue(columnId) === 0;
      },
    },
    {
      accessorKey: "title",
      header: "Task",
      enableSorting: false,
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
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const priorityOrder = ["must-do", "should-do", "could-do"];
        return (
          priorityOrder.indexOf(rowA.original.priority) -
          priorityOrder.indexOf(rowB.original.priority)
        );
      },
      cell: ({ row }) => {
        const priorityKey = row.original.priority as TaskPriorityKey;
        return (
          <Badge
            variant="outline"
            style={{
              borderColor: TASK_PRIORITIES[priorityKey].color,
              borderWidth: "2px",
            }}
          >
            <div className="flex items-center">
              <span>{TASK_PRIORITIES[priorityKey].title}</span>
            </div>
          </Badge>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return row.getValue(columnId) === filterValue;
      },
    },
    {
      accessorKey: "projectId",
      header: "Project",
      enableSorting: true,
      sortingFn: "basic",
      cell: ({ row }) => {
        const project = projectMap[row.original.projectId];
        return (
          <Badge style={{ backgroundColor: project.color }}>
            {project.name}
          </Badge>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return row.getValue(columnId) === parseInt(filterValue);
      },
    },
    {
      accessorKey: "estimatedDuration",
      header: "Estimated Duration",
      enableSorting: true,
      sortingFn: "basic",
      cell: ({ row }) => <span>{row.original.estimatedDuration} min</span>,
    },
    {
      accessorKey: "actualDuration",
      header: "Time Spent",
      enableSorting: true,
      sortingFn: "basic",
      cell: ({ row }) => <span>{row.original.actualDuration} min</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Due",
      enableSorting: true,
      sortingFn: "basic",
      cell: ({ row }) => {
        return row.original.dueDate
          ? format(new Date(row.original.dueDate * 1000), "MMM dd, yyyy")
          : "--";
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        const dueDateValue = row.getValue(columnId) as number;
        if (!dueDateValue) return false;

        const dueDate = new Date(dueDateValue * 1000);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Get Sunday of the week, ie. start of week

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End week on Saturday

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        if (filterValue === "today")
          return dueDate.toDateString() === today.toDateString();
        if (filterValue === "overdue") return dueDate < today;
        if (filterValue === "thisWeek")
          return dueDate >= startOfWeek && dueDate <= endOfWeek;
        if (filterValue === "thisMonth")
          return dueDate >= startOfMonth && dueDate <= endOfMonth;
        return true;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setTimeout(() => setSelectedTask(task))}
                >
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
            {/* Edit Task Dialog */}
            {selectedTask && (
              <EditTaskDialog
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
              />
            )}
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  if (tasksLoading || projectsLoading) {
    return <p>Loading tasks and projects...</p>;
  }

  if (tasksError || projectsError) {
    return <p>Error Loading data. Please try again.</p>;
  }

  return (
    <div>
      {/* Filter Select Inputs */}
      <div className="flex mb-4 justify-center items-center">
        <div className="border py-2 px-5 rounded-xl flex gap-5 items-center">
          <span className="text-muted-foreground font-semibold text-sm">
            FILTERS:
          </span>
          {/* Done Filter */}
          <select
            onChange={(e) =>
              table.getColumn("completed")?.setFilterValue(e.target.value)
            }
            defaultValue="all"
          >
            <option value="all">All Tasks</option>
            <option value="done">Done</option>
            <option value="notDone">Not Done</option>
          </select>
          {/* Project Filter */}
          <select
            onChange={(e) =>
              table.getColumn("projectId")?.setFilterValue(e.target.value)
            }
            defaultValue="all"
          >
            <option value="all">All Projects</option>
            {projects.map((project: ProjectType) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {/* Priority Filter */}
          <select
            onChange={(e) =>
              table.getColumn("priority")?.setFilterValue(e.target.value)
            }
            defaultValue="all"
          >
            <option value="all">All Priorities</option>
            {Object.keys(TASK_PRIORITIES).map((key) => (
              <option key={key} value={key}>
                {TASK_PRIORITIES[key as TaskPriorityKey].title}
              </option>
            ))}
          </select>
          {/* Due Date Filter */}
          <select
            onChange={(e) =>
              table.getColumn("dueDate")?.setFilterValue(e.target.value)
            }
            defaultValue="all"
          >
            <option value="all">All Due</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.column.getCanSort() ? (
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      className="flex items-center gap-1"
                    >
                      <p>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </p>
                      <p>
                        {header.column.getIsSorted() === "asc"
                          ? "🔼"
                          : header.column.getIsSorted() === "desc"
                          ? "🔽"
                          : ""}
                      </p>
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
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
    </div>
  );
}
