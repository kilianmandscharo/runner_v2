import { useState } from "react";
import { Text, View } from "react-native";
import Button from "../../components/Button";
import Clock from "../../components/Clock";
import Lock from "../../components/Lock/Lock";
import PageContainer from "../../components/PageContainer";
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
    <PageContainer>
      <View className="flex-1 justify-center items-center">
        {!permissionGranted && <Text>No location service permission</Text>}
        {permissionGranted && (
          <>
            <Clock timeInSeconds={seconds} onStart={start} started={started} />
            <View className="justify-center items-center border-teal-600 border-2 p-4 rounded-md">
              <Text className="text-3xl text-white">
                Distanz: {Math.floor(distance) / 1000} km
              </Text>
            </View>
          </>
        )}
        <View
          className="flex-1 justify-center items-center"
          style={{ gap: 16 }}
        >
          <Lock
            disabled={!started || finished}
            toggle={finished}
            onLock={() => setLocked(true)}
            onUnlock={() => setLocked(false)}
          />
          {started && !running ? (
            <Button
              onPress={start}
              text="Weiter"
              disabled={locked || finished}
            />
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
    </PageContainer>
  );
}
