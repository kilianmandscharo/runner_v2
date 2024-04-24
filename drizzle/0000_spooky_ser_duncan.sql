CREATE TABLE `currentRun` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start` text DEFAULT '2024-04-22T19:21:59.348Z' NOT NULL,
	`end` text,
	`state` text DEFAULT 'Started' NOT NULL,
	`time` integer DEFAULT 0 NOT NULL,
	`distance` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currentRunLocation` (
	`id` integer NOT NULL,
	`lon` integer NOT NULL,
	`lat` integer NOT NULL,
	`speed` integer NOT NULL,
	`altitude` integer NOT NULL,
	`current_run_id` integer,
	FOREIGN KEY (`current_run_id`) REFERENCES `currentRun`(`id`) ON UPDATE no action ON DELETE no action
);
