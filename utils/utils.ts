import { Time } from "../types/types";

const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export function calculatePointDistance<T extends { lon: number; lat: number }>(
  p1: T,
  p2: T,
): number {
  const earthRadius = 6371 * 1000;
  const dLat = degToRad(p2.lat - p1.lat);
  const dLon = degToRad(p2.lon - p1.lon);
  const lat1 = degToRad(p1.lat);
  const lat2 = degToRad(p2.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

export function calculateDistanceBetweenLocations<
  T extends { lon: number; lat: number },
>(locations: T[]): number {
  let distance = 0;
  for (let i = 0; i < locations.length - 1; i++) {
    distance += calculatePointDistance(locations[i], locations[i + 1]);
  }
  return distance;
}

export function getTimeFromSeconds(remainingSeconds: number): Time {
  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds = remainingSeconds - hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds - minutes * 60;
  const seconds = remainingSeconds;

  return {
    hours,
    minutes,
    seconds,
  };
}

export function formatTime(time: Time): string {
  const s = time.seconds < 10 ? `0${time.seconds}` : time.seconds.toString();
  const m = time.minutes < 10 ? `0${time.minutes}` : time.minutes.toString();
  const h = time.hours < 10 ? `0${time.hours}` : time.hours.toString();
  return `${h}:${m}:${s}`;
}

export function isDateGreaterOrEqual(d: Date, target?: Date): boolean {
  if (target === undefined) {
    return true;
  }

  // Only take the day, month and year into account
  const dWithoutTime = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const targetWithoutTime = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  return dWithoutTime >= targetWithoutTime;
}

export function isDateSmallerOrEqual(d: Date, target?: Date): boolean {
  if (target === undefined) {
    return true;
  }

  // Only take the day, month and year into account
  const dWithoutTime = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const targetWithoutTime = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  return dWithoutTime <= targetWithoutTime;
}
