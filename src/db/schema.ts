import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// TASKS TABLE
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  projectId: integer("project_id").references(() => projects.id),
  estimatedDuration: integer("estimated_duration"), // Expected time to complete the task
  actualDuration: integer("actual_duration").default(0), // Auto-calculated via sum of all deep work sessions linked to a task
  dueDate: integer("due_date").default(sql<number>`NULL`), // Stores UNIX timestamp
  description: text("description"),
  completed: integer("completed").default(0),
});

export const taskSchedules = sqliteTable("task_schedules", {
  id: integer("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id), // Links (multiple) schedules to a single task
  scheduledStart: integer("scheduled_start"), // Stores UNIX timestamp
  scheduledEnd: integer("scheduled_end"), // Stores UNIX timestamp
  actualStart: integer("actual_start").default(0), // Only used if task is completed without a logged deep work session
  actualEnd: integer("actual_end").default(0),
});

// PROJECTS TABLE
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// DEEP WORK SESSIONS TABLE
export const deepWorkSessions = sqliteTable("deepwork_sessions", {
  id: integer("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id), // Links session to a scheduled task
  startTime: integer("start_time"), // Stores UNIX timestamp
  endTime: integer("end_time"), // Stores UNIX timestamp
  duration: integer("duration"), // Auto-calculated
});

// HABITS TABLE
export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  frequency: text("frequency"), // "daily", "weekly", "custom", etc.
  streak: integer("streak").default(0),
  lastCompleted: integer("last_completed").default(0), // Stores UNIX timestamp
  longestStreak: integer("longest_streak").default(0),
});
