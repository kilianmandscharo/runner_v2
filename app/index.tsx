import { useEffect, useState } from "react";
import { View, Dimensions, StatusBar } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export default function Home() {
  const [showStatusBar, setShowStatusBar] = useState<boolean>(false);

  useEffect(() => {
    setShowStatusBar(true); // use workaround for expo bullshit
  }, []);

  const router = useRouter();

  // useEffect(() => {
  //   (async () => {
  //     const dir = documentDirectory;
  //     if (!dir) return;
  //     const result = await readDirectoryAsync(dir + "SQLite");
  //     for (const file of result) {
  //       await deleteAsync(dir + "SQLite" + "/" + file);
  //     }
  //     const afterDeletion = await readDirectoryAsync(dir + "SQLite");
  //     console.log(afterDeletion);
  //   })();
  // }, []);
  //

  return (
    <View
      className="flex-1 justify-center align-center bg-slate-800 p-4"
      style={{ marginTop: StatusBar.currentHeight }}
    >
      {showStatusBar && (
        <StatusBar backgroundColor="#1e293b" barStyle="light-content" />
      )}
      <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
        <Button onPress={() => router.push("/new")} text="Neu" />
        <Button onPress={() => router.push("/history")} text="Läufe" />
      </View>
    </View>
  );
}
