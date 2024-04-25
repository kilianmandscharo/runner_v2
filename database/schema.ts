import { InferSelectModel } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const location = sqliteTable("location", {
  id: integer("id").primaryKey(),
  timestamp: integer("timestamp").notNull(),
  lon: integer("lon").notNull(),
  lat: integer("lat").notNull(),
  speed: integer("speed").notNull(),
  altitude: integer("altitude").notNull(),
});

export const currentRun = sqliteTable("currentRun", {
  id: integer("id").primaryKey(),
  start: text("start"),
  end: text("end"),
  state: text("state").notNull().default("Prestart"),
  time: integer("time").notNull().default(0),
  distance: real("distance").notNull().default(0),
});

export type CurrentRun = InferSelectModel<typeof currentRun>;
