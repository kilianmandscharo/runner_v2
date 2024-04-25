CREATE TABLE `currentRun` (
	`id` integer PRIMARY KEY NOT NULL,
	`start` text,
	`end` text,
	`state` text DEFAULT 'Prestart' NOT NULL,
	`time` integer DEFAULT 0 NOT NULL,
	`distance` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `location` (
	`id` integer PRIMARY KEY NOT NULL,
	`timestamp` integer NOT NULL,
	`lon` integer NOT NULL,
	`lat` integer NOT NULL,
	`speed` integer NOT NULL,
	`altitude` integer NOT NULL
);
