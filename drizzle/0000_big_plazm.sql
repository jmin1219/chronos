CREATE TABLE `deepwork_sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`task_id` integer,
	`start_time` integer,
	`end_time` integer,
	`duration` integer,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`frequency` text,
	`streak` integer DEFAULT 0,
	`last_completed` integer DEFAULT 0,
	`longest_streak` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `task_schedules` (
	`id` integer PRIMARY KEY NOT NULL,
	`task_id` integer,
	`scheduled_start` integer,
	`scheduled_end` integer,
	`actual_start` integer DEFAULT 0,
	`actual_end` integer DEFAULT 0,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`project_id` integer,
	`estimated_duration` integer,
	`actual_duration` integer DEFAULT 0,
	`due_date` integer DEFAULT NULL,
	`description` text,
	`completed` integer DEFAULT 0,
	`priority` text DEFAULT 'could do',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
