import { useState } from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import Button from "../../components/Button";
import Clock from "../../components/Clock";
import Lock from "../../components/Lock/Lock";
import useNewRun from "../../hooks/useNewRun";

export default function NewRun() {
  const [locked, setLocked] = useState<boolean>(true);

  const {
    permissionGranted,
    seconds,
    distance,
    started,
    finished,
    running,
    start,
    stop,
    end,
    reset,
  } = useNewRun();

  return (
    <View style={styles.container}>
      {!permissionGranted && <Text>No location service permission</Text>}
      {permissionGranted && (
        <>
          <Clock timeInSeconds={seconds} onStart={start} started={started} />
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
          <Button onPress={start} text="Weiter" disabled={locked || finished} />
        ) : (
          <Button
            onPress={stop}
            text="Stopp"
            disabled={!running || finished || locked}
          />
        )}
        {!finished ? (
          <Button
            onPress={end}
            text="Beenden"
            disabled={finished || !started || locked}
          />
        ) : (
          <Button onPress={reset} text="Zurücksetzen" />
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
