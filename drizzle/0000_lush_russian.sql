CREATE TABLE `history` (
	`id` integer PRIMARY KEY NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`time` integer NOT NULL,
	`distance` real NOT NULL,
	`path` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currentRunLocation` (
	`id` integer PRIMARY KEY NOT NULL,
	`timestamp` integer NOT NULL,
	`lon` integer NOT NULL,
	`lat` integer NOT NULL,
	`speed` integer NOT NULL,
	`altitude` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currentRun` (
	`id` integer PRIMARY KEY NOT NULL,
	`start` text,
	`end` text,
	`time` integer DEFAULT 0 NOT NULL,
	`distance` real DEFAULT 0 NOT NULL,
	`state` text DEFAULT 'Prestart' NOT NULL
);
