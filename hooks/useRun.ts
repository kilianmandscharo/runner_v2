import { useEffect, useRef, useState } from "react";
import useBackgroundTimer from "./useBackgroundTimer";
import { RunState } from "../types/types";
import { CurrentRun } from "../database/schema";
import {
  startBackgroundLocationTask,
  stopBackgroundLocationTask,
} from "../task/backgroundLocation";
import { currentRunDb } from "../database/index";

export default function useRun(): {
  seconds: number;
  distance: number;
  state: RunState;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  end: () => Promise<void>;
  reset: () => Promise<void>;
  loading: boolean;
} {
  const [run, setRun] = useState<CurrentRun | undefined>(undefined);

  const databaseSyncTimer = useRef<NodeJS.Timeout>();
  const time = useRef<number>();
  const state = useRef<RunState>();

  const loading = run === undefined;

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
      updateRun(currentRun);
    })();
  }, []);

  const updateRun = (updatedRun: CurrentRun | undefined) => {
    setRun(updatedRun);
    time.current = updatedRun?.time;
    state.current = updatedRun?.state as RunState;
  };

  const incrementRunTime = () => {
    if (time.current !== undefined) {
      time.current = time.current + 1;
    }
    setRun((prev) => (prev ? { ...prev, time: prev.time + 1 } : prev));
  };

  const updateRunTime = (newTime: number) => {
    setRun((prev) => (prev ? { ...prev, time: newTime } : prev));
    time.current = newTime;
  };

  const updateRunState = (newState: RunState) => {
    setRun((prev) => (prev ? { ...prev, state: newState } : prev));
    state.current = newState;
  };

  const updateRunDistance = (distance: number) => {
    setRun((prev) => (prev ? { ...prev, distance } : prev));
  };

  const startDatabaseSync = () => {
    databaseSyncTimer.current = setInterval(async () => {
      const distance = await currentRunDb.getDistance();
      updateRunDistance(distance);
      if (time.current !== undefined && state.current !== undefined) {
        await currentRunDb.updateRun({
          time: time.current,
          state: state.current,
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
    const newRun = await currentRunDb.createCurrentRun();
    updateRun(newRun);
  };

  return {
    distance: run?.distance ?? 0,
    seconds: run?.time ?? 0,
    state: (run?.state as RunState) ?? RunState.Prestart,
    start,
    stop,
    end,
    reset,
    loading,
  };
}
