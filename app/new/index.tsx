import { useState } from "react";
import { Text, View } from "react-native";
import Button from "../../components/Button";
import Clock from "../../components/Clock";
import Lock from "../../components/Lock/Lock";
import Dialog from "../../components/Dialog";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import useLocationPermission from "../../hooks/useLocationPermission";
import useNewRun from "../../hooks/useNewRun";
import PageContainer from "../../components/PageContainer";

export default function NewRun() {
  const [locked, setLocked] = useState<boolean>(true);
  const [locationDialogClosed, setLocationDialogClosed] =
    useState<boolean>(false);

  const { checkPermission, permissionGranted } = useLocationPermission();

  const {
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
        <Clock
          timeInSeconds={seconds}
          onStart={start}
          started={started}
          disabled={!permissionGranted}
        />
        <View className="justify-center items-center p-6 rounded-md bg-slate-700 shadow-xl w-11/12">
          <Text className="text-3xl text-white">
            Distanz: {Math.floor(distance) / 1000} km
          </Text>
        </View>
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
            <Button
              onPress={() => {
                reset();
                setLocked(true);
              }}
              text="Zurücksetzen"
            />
          )}
        </View>
      </View>
      <Dialog
        open={!permissionGranted && !locationDialogClosed}
        text="Aktiviere deinen Standort um einen neuen Lauf zu starten."
        cancelButton={
          <Button
            text="Fertig"
            onPress={() => {
              setLocationDialogClosed(true);
              checkPermission();
            }}
            variant="secondary"
          />
        }
        acceptButton={
          <Button
            text="Einstellungen"
            onPress={() =>
              startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS)
            }
          />
        }
      />
    </PageContainer>
  );
}
