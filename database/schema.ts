import { InferSelectModel } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const currentRun = sqliteTable("currentRun", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  start: text("start").notNull().default(new Date().toISOString()),
  end: text("end"),
  state: text("state").notNull().default("Started"),
  time: integer("time").notNull().default(0),
  distance: real("distance").notNull().default(0),
});

export type CurrentRun = InferSelectModel<typeof currentRun>;

export const location = sqliteTable("currentRunLocation", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timestamp: integer("id").notNull(),
  lon: integer("lon").notNull(),
  lat: integer("lat").notNull(),
  speed: integer("speed").notNull(),
  altitude: integer("altitude").notNull(),
  currentRunId: integer("current_run_id").references(() => currentRun.id),
});
