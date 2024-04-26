import { InferSelectModel } from "drizzle-orm";
import { history, location, run } from "../database/schema";

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

export enum RunState {
  Prestart = "Prestart",
  Started = "Started",
  Stopped = "Stopped",
  Finished = "Finished",
}

export type CurrentRun = InferSelectModel<typeof run>;
export type CurrentRunFull = CurrentRun & { path: Location[] };
export type HistoryRun = InferSelectModel<typeof history>;
export type HistoryRunFull = InferSelectModel<typeof history> & {
  path: Location[];
};
export type Location = InferSelectModel<typeof location>;
