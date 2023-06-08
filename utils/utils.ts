import { Location } from "../types/types";

const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const calculatePointDistance = (p1: Location, p2: Location): number => {
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
};
