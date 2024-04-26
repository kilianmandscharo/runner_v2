import { useEffect, useRef, useState } from "react";
import useBackgroundTimer from "./useBackgroundTimer";
import { RunState } from "../types/types";
import { CurrentRun } from "../types/types";
import {
  startBackgroundLocationTask,
  stopBackgroundLocationTask,
} from "../task/backgroundLocation";
import { currentRunDb } from "../database/index";
import { logError } from "../logger/logger";

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
  const [run, setRun] = useState<CurrentRun>({
    id: -1,
    start: null,
    end: null,
    state: RunState.Prestart,
    time: -1,
    distance: -1,
  });

  const databaseSyncTimer = useRef<NodeJS.Timeout>();
  const time = useRef<number>();
  const state = useRef<RunState>();

  const loading = run === undefined;

  const { startTimer, stopTimer, resetTimer } = useBackgroundTimer(
    run?.time ?? 0,
    (time: number) => updateRun({ time }),
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

  const updateRun = (updatedRun: Partial<CurrentRun>) => {
    setRun((prev) => ({ ...prev, ...updatedRun }));
    time.current = updatedRun?.time;
  };

  const incrementRunTime = () => {
    if (time.current !== undefined) {
      time.current = time.current + 1;
    }
    setRun((prev) => (prev ? { ...prev, time: prev.time + 1 } : prev));
  };

  const startDatabaseSync = () => {
    databaseSyncTimer.current = setInterval(async () => {
      const distance = await currentRunDb.getDistance();
      updateRun({ distance });
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
    try {
      const startDate = new Date().toISOString();
      await currentRunDb.updateRun({
        start: startDate,
        state: RunState.Started,
      });
      await startBackgroundLocationTask();
      updateRun({
        start: startDate,
        state: RunState.Started,
      });
      startTimer();
      startDatabaseSync();
    } catch (error) {
      logError(error, "failed to start the run");
    }
  };

  const stop = async () => {
    try {
      await currentRunDb.updateRun({
        state: RunState.Stopped,
      });
      await stopBackgroundLocationTask();
      updateRun({
        state: RunState.Stopped,
      });
      stopTimer();
      stopDatabaseSync();
    } catch (error) {
      logError(error, "failed to stop the run");
    }
  };

  const end = async () => {
    try {
      await currentRunDb.updateRun({
        state: RunState.Finished,
      });
      await stopBackgroundLocationTask();
      updateRun({
        state: RunState.Finished,
      });
      stopTimer();
      stopDatabaseSync();
    } catch (error) {
      logError(error, "failed to end the run");
    }
  };

  const reset = async () => {
    try {
      await currentRunDb.deleteCurrentRun();
      const newRun = await currentRunDb.createCurrentRun();
      updateRun(newRun);
      resetTimer();
    } catch (error) {
      logError(error, "failed to reset the run");
    }
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
