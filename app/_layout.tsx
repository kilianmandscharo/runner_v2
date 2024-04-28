import { Stack } from "expo-router/stack";
import * as SystemUI from "expo-system-ui";
import { colors } from "../assets/colors";

// Set this color here to avoid white flashes while navigating
SystemUI.setBackgroundColorAsync(colors.slate["800"]);

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
