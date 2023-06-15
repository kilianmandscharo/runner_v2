import { useEffect, useRef, useState } from "react";
import { Location } from "../types/types";
import * as Storage from "../storage/storage";
import { calculatePointDistance } from "../utils/utils";
import useBackgroundLocation from "./useBackgroundLocation";

export default function useBackgroundPath() {
  const path = useRef<Location[]>([]);
  const [distance, setDistance] = useState<number>(0);

  useBackgroundLocation();

  const handleNewLocations = (locations: Location[]) => {
    path.current = [...path.current, ...locations];

    // let newDistance = 0;
    // locations.forEach((location, i) => {
    //   const toPoint =
    //     i === 0 ? path.current[path.current.length - 1] : locations[i - 1];
    //   newDistance += calculatePointDistance(location, toPoint);
    // });
    //
    // setDistance((prev) => prev + newDistance);

    Storage.deleteLocations();
  };

  useEffect(() => {
    Storage.getLocations().then(handleNewLocations);

    const intervalID = setInterval(() => {
      Storage.getLocations().then(handleNewLocations);
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return distance;
}
