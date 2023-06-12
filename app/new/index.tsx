import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Button from "../../components/Button";
import Clock from "../../components/Clock";
import Lock from "../../components/Lock/Lock";
import { DatabaseConnector } from "../../database/database";
import useBackgroundTimer from "../../hooks/useBackgroundTimer";
import usePath from "../../hooks/usePath";
import { Run } from "../../types/types";

const dbConnector = new DatabaseConnector();

export default function NewRun() {
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const startTime = useRef<null | string>(null);

  const { startTimer, stopTimer, resetTimer, seconds } = useBackgroundTimer();

  const { startPath, stopPath, resetPath, permissionStatus, path, distance } =
    usePath();

  const startRun = () => {
    startTime.current = dayjs().toISOString();
    startTimer();
    startPath();
    setRunning(true);
    setStarted(true);
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
    setFinished(false);
    setStarted(false);
  };

  return (
    <View style={styles.container}>
      {!permissionStatus && <Text>No location service permission</Text>}
      {permissionStatus && (
        <>
          <Clock timeInSeconds={seconds} />
          <Text style={styles.text}>Zeit: {seconds}</Text>
          <Text style={styles.text}>Distanz: {distance}</Text>
          <Text style={styles.text}>Pfad: {path.length}</Text>
          <Button
            onPress={startRun}
            text="Start"
            disabled={running || finished}
          />
          <Button
            onPress={stopRun}
            text="Stop"
            disabled={!running || finished}
          />
          <Button onPress={endRun} text="End" disabled={finished || !started} />
          <Button onPress={resetRun} text="Reset" disabled={!finished} />
        </>
      )}
      <Lock
        disabled={!started}
        toggle={finished}
        onLock={() => null}
        onUnlock={() => null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 100,
  },
  text: {
    fontSize: 24,
  },
});
