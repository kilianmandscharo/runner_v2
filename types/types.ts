export interface Run {
  id: number;
  start: string;
  end: string;
  time: number;
  distance: number;
  path: Location[];
}

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
