import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import Button from "../../components/Button";
import Clock from "../../components/Clock";
import Lock from "../../components/Lock/Lock";
import { DatabaseConnector } from "../../database/database";
import useBackgroundLocation from "../../hooks/useBackgroundLocation";
import useBackgroundPath from "../../hooks/useBackgroundPath";
import useBackgroundTimer from "../../hooks/useBackgroundTimer";
import usePath from "../../hooks/usePath";
import { Run } from "../../types/types";

const dbConnector = new DatabaseConnector();

export default function NewRun() {
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(true);
  const startTime = useRef<null | string>(null);

  const { startTimer, stopTimer, resetTimer, seconds } = useBackgroundTimer();

  const { startPath, stopPath, resetPath, permissionStatus, path, distance } =
    usePath();

  const bgDistance = useBackgroundPath();

  console.log(bgDistance);

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
    setLocked(true);
  };

  return (
    <View style={styles.container}>
      {!permissionStatus && <Text>No location service permission</Text>}
      {permissionStatus && (
        <>
          <Clock timeInSeconds={seconds} onStart={startRun} started={started} />
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>
              Distanz: {Math.floor(distance) / 1000} km
            </Text>
          </View>
        </>
      )}
      <View style={styles.controls}>
        <Lock
          disabled={!started || finished}
          toggle={finished}
          onLock={() => setLocked(true)}
          onUnlock={() => setLocked(false)}
        />
        {started && !running ? (
          <Button
            onPress={startRun}
            text="Weiter"
            disabled={locked || finished}
          />
        ) : (
          <Button
            onPress={stopRun}
            text="Stopp"
            disabled={!running || finished || locked}
          />
        )}
        {!finished ? (
          <Button
            onPress={endRun}
            text="Beenden"
            disabled={finished || !started || locked}
          />
        ) : (
          <Button onPress={resetRun} text="Zurücksetzen" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 16,
    backgroundColor: "black",
    marginTop: StatusBar.currentHeight,
  },
  controls: {
    flex: 1,
    gap: 16,
    alignItems: "center",
  },
  distanceContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "teal",
    borderWidth: 2,
    padding: 16,
    width: 300,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 40,
    color: "white",
  },
});
