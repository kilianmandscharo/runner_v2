import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import Dialog from "./Dialog";
import Button from "./Button";

interface Props {
  permissionGranted: boolean;
  locationDialogClosed: boolean;
  checkPermission: () => void;
  onCloseLocationDialog: () => void;
}

export default function LocationPermissionDialog({
  permissionGranted,
  locationDialogClosed,
  checkPermission,
  onCloseLocationDialog,
}: Props) {
  return (
    <Dialog
      open={!permissionGranted && !locationDialogClosed}
      text="Aktiviere deinen Standort um einen neuen Lauf zu starten."
      cancelButton={
        <Button
          text="Fertig"
          onPress={() => {
            onCloseLocationDialog();
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
  );
}
