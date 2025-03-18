import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TaskPriorityKey = "must-do" | "should-do" | "could-do";

export type TaskPriority = {
  icon: string;
  color: string;
  title: string;
};

export const TASK_PRIORITIES: Record<TaskPriorityKey, TaskPriority> = {
  "must-do": {
    icon: "🔴",
    color: "#FF5313",
    title: "🔴 Must Do",
  },
  "should-do": {
    icon: "🟡",
    color: "#FFFA31",
    title: "🟡 Should Do",
  },
  "could-do": {
    icon: "🔵",
    color: "#3181FF",
    title: "🔵 Could Do",
  },
};

// TODO: Create a relative Date calculator

// TODO: Create a duration calculator (min, sec)
