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

  console.log(run);

  const databaseSyncTimer = useRef<NodeJS.Timeout>();
  const time = useRef<number>(0);

  const loading = run === undefined;

  const { startTimer, stopTimer, resetTimer } = useBackgroundTimer(
    run?.time ?? 0,
    (time: number) => updateRun({ time }),
    () => incrementRunTime(),
  );

  useEffect(() => {
    (async () => {
      const currentRun =
        (await currentRunDb.getRun()) ?? (await currentRunDb.createRun());
      updateRun(currentRun);
    })();
  }, []);

  const updateRun = (updatedRun: Partial<CurrentRun>) => {
    setRun((prev) => ({ ...prev, ...updatedRun }));
    if (updatedRun.time) {
      time.current = updatedRun.time;
    }
  };

  const incrementRunTime = () => {
    time.current = time.current + 1;
    setRun((prev) => (prev ? { ...prev, time: prev.time + 1 } : prev));
  };

  const startDatabaseSync = () => {
    databaseSyncTimer.current = setInterval(async () => {
      const distance = await currentRunDb.getDistance();
      updateRun({ distance });
      if (time.current !== undefined) {
        await currentRunDb.updateRun({
          time: time.current,
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
      logError("failed to start the run", error);
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
      logError("failed to stop the run", error);
    }
  };

  const end = async () => {
    try {
      const endDate = new Date().toISOString();
      await currentRunDb.updateRun({
        state: RunState.Finished,
        end: endDate,
      });
      await stopBackgroundLocationTask();
      updateRun({
        state: RunState.Finished,
        end: endDate,
      });
      stopTimer();
      stopDatabaseSync();
    } catch (error) {
      logError("failed to end the run", error);
    }
  };

  const reset = async () => {
    try {
      await currentRunDb.deleteRun();
      const newRun = await currentRunDb.createRun();
      updateRun(newRun);
      resetTimer();
    } catch (error) {
      logError("failed to reset the run", error);
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
