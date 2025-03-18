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

export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}m ${seconds}s`;
}

export function formatRelativeDate(date: string | number | Date): string {
  const now = new Date();
  const targetDate = new Date(date);

  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const targetMidnight = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const diffInDays = Math.floor(
    (nowMidnight.getTime() - targetMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return "Today";
  }
  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  if (diffInDays < 14) {
    return "Last week";
  }

  return targetDate.toLocaleDateString();
}
