import { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Storage from "../storage/storage";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    return error;
  }
  if (data) {
    const locations = (data as any).locations as Location.LocationObject[];
    for (const location of locations) {
      console.log(
        "storing:",
        location.coords.longitude,
        location.coords.latitude
      );
      await Storage.storeLocation({
        timestamp: location.timestamp,
        lon: location.coords.longitude,
        lat: location.coords.latitude,
        speed: location.coords.speed ?? 0,
        altitude: location.coords.altitude ?? 0,
      });
    }
  }
});

export default function useBackgroundLocation(): {
  startLocation: () => Promise<void>;
  stopLocation: () => Promise<void>;
} {
  useEffect(() => {
    return () => {
      stopLocation();
    };
  }, []);

  const startLocation = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 5,
      distanceInterval: 0,
    });
    console.log("[INFO] Background location started");
  };

  const stopLocation = async () => {
    const registered = await TaskManager.isTaskRegisteredAsync(
      LOCATION_TASK_NAME
    );
    if (registered) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("[INFO] Background location stopped");
    }
  };

  return { startLocation, stopLocation };
}
