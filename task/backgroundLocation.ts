import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { currentRunDb } from "../database/index";
import { logDebug, logError, logInfo } from "../logger/logger";

const LOCATION_TASK_NAME = "background-location-task";

let lastTimestamp: number | null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error || !data) {
    return error;
  }

  const locations = (data as any).locations as Location.LocationObject[];

  if (!locations || locations.length === 0) {
    logDebug(`Received no locations`);
    return;
  }

  logDebug(`Received ${locations.length} locations`);

  const timestamp = locations[locations.length - 1].timestamp;

  if (lastTimestamp !== null) {
    let elapsed = (timestamp - lastTimestamp) / 1000;
    if (elapsed < 5) {
      return;
    }
  }

  lastTimestamp = timestamp;

  try {
    const added = await currentRunDb.addLocations(
      locations.map((loc) => ({
        timestamp: loc.timestamp,
        lon: loc.coords.longitude,
        lat: loc.coords.latitude,
        speed: loc.coords.speed ?? 0,
        altitude: loc.coords.altitude ?? 0,
      })),
    );
    logDebug(`Added ${added} locations to database`);
  } catch (error) {
    logError("Failed to add new locations to database", error);
  }
});

export async function startBackgroundLocationTask() {
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5,
    distanceInterval: 5,
  });
  logInfo("Background location started");
}

export async function stopBackgroundLocationTask() {
  const registered =
    await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  if (registered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    logInfo("Background location stopped");
  }
}
