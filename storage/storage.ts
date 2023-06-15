import AsyncStorage from "@react-native-async-storage/async-storage";
import { Location } from "../types/types";

const key = "@locations";

export async function storeLocation(location: Location): Promise<void> {
  const locations = await getLocations();
  locations.push(location);
  await AsyncStorage.setItem(key, JSON.stringify(locations));
}

export async function getLocations(): Promise<Location[]> {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export async function deleteLocations(): Promise<void> {
  await AsyncStorage.removeItem(key);
}
