import { useEffect, useRef, useState } from "react";
import { Location } from "../types/types";
import useBackgroundLocation from "./useBackgroundLocation";
import { calculatePointDistance } from "../utils/utils";
import * as Storage from "../storage/storage";

export default function useBackgroundPath(): {
  path: Location[];
  distance: number;
  startPath: () => Promise<void>;
  stopPath: () => Promise<void>;
  resetPath: () => Promise<void>;
} {
  const [distance, setDistance] = useState<number>(0);
  const path = useRef<Location[]>([]);
  const intervalID = useRef<NodeJS.Timer | null>(null);

  const { startLocation, stopLocation } = useBackgroundLocation();

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
    if (locations.length === 0) {
      return;
    }

    Storage.deleteLocations();

    let newDistance = 0;

    if (path.current.length === 0) {
      for (let i = 1; i < locations.length; i++) {
        newDistance += calculatePointDistance(locations[i - 1], locations[i]);
      }
    } else {
      for (let i = 0; i < locations.length; i++) {
        newDistance += calculatePointDistance(
          i === 0 ? path.current[path.current.length - 1] : locations[i - 1],
          locations[i]
        );
      }
    }

    path.current = [...path.current, ...locations];
    setDistance((prev) => prev + newDistance);
  };

  return {
    path: path.current,
    distance,
    startPath,
    stopPath,
    resetPath,
  };
}
