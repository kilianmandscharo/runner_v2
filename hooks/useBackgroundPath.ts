import { useEffect, useRef, useState } from "react";
import { Location } from "../types/types";
import * as Storage from "../storage/storage";
import useBackgroundLocation from "./useBackgroundLocation";

export default function useBackgroundPath(): {
  permissionGranted: boolean;
  path: Location[];
  distance: number;
  startPath: () => Promise<void>;
  stopPath: () => Promise<void>;
  resetPath: () => Promise<void>;
} {
  const [distance, setDistance] = useState<number>(0);
  const path = useRef<Location[]>([]);
  const intervalID = useRef<NodeJS.Timer | null>(null);

  const { permissionGranted, startLocation, stopLocation } =
    useBackgroundLocation();

  useEffect(() => {
    Storage.getLocations().then(handleNewLocations);

    return () => {
      if (intervalID.current) {
        clearInterval(intervalID.current);
      }
    };
  }, []);

  const startPath = async () => {
    if (intervalID.current === null) {
      intervalID.current = setInterval(() => {
        Storage.getLocations().then(handleNewLocations);
      }, 1000);
    }
    await startLocation();
  };

  const stopPath = async () => {
    if (intervalID.current) {
      clearInterval(intervalID.current);
      intervalID.current = null;
      await stopLocation();
    }
  };

  const resetPath = async () => {
    await stopLocation();
    setDistance(0);
    path.current = [];
  };

  const handleNewLocations = (locations: Location[]) => {
    path.current = [...path.current, ...locations];
    setDistance((prev) => prev + 1);
    Storage.deleteLocations();

    // let newDistance = 0;
    // locations.forEach((location, i) => {
    //   const toPoint =
    //     i === 0 ? path.current[path.current.length - 1] : locations[i - 1];
    //   newDistance += calculatePointDistance(location, toPoint);
    // });
    //
    // setDistance((prev) => prev + newDistance);
  };

  return {
    permissionGranted,
    path: path.current,
    distance,
    startPath,
    stopPath,
    resetPath,
  };
}
