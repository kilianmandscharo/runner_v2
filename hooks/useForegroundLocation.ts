import { useEffect } from "react";
import * as Location from "expo-location";
import { Location as LocationItem } from "../types/types";

export default function useForegroundLocation(
  callback: (location: LocationItem) => void,
  isSubscribed: boolean
): {
  permissionStatus: boolean;
} {
  const [status, requestPermisions] = Location.useForegroundPermissions();

  useEffect(() => {
    let isMounted = true;
    let locationSubscription: Location.LocationSubscription | null = null;

    const start = async () => {
      try {
        await requestPermisions();
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5,
            distanceInterval: 0,
          },
          (location) => handleNewLocation(location, isMounted)
        );
      } catch (e) {
        if (e instanceof Error) {
          throw e;
        }
      }
    };

    if (isSubscribed) {
      start();
    }

    return () => {
      isMounted = false;
      locationSubscription?.remove();
    };
  }, [callback, isSubscribed]);

  const handleNewLocation = (
    location: Location.LocationObject,
    isMounted: boolean
  ) => {
    if (!isMounted) return;
    callback({
      timestamp: location.timestamp,
      lon: location.coords.longitude,
      lat: location.coords.latitude,
      speed: location.coords.speed ?? 0,
      altitude: location.coords.altitude ?? 0,
    });
  };

  return { permissionStatus: status?.status === "granted" };
}
