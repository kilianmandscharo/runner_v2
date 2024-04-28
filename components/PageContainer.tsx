import { StatusBar, View } from "react-native";
import { PropsWithChildren } from "react";
import { colors } from "../assets/colors";

export default function PageContainer({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <View
      className="flex-1 justify-center align-center bg-slate-800 p-4"
      style={{ marginTop: StatusBar.currentHeight }}
    >
      <StatusBar
        backgroundColor={colors.slate["800"]}
        barStyle="light-content"
      />
      {children}
    </View>
  );
}
