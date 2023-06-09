import { useState, useRef } from "react";
import useBackgroundTimer from "./useBackgroundTimer";
import dayjs from "dayjs";
import { Run } from "../types/types";
import { DatabaseConnector } from "../database/database";
import useBackgroundPath from "./useBackgroundPath";

const dbConnector = new DatabaseConnector();

export default function useNewRun(): {
  permissionGranted: boolean;
  seconds: number;
  distance: number;
  started: boolean;
  finished: boolean;
  running: boolean;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  end: () => Promise<void>;
  reset: () => Promise<void>;
} {
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);

  const { startTimer, stopTimer, resetTimer, seconds } = useBackgroundTimer();
  const { permissionGranted, path, distance, startPath, stopPath, resetPath } =
    useBackgroundPath();

  const startTime = useRef<null | string>(null);

  console.log("distance:", distance);
  console.log("path:", path.length);

  const start = async () => {
    startTime.current = dayjs().toISOString();
    startTimer();
    await startPath();
    setStarted(true);
    setRunning(true);
  };

  const stop = async () => {
    stopTimer();
    await stopPath();
    setRunning(false);
  };

  const end = async () => {
    stopTimer();
    setRunning(false);
    setFinished(true);

    const run: Run = {
      id: -1,
      start: startTime.current ?? dayjs().toISOString(),
      end: dayjs().toISOString(),
      time: seconds,
      distance: distance,
      path: path,
    };

    try {
      await dbConnector.saveRun(run);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
    }
  };

  const reset = async () => {
    startTime.current = null;
    resetTimer();
    await resetPath();
    setFinished(false);
    setStarted(false);
  };

  return {
    permissionGranted,
    distance,
    seconds,
    started,
    finished,
    running,
    start,
    stop,
    end,
    reset,
  };
}
