import { Text, View } from "react-native";
import Clock from "../../components/Run/Clock";
import useLocationPermission from "../../hooks/useLocationPermission";
import PageContainer from "../../components/PageContainer";
import useRun from "../../hooks/useRun";
import { RunState } from "../../types/types";
import LocationPermissionDialog from "../../components/Dialog/LocationPermissionDialog";
import RunControl from "../../components/Run/RunControl";
import FullPageInfo from "../../components/FullPageInfo";

export default function NewRun() {
  const {
    checkPermission,
    permissionGranted,
    locationDialogClosed,
    onCloseLocationDialog,
  } = useLocationPermission();

  const { seconds, distance, state, start, stop, end, reset, loading } =
    useRun();

  if (loading) {
    return <FullPageInfo text="Lädt..." />;
  }

  return (
    <PageContainer>
      <View className="flex-1 justify-center items-center">
        <Clock
          timeInSeconds={seconds}
          onStart={start}
          started={state !== RunState.Prestart}
          disabled={!permissionGranted}
        />
        <View className="justify-center items-center p-6 rounded-md bg-slate-700 shadow-xl w-11/12">
          <Text className="text-3xl text-white">
            Distanz: {(Math.floor(distance) / 1000).toFixed(2)} km
          </Text>
        </View>
        <RunControl
          state={state}
          start={start}
          stop={stop}
          end={end}
          reset={reset}
        />
      </View>
      <LocationPermissionDialog
        permissionGranted={permissionGranted}
        locationDialogClosed={locationDialogClosed}
        checkPermission={checkPermission}
        onCloseLocationDialog={onCloseLocationDialog}
      />
    </PageContainer>
  );
}
