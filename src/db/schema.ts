import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  completed: integer("completed").default(0),
});

export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  streak: integer("streak").default(0),
});
