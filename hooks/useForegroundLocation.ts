import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Location as LocationItem } from "../types/types";

export default function useForegroundLocation() {
  const [location, setLocation] = useState<null | LocationItem>(null);
  const [permissionError, setPermissionError] = useState<null | string>(null);

  useEffect(() => {
    (async () => {
      const error = await requestPermisions();
      if (error !== null) {
        setPermissionError(error);
        return;
      }
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5,
          distanceInterval: 0,
        },
        (newLocation) => {
          setLocation({
            timestamp: newLocation.timestamp,
            long: newLocation.coords.longitude,
            lat: newLocation.coords.latitude,
            speed: newLocation.coords.speed ?? 0,
            altitude: newLocation.coords.altitude ?? 0,
          });
        }
      );
    })();
  }, []);

  const requestPermisions = async (): Promise<string | null> => {
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      return "Foreground permission denied";
    }
    return null;
  };

  return { location, permissionError };
}
