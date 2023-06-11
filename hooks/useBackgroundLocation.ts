import { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

export default function useBackgroundLocation() {
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const [permissionDenied, setPermissionDenied] = useState<null | string>(null);

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

  const stopLocationTask = () => {
    TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const permissionError = await requestPermisions();
      if (permissionError !== null) {
        setPermissionDenied(permissionError);
        return;
      }
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5,
        distanceInterval: 0,
      });
    })();

    return () => stopLocationTask();
  }, []);

  return [location, permissionDenied];
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    return error;
  }
  if (data) {
    console.log(data);
  }
});