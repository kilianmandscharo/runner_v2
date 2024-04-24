import { useEffect, useState } from "react";
import * as Location from "expo-location";

enum LOCATION_ERROR {
  FG_DENIED = "Foreground permission denied",
  BG_DENIED = "Background permission denied",
  SERVICE_DISABLED = "Location services disabled",
}

export default function useLocationPermission(): {
  checkPermission: () => void;
  permissionGranted: boolean;
  locationDialogClosed: boolean;
  onCloseLocationDialog: () => void;
} {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(true);
  const [locationDialogClosed, setLocationDialogClosed] =
    useState<boolean>(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const requestPermisions = async (): Promise<LOCATION_ERROR | null> => {
    if (
      (await Location.requestForegroundPermissionsAsync())["status"] !==
      "granted"
    ) {
      return LOCATION_ERROR.FG_DENIED;
    }

    if (
      (await Location.requestBackgroundPermissionsAsync())["status"] !==
      "granted"
    ) {
      return LOCATION_ERROR.BG_DENIED;
    }

    if (!(await Location.hasServicesEnabledAsync())) {
      return LOCATION_ERROR.SERVICE_DISABLED;
    }

    return null;
  };

  const checkPermission = () => {
    requestPermisions()
      .then((locationError) => {
        if (locationError !== null) {
          setPermissionGranted(false);
        } else {
          setPermissionGranted(true);
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
      });
  };

  const onCloseLocationDialog = () => {
    setLocationDialogClosed(true);
  };

  return {
    checkPermission,
    permissionGranted,
    locationDialogClosed,
    onCloseLocationDialog,
  };
}
