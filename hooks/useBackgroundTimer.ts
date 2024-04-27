import { useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AppState, AppStateStatus } from "react-native";

console.log(AppState);

export default function useBackgroundTimer(
  seconds: number,
  onSecondsChange: (seconds: number) => void,
  increment: () => void,
): {
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  seconds: number;
} {
  const timer = useRef<NodeJS.Timeout>();
  const startTime = useRef<Dayjs>();
  const secondsAtLastStop = useRef(0);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  const handleAppStateChange = async (newAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      newAppState === "active"
    ) {
      if (startTime.current) {
        if (timer.current) {
          const differenceInSeconds = dayjs().diff(startTime.current, "second");
          onSecondsChange(secondsAtLastStop.current + differenceInSeconds);
        } else {
          onSecondsChange(secondsAtLastStop.current);
        }
      }
    }
    appState.current = newAppState;
  };

  const start = () => {
    if (timer.current) {
      return;
    }
    timer.current = setInterval(() => {
      increment();
    }, 1000);
    startTime.current = dayjs();
  };

  const stop = () => {
    clearInterval(timer.current);
    timer.current = undefined;
    secondsAtLastStop.current = seconds;
  };

  const reset = () => {
    clearInterval(timer.current);
    timer.current = undefined;
    secondsAtLastStop.current = 0;
    onSecondsChange(0);
  };

  return { startTimer: start, stopTimer: stop, resetTimer: reset, seconds };
}
