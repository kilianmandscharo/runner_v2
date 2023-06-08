import dayjs from "dayjs";
import { useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { DatabaseConnector } from "../../database/database";
import useBackgroundTimer from "../../hooks/useBackgroundTimer";
import useForegroundLocation from "../../hooks/useForegroundLocation";
import { newRun, Run } from "../../types/types";

const dbConnector = new DatabaseConnector();

export default function NewRun() {
  const { start, stop, reset, seconds } = useBackgroundTimer();
  const { location, permissionError } = useForegroundLocation();

  const [finished, setFinished] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const [run, setRun] = useState<Run | null>(null);

  const startRun = () => {
    const run = newRun();
    run.start = dayjs().toISOString();
    setRun(run);
    setRunning(true);
  };

  const stopRun = () => {
    stop();
    setRunning(false);
  };

  const endRun = async () => {
    setRunning(false);
    setFinished(true);
    if (!run) {
      return;
    }
    const finishedRun: Run = { ...run };
    finishedRun.end = dayjs().toISOString();
    try {
      await dbConnector.saveRun(finishedRun);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>{seconds}</Text>
      <Button onPress={start} title="Start" />
      <Button onPress={stop} title="Stop" />
      <Button onPress={reset} title="Reset" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },
});
