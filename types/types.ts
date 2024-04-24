export interface Run {
  id: number;
  start: string;
  end: string;
  time: number;
  distance: number;
  path: Location[];
}

export interface Location {
  timestamp: number;
  lon: number;
  lat: number;
  speed: number;
  altitude: number;
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
