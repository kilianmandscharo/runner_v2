import { useCallback, useState } from "react";
import { Location } from "../types/types";
import { calculatePointDistance } from "../utils/utils";
import useForegroundLocation from "./useForegroundLocation";

export default function usePath(): {
  startPath: () => void;
  stopPath: () => void;
  resetPath: () => void;
  path: Location[];
  distance: number;
  permissionStatus: boolean;
} {
  const [path, setPath] = useState<Location[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);

  const handleNewLocation = useCallback(
    (location: Location) => {
      if (path.length > 0) {
        const distanceToLastPathPoint = calculatePointDistance(
          path[path.length - 1],
          location
        );
        setDistance((prev) => prev + distanceToLastPathPoint);
      }

      setPath((prev) => [...prev, location]);
    },
    [path]
  );

  const { permissionStatus } = useForegroundLocation(
    handleNewLocation,
    running
  );

  const start = () => {
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setPath([]);
    setDistance(0);
  };

  return {
    startPath: start,
    stopPath: stop,
    resetPath: reset,
    path,
    distance,
    permissionStatus,
  };
}
