import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { currentRunDb } from "../database/index";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    return error;
  }
  if (!data) {
    return;
  }
  const locations = (data as any).locations as Location.LocationObject[];
  if (locations.length > 0) {
    const loc = locations[0];
    await currentRunDb.addLocation({
      timestamp: loc.timestamp,
      lon: loc.coords.longitude,
      lat: loc.coords.latitude,
      speed: loc.coords.speed ?? 0,
      altitude: loc.coords.altitude ?? 0,
    });
  }
  console.log(`[INFO] Added ${locations}`);
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
