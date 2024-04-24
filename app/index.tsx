import { useRouter } from "expo-router";
import { View, Text, Dimensions } from "react-native";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { db } from "../database/currentRunDatabase";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export default function Home() {
  const { success, error } = useMigrations(db, migrations);

  const router = useRouter();

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
          </>
        )}
      </View>
    </PageContainer>
  );
}
