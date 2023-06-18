import { StatusBar, View } from "react-native";
import { PropsWithChildren } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export default function PageContainer({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <View
      className="flex-1 justify-center align-center bg-slate-800 p-4"
      style={{ marginTop: StatusBar.currentHeight }}
    >
      <ExpoStatusBar backgroundColor="#1e293b" style="light" />
      {children}
    </View>
  );
}
