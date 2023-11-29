import MapView, { Polyline } from "react-native-maps";
import { Run } from "../types/types";
import { PROVIDER_GOOGLE } from "react-native-maps";

interface Props {
  run: Run | null;
}

export default function Map({ run }: Props) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ width: "100%", height: "100%" }}
      region={{
        latitude: run?.path[0].lat ?? 0,
        longitude: run?.path[0].lon ?? 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Polyline
        strokeWidth={4}
        strokeColor="#0d9488"
        coordinates={
          run?.path.map((l) => ({
            longitude: l.lon,
            latitude: l.lat,
          })) ?? []
        }
      />
    </MapView>
  );
}
