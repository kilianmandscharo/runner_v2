import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { DatabaseConnector } from "../../database/database";
import useBackgroundTimer from "../../hooks/useBackgroundTimer";
import usePath from "../../hooks/usePath";
import { Run } from "../../types/types";

const dbConnector = new DatabaseConnector();

export default function NewRun() {
  const [finished, setFinished] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const startTime = useRef<null | string>(null);

  const { startTimer, stopTimer, resetTimer, seconds } = useBackgroundTimer();

  const { startPath, stopPath, resetPath, error, path, distance } = usePath();

  const startRun = () => {
    startTime.current = dayjs().toISOString();
    startTimer();
    startPath();
    setRunning(true);
  };

  const stopRun = () => {
    stopTimer();
    stopPath();
    setRunning(false);
  };

  const endRun = async () => {
    stopTimer();
    stopPath();
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

  const resetRun = () => {
    startTime.current = null;
    resetTimer();
    resetPath();
  };

  return (
    <View style={styles.container}>
      {error && <Text>No location service permission</Text>}
      {!error && (
        <>
          <Text>{seconds}</Text>
          <Button onPress={startRun} title="Start" />
          <Button onPress={stopRun} title="Stop" />
          <Button onPress={endRun} title="End" />
          <Button onPress={resetRun} title="Reset" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },
});
