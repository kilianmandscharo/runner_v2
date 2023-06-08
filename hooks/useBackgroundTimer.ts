import { useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AppState, AppStateStatus } from "react-native";

export default function useBackgroundTimer(): {
  start: () => void;
  stop: () => void;
  reset: () => void;
  seconds: number;
} {
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<NodeJS.Timer>();
  const startTime = useRef<Dayjs>();
  const secondsAtLastStop = useRef(0);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
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
        const differenceInSeconds = dayjs().diff(startTime.current, "second");
        setSeconds(secondsAtLastStop.current + differenceInSeconds);
      }
    }
    appState.current = newAppState;
  };

  const start = () => {
    if (timer.current) {
      return;
    }
    timer.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
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
    setSeconds(0);
  };

  return { start, stop, reset, seconds };
}
