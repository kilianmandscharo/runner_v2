import { InferSelectModel } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const location = sqliteTable("currentRunLocation", {
  id: integer("id").primaryKey(),
  timestamp: integer("timestamp").notNull(),
  lon: integer("lon").notNull(),
  lat: integer("lat").notNull(),
  speed: integer("speed").notNull(),
  altitude: integer("altitude").notNull(),
});

export const run = sqliteTable("currentRun", {
  id: integer("id").primaryKey(),
  start: text("start"),
  end: text("end"),
  time: integer("time").notNull().default(0),
  distance: real("distance").notNull().default(0),
  state: text("state").notNull().default("Prestart"),
});

export const history = sqliteTable("history", {
  id: integer("id").primaryKey(),
  start: text("start").notNull(),
  end: text("end").notNull(),
  time: integer("time").notNull(),
  distance: real("distance").notNull(),
  path: text("path").notNull(),
});

export const schema = {
  location,
  run,
  history,
};

export type Schema = typeof schema;
export type CurrentRun = InferSelectModel<typeof run>;
export type CurrentRunFull = CurrentRun & { path: Location[] };
export type HistoryRun = InferSelectModel<typeof history>;
export type Location = InferSelectModel<typeof location>;
