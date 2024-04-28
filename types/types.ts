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
export type HistoryRunFull = Omit<HistoryRun, "path"> & {
  path: Location[];
};
export type HistoryRunPartial = Omit<HistoryRunFull, "path">;
export type Location = InferSelectModel<typeof location>;
