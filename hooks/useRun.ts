import { useEffect, useRef, useState } from "react";
import useBackgroundTimer from "./useBackgroundTimer";
import { RunState } from "../types/types";
import { CurrentRun } from "../database/schema";
import {
  startBackgroundLocationTask,
  stopBackgroundLocationTask,
} from "../task/backgroundLocation";
import { currentRunDb } from "../database/currentRunDatabase";

export default function useRun(): {
  seconds: number;
  distance: number;
  state: RunState;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  end: () => Promise<void>;
  reset: () => Promise<void>;
} {
  const [run, setRun] = useState<CurrentRun | undefined>(undefined);

  const databaseSyncTimer = useRef<NodeJS.Timeout>();

  const { startTimer, stopTimer, resetTimer } = useBackgroundTimer(
    run?.time ?? 0,
    (time: number) => updateRunTime(time),
    () => incrementRunTime(),
  );

  useEffect(() => {
    (async () => {
      const currentRun =
        (await currentRunDb.getCurrentRun()) ??
        (await currentRunDb.createCurrentRun());
      setRun(currentRun);
    })();
    currentRunDb.getCurrentRun().then(setRun);
  }, []);

  const incrementRunTime = () => {
    setRun((prev) => (prev ? { ...prev, time: prev.time + 1 } : prev));
  };

  const updateRunTime = (time: number) => {
    setRun((prev) => (prev ? { ...prev, time } : prev));
  };

  const updateRunState = (state: RunState) => {
    setRun((prev) => (prev ? { ...prev, state } : prev));
  };

  const updateRunDistance = (distance: number) => {
    setRun((prev) => (prev ? { ...prev, distance } : prev));
  };

  const startDatabaseSync = () => {
    databaseSyncTimer.current = setInterval(async () => {
      const distance = await currentRunDb.getDistance();
      updateRunDistance(distance);
      if (run) {
        await currentRunDb.updateRun({
          time: run.time,
          state: run.state as RunState,
        });
      }
    }, 5000);
  };

  const stopDatabaseSync = () => {
    if (databaseSyncTimer.current) {
      clearInterval(databaseSyncTimer.current);
    }
  };

  const start = async () => {
    await currentRunDb.updateRun({
      start: new Date().toISOString(),
      state: RunState.Started,
    });
    startTimer();
    await startBackgroundLocationTask();
    startDatabaseSync();
    updateRunState(RunState.Started);
  };

  const stop = async () => {
    stopTimer();
    await stopBackgroundLocationTask();
    stopDatabaseSync();
    updateRunState(RunState.Stopped);
  };

  const end = async () => {
    stopTimer();
    await stopBackgroundLocationTask();
    stopDatabaseSync();
    updateRunState(RunState.Finished);
  };

  const reset = async () => {
    resetTimer();
    await currentRunDb.deleteCurrentRun();
  };

  return {
    distance: run?.distance ?? 0,
    seconds: run?.time ?? 0,
    state: (run?.state as RunState) ?? RunState.Prestart,
    start,
    stop,
    end,
    reset,
  };
}
