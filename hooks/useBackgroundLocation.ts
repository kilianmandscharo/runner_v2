import { useEffect, useState } from "react";
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
  permissionGranted: boolean;
  startLocation: () => Promise<void>;
  stopLocation: () => Promise<void>;
} {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(true);

  const requestPermisions = async (): Promise<string | null> => {
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      return "Foreground permission denied";
    }
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      return "Background permission denied";
    }
    return null;
  };

  useEffect(() => {
    requestPermisions()
      .then((err) => {
        if (err !== null) {
          setPermissionGranted(false);
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
      });

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

  return { permissionGranted, startLocation, stopLocation };
}
