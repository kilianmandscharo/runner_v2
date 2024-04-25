import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { currentRunDb } from "../database/currentRunDatabase";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    return error;
  }
  if (!data) {
    return;
  }
  const locations = (data as any).locations as Location.LocationObject[];
  await currentRunDb.addLocations(
    locations.map((l) => ({
      timestamp: l.timestamp,
      lon: l.coords.longitude,
      lat: l.coords.latitude,
      speed: l.coords.speed ?? 0,
      altitude: l.coords.altitude ?? 0,
    })),
  );
  console.log(`[INFO] Added ${locations.length} locations`);
});

export async function startBackgroundLocationTask() {
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5,
    distanceInterval: 0,
  });
  console.log("[INFO] Background location started");
}

export async function stopBackgroundLocationTask() {
  const registered =
    await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  if (registered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log("[INFO] Background location stopped");
  }
}
