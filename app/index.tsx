import { useRouter } from "expo-router";
import { View, Dimensions, StatusBar } from "react-native";
import Button from "../components/Button";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { currentRunDb } from "../database/index";
import { useEffect, useState } from "react";
import FullPageInfo from "../components/FullPageInfo";
// import { useEffect } from "react";
// import {
//   deleteAsync,
//   documentDirectory,
//   readDirectoryAsync,
// } from "expo-file-system";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export default function Home() {
  const [showStatusBar, setShowStatusBar] = useState<boolean>(false);

  useEffect(() => {
    setShowStatusBar(true); // use workaround for expo bullshit
  }, []);

  const { success, error } = useMigrations(currentRunDb.getDb(), migrations);

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

  if (error) {
    return <FullPageInfo text="Fehler beim initialisieren der Datenbank" />;
  }

  return (
    <View
      className="flex-1 justify-center align-center bg-slate-800 p-4"
      style={{ marginTop: StatusBar.currentHeight }}
    >
      {showStatusBar && (
        <StatusBar backgroundColor="#1e293b" barStyle="light-content" />
      )}
      <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
        {success && (
          <>
            <Button onPress={() => router.push("/new")} text="Neu" />
            <Button onPress={() => router.push("/history")} text="Läufe" />
            {/*<Button onPress={() => router.push("/test")} text="Test" />*/}
          </>
        )}
      </View>
    </View>
  );
}
