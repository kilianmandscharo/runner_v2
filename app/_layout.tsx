import { Stack } from "expo-router/stack";
import * as SystemUI from "expo-system-ui";

// Set this color here to avoid white flashes while navigating
SystemUI.setBackgroundColorAsync("#1e293b");

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
