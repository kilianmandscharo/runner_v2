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
