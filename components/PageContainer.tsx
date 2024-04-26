import { StatusBar, View } from "react-native";
import { PropsWithChildren } from "react";

StatusBar.setBackgroundColor("#1e293b");

export default function PageContainer({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <View
      className="flex-1 justify-center align-center bg-slate-800 p-4"
      style={{ marginTop: StatusBar.currentHeight }}
    >
      <StatusBar backgroundColor="#1e293b" barStyle="light-content" />
      {children}
    </View>
  );
}
