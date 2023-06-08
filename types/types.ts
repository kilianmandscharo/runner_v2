export interface Run {
  id: number;
  start: string;
  end: string;
  time: number;
  distance: number;
  path: Location[];
}

export function newRun(): Run {
  return {
    id: -1,
    start: "",
    end: "",
    time: 0,
    distance: 0,
    path: [],
  };
}

export interface Location {
  timestamp: number;
  long: number;
  lat: number;
  speed: number;
  altitude: number;
}
