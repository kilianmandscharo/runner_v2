import { useRouter } from "expo-router";
import { View, Text, Dimensions } from "react-native";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { currentRunDb } from "../database/currentRunDatabase";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export default function Home() {
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

  return (
    <PageContainer>
      <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
        {error && (
          <Text className="text-white">
            Fehler beim initialisieren der Datenbank
          </Text>
        )}
        {success && (
          <>
            <Button onPress={() => router.push("/new")} text="Neu" />
            <Button onPress={() => router.push("/history")} text="Läufe" />
            <Button onPress={() => router.push("/test")} text="Test" />
          </>
        )}
      </View>
    </PageContainer>
  );
}
